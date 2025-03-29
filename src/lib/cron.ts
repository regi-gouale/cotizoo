import { $Enums, TontineRole, TransactionStatus } from "@prisma/client";
import schedule from "node-schedule";
import { sendTemplateEmail } from "./email";
import { prisma } from "./prisma";
import { stripe } from "./stripe";

export const startCronJob = async () => {
  // Exécuter le job toutes les heures (0 * * * *)
  schedule.scheduleJob("* * * * *", async () => {
    await processScheduledDebits();
    await scheduleUpcomingContributions();
  });

  console.log("🚀 Cron Job démarré !");
};

/**
 * Traite les prélèvements automatiques programmés dont la date d'exécution est arrivée
 */
async function processScheduledDebits() {
  console.log("🔄 Vérification des paiements programmés...");

  const now = new Date();
  const directDebits = await prisma.scheduledDirectDebit.findMany({
    where: { status: TransactionStatus.PENDING, executionDate: { lte: now } },
    include: {
      transaction: {
        include: {
          tontine: true,
          user: true,
        },
      },
      user: true,
    },
  });

  if (directDebits.length === 0) {
    console.log("Aucun prélèvement à traiter.");
    return;
  }

  for (const debit of directDebits) {
    console.log(`Processing debit: ${debit.id}`);
    try {
      // Création du paiement via Stripe
      await stripe.paymentIntents.create({
        customer: debit.user.stripeCustomerId || undefined,
        amount: debit.amount,
        currency: debit.currency,
        confirm: true,
        payment_method_types: ["sepa_debit"],
        payment_method: debit.user.stripePaymentMethodId || undefined,
      });

      // Mise à jour du statut du prélèvement
      await prisma.scheduledDirectDebit.update({
        where: { id: debit.id },
        data: { status: TransactionStatus.COMPLETED },
      });

      // Mise à jour du statut de la transaction associée
      await prisma.transaction.update({
        where: { id: debit.transaction.id },
        data: { status: TransactionStatus.COMPLETED },
      });

      console.log(`✅ Paiement réussi pour ${debit.userId}`);
    } catch (error) {
      console.error(
        `Erreur lors du traitement du prélèvement ${debit.id}:`,
        error,
      );
      // Mise à jour du statut en cas d'échec
      await prisma.scheduledDirectDebit.update({
        where: { id: debit.id },
        data: { status: TransactionStatus.FAILED },
      });

      await prisma.transaction.update({
        where: { id: debit.transaction.id },
        data: { status: TransactionStatus.FAILED },
      });

      console.error(`Error processing debit ${debit.id}:`, error);

      // Notification par email à l'administrateur de la tontine
      await notifyAdminAboutFailedPayment(debit);
    }
  }
}

/**
 * Notifie l'administrateur d'une tontine en cas d'échec de prélèvement
 */
async function notifyAdminAboutFailedPayment(
  debit: {
    user: {
      status: $Enums.UserStatus;
      image: string | null;
      id: string;
      name: string;
      role: $Enums.UserRole;
      email: string;
      emailVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
      stripeCustomerId: string | null;
      stripePaymentMethodId: string | null;
      stripeMandateId: string | null;
    };
    transaction: {
      tontine: {
        type: $Enums.TontineType;
        status: $Enums.TontineStatus;
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        frequency: $Enums.TontineFrequency;
        contributionPerMember: number | null;
        startDate: Date;
        endDate: Date;
        maxMembers: number;
        penaltyFee: number | null;
        allocationMethod: $Enums.AllocationMethod;
        rules: string | null;
        beneficiariesOrder: string[];
        totalContributions: number | null;
      };
      user: {
        status: $Enums.UserStatus;
        image: string | null;
        id: string;
        name: string;
        role: $Enums.UserRole;
        email: string;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        stripeCustomerId: string | null;
        stripePaymentMethodId: string | null;
        stripeMandateId: string | null;
      };
    } & {
      type: $Enums.TransactionType;
      status: $Enums.TransactionStatus;
      userId: string;
      amount: number;
      id: string;
      createdAt: Date;
      tontineId: string;
      paymentMethod: string | null;
      reference: string | null;
    };
  } & {
    status: $Enums.TransactionStatus;
    userId: string;
    amount: number;
    id: string;
    createdAt: Date;
    transactionId: string;
    currency: string;
    paymentMethodId: string;
    executionDate: Date;
  },
) {
  try {
    // Récupérer les administrateurs de la tontine
    const tontineAdmins = await prisma.userTontine.findMany({
      where: {
        tontineId: debit.transaction.tontineId,
        role: TontineRole.ADMIN,
      },
      include: {
        user: true,
      },
    });

    // Pour chaque administrateur, envoyer un email de notification
    for (const admin of tontineAdmins) {
      const userName = debit.user.name || debit.user.email;
      const tontineName = debit.transaction.tontine.name;

      await sendTemplateEmail(
        admin.user.email,
        `Échec de prélèvement pour la tontine ${tontineName}`,
        `<div>
          <h2>Échec de prélèvement automatique</h2>
          <p>Bonjour ${admin.user.name || "Administrateur"},</p>
          <p>Le prélèvement automatique pour la cotisation de <strong>${userName}</strong> à la tontine <strong>${tontineName}</strong> a échoué.</p>
          <p>Détails de la transaction :</p>
          <ul>
            <li>Montant : ${(debit.amount / 100).toFixed(2)} ${debit.currency.toUpperCase()}</li>
            <li>Date prévue : ${debit.executionDate.toLocaleDateString()}</li>
            <li>ID de transaction : ${debit.transaction.id}</li>
          </ul>
          <p>Nous vous recommandons de contacter le membre concerné pour régulariser la situation.</p>
          <p>Cordialement,<br>L'équipe Cotizoo</p>
        </div>`,
        {
          userName,
          tontineName,
          amount: (debit.amount / 100).toFixed(2),
          currency: debit.currency.toUpperCase(),
          date: debit.executionDate.toLocaleDateString(),
          transactionId: debit.transaction.id,
        },
      );

      console.log(`📧 Email de notification envoyé à ${admin.user.email}`);
    }
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de la notification aux administrateurs:",
      error,
    );
  }
}

/**
 * Programme les prochaines cotisations selon la fréquence des tontines
 */
async function scheduleUpcomingContributions() {
  console.log("📅 Programmation des futures cotisations...");

  // Récupérer les tontines actives
  const activeTontines = await prisma.tontine.findMany({
    where: { status: "ACTIVE" },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (const tontine of activeTontines) {
    // Calculer la prochaine date de cotisation selon la fréquence
    const nextContributionDate = calculateNextContributionDate(
      tontine.frequency,
      tontine.startDate,
    );

    // Vérifier si la prochaine date est déjà passée et qu'elle tombe aujourd'hui ou plus tard
    if (nextContributionDate >= today) {
      // Pour chaque membre, créer une transaction et programmer un prélèvement
      for (const userTontine of tontine.members) {
        // Vérifier s'il a une méthode de paiement valide
        const defaultPaymentMethod = userTontine.user.stripePaymentMethodId;

        if (defaultPaymentMethod && defaultPaymentMethod.length > 0) {
          // Vérifier si un prélèvement n'est pas déjà prévu pour cette date et ce membre
          const existingScheduledDebit =
            await prisma.scheduledDirectDebit.findFirst({
              where: {
                userId: userTontine.userId,
                transaction: {
                  tontineId: tontine.id,
                  type: "COTISATION",
                },
                executionDate: {
                  gte: new Date(nextContributionDate.setHours(0, 0, 0, 0)),
                  lt: new Date(nextContributionDate.setHours(23, 59, 59, 999)),
                },
              },
            });

          if (!existingScheduledDebit) {
            // Créer la transaction
            const contribution =
              userTontine.contribution || tontine.contributionPerMember || 0;

            const transaction = await prisma.transaction.create({
              data: {
                userId: userTontine.userId,
                tontineId: tontine.id,
                amount: contribution,
                type: "COTISATION",
                status: "PENDING",
                paymentMethod: defaultPaymentMethod,
              },
            });

            // Programmer le prélèvement automatique
            await prisma.scheduledDirectDebit.create({
              data: {
                userId: userTontine.userId,
                transactionId: transaction.id,
                amount: Math.round(contribution * 100), // Conversion en centimes pour Stripe
                currency: "eur",
                paymentMethodId: defaultPaymentMethod,
                executionDate: nextContributionDate,
                status: "PENDING",
              },
            });

            console.log(
              `✅ Prélèvement programmé pour ${userTontine.user.email} le ${nextContributionDate.toLocaleDateString()}`,
            );
          }
        }
      }
    }
  }
}

/**
 * Calcule la prochaine date de cotisation selon la fréquence
 */
function calculateNextContributionDate(
  frequency: string,
  startDate: string | number | Date,
) {
  const now = new Date();
  const start = new Date(startDate);
  let nextDate = new Date(start);

  // Ajuster la date selon la fréquence
  switch (frequency) {
    case "WEEKLY":
      // Trouver le prochain jour de la semaine correspondant à la date de départ
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 7);
      }
      break;

    case "BIWEEKLY":
      while (nextDate <= now) {
        nextDate.setDate(nextDate.getDate() + 14);
      }
      break;

    case "MONTHLY":
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      break;

    case "QUARTERLY":
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 3);
      }
      break;

    case "SEMIANNUAL":
      while (nextDate <= now) {
        nextDate.setMonth(nextDate.getMonth() + 6);
      }
      break;

    case "YEARLY":
      while (nextDate <= now) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
      break;

    default:
      throw new Error(`Fréquence non prise en charge: ${frequency}`);
  }

  return nextDate;
}
