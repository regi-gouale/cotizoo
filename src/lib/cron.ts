import { sendTemplateEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { $Enums, TontineRole, TransactionStatus } from "@prisma/client";
import { addDays, addMonths, addYears, format, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import schedule from "node-schedule";

// Types réutilisables pour améliorer la lisibilité
type User = {
  id: string;
  name: string;
  email: string;
  status: $Enums.UserStatus;
  role: $Enums.UserRole;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId: string | null;
  stripePaymentMethodId: string | null;
  stripeMandateId: string | null;
};

type Tontine = {
  id: string;
  name: string;
  type: $Enums.TontineType;
  status: $Enums.TontineStatus;
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
  createdAt: Date;
  updatedAt: Date;
};

type Transaction = {
  id: string;
  type: $Enums.TransactionType;
  status: $Enums.TransactionStatus;
  userId: string;
  tontineId: string;
  amount: number;
  createdAt: Date;
  paymentMethod: string | null;
  reference: string | null;
  user: User;
  tontine: Tontine;
};

type ScheduledDebit = {
  id: string;
  status: $Enums.TransactionStatus;
  userId: string;
  transactionId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  executionDate: Date;
  createdAt: Date;
  user: User;
  transaction: Transaction;
};

// Constantes
const CURRENCY = "eur";
const DAILY_CRON_SCHEDULE = "0 2 * * *";

// Utilitaires de date
const getDateRangeForDay = (date: Date) => {
  const startDate = startOfDay(date);
  const endDate = new Date(startDate);
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
};

export const startCronJob = async () => {
  // Exécuter le job tous les jours à 02h00
  schedule.scheduleJob(DAILY_CRON_SCHEDULE, async () => {
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

  console.log(`Traitement de ${directDebits.length} prélèvements en attente.`);

  for (const debit of directDebits) {
    console.log(`Traitement du prélèvement: ${debit.id}`);
    try {
      // Vérifier que le client Stripe existe
      if (!debit.user.stripeCustomerId) {
        throw new Error(
          `L'utilisateur ${debit.user.id} n'a pas d'ID client Stripe`,
        );
      }

      // Vérifier que la méthode de paiement existe
      if (!debit.user.stripePaymentMethodId) {
        throw new Error(
          `L'utilisateur ${debit.user.id} n'a pas de méthode de paiement Stripe`,
        );
      }

      // Création du paiement via Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        customer: debit.user.stripeCustomerId,
        amount: debit.amount,
        currency: debit.currency,
        confirm: true,
        payment_method_types: ["sepa_debit"],
        payment_method: debit.user.stripePaymentMethodId,
      });

      console.log(`Intent de paiement créé: ${paymentIntent.id}`);

      // Mise à jour en transaction atomique du statut du prélèvement et de la transaction
      await prisma.$transaction([
        prisma.scheduledDirectDebit.update({
          where: { id: debit.id },
          data: { status: TransactionStatus.COMPLETED },
        }),
        prisma.transaction.update({
          where: { id: debit.transaction.id },
          data: { status: TransactionStatus.COMPLETED },
        }),
      ]);

      await notifyUserAboutSuccessfulPayment(debit);

      console.log(`✅ Paiement réussi pour ${debit.user.email}`);
    } catch (error) {
      console.error(
        `❌ Erreur lors du traitement du prélèvement ${debit.id}:`,
        error,
      );

      // Mise à jour en transaction atomique des statuts en cas d'échec
      await prisma.$transaction([
        prisma.scheduledDirectDebit.update({
          where: { id: debit.id },
          data: { status: TransactionStatus.FAILED },
        }),
        prisma.transaction.update({
          where: { id: debit.transaction.id },
          data: { status: TransactionStatus.FAILED },
        }),
      ]);

      // Notification par email à l'administrateur de la tontine
      await notifyAdminAboutFailedPayment(debit);
    }
  }
}

/**
 * Notifie l'administrateur d'une tontine en cas d'échec de prélèvement
 */
async function notifyAdminAboutFailedPayment(debit: ScheduledDebit) {
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
            <li>Date prévue : ${format(debit.executionDate, "PPP", { locale: fr })}</li>
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
          date: format(debit.executionDate, "PPP", { locale: fr }),
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
  const today = startOfDay(now);

  for (const tontine of activeTontines) {
    // Calculer la prochaine date de cotisation selon la fréquence
    const nextContributionDate = calculateNextContributionDate(
      tontine.frequency,
      tontine.startDate,
    );

    // Vérifier si la contribution est déjà programmée
    const existingScheduledContributions =
      await prisma.scheduledDirectDebit.findMany({
        where: {
          transaction: {
            tontineId: tontine.id,
            type: "COTISATION",
          },
          executionDate: {
            gte: now,
          },
        },
      });

    // Si des contributions sont déjà programmées, ne rien faire
    if (existingScheduledContributions.length > 0) {
      console.log(
        `Des cotisations sont déjà programmées pour la tontine ${tontine.name} le ${format(nextContributionDate, "dd/MM/yyyy")}`,
      );
      continue;
    }

    // Vérifier si la prochaine date est déjà passée et qu'elle tombe aujourd'hui ou plus tard
    if (nextContributionDate >= today) {
      // Pour chaque membre, créer une transaction et programmer un prélèvement
      for (const userTontine of tontine.members) {
        // Vérifier s'il a une méthode de paiement valide
        const defaultPaymentMethod = userTontine.user.stripePaymentMethodId;

        if (!defaultPaymentMethod) {
          console.log(
            `⚠️ Pas de méthode de paiement pour ${userTontine.user.email}`,
          );
          continue;
        }

        // Vérifier si un prélèvement n'est pas déjà prévu pour cette date et ce membre
        const { startDate, endDate } = getDateRangeForDay(nextContributionDate);

        const existingScheduledDebit =
          await prisma.scheduledDirectDebit.findFirst({
            where: {
              userId: userTontine.userId,
              transaction: {
                tontineId: tontine.id,
                type: "COTISATION",
              },
              executionDate: {
                gte: startDate,
                lte: endDate,
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
              currency: CURRENCY,
              paymentMethodId: defaultPaymentMethod,
              executionDate: nextContributionDate,
              status: "PENDING",
            },
          });

          console.log(
            `✅ Prélèvement programmé pour ${userTontine.user.email} le ${format(nextContributionDate, "dd/MM/yyyy")}`,
          );
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
): Date {
  const now = new Date();
  const start = new Date(startDate);
  let nextDate = new Date(start);

  // Ajuster la date selon la fréquence
  switch (frequency) {
    case "WEEKLY":
      // Trouver le prochain jour de la semaine correspondant à la date de départ
      while (nextDate <= now) {
        nextDate = addDays(nextDate, 7);
      }
      break;

    case "BIWEEKLY":
      while (nextDate <= now) {
        nextDate = addDays(nextDate, 14);
      }
      break;

    case "MONTHLY":
      while (nextDate <= now) {
        nextDate = addMonths(nextDate, 1);
      }
      break;

    case "QUARTERLY":
      while (nextDate <= now) {
        nextDate = addMonths(nextDate, 3);
      }
      break;

    case "SEMIANNUAL":
      while (nextDate <= now) {
        nextDate = addMonths(nextDate, 6);
      }
      break;

    case "YEARLY":
      while (nextDate <= now) {
        nextDate = addYears(nextDate, 1);
      }
      break;

    default:
      throw new Error(`Fréquence non prise en charge: ${frequency}`);
  }

  return nextDate;
}

async function notifyUserAboutSuccessfulPayment(debit: ScheduledDebit) {
  try {
    const userName = debit.user.name || debit.user.email;
    const tontineName = debit.transaction.tontine.name;

    await sendTemplateEmail(
      debit.user.email,
      `Prélèvement réussi pour la tontine ${tontineName}`,
      `<div>
        <h2>Prélèvement automatique réussi</h2>
        <p>Bonjour ${userName},</p>
        <p>Votre prélèvement automatique pour la cotisation à la tontine <strong>${tontineName}</strong> a été effectué avec succès.</p>
        <p>Détails de la transaction :</p>
        <ul>
          <li>Montant : ${(debit.amount / 100).toFixed(2)} ${debit.currency.toUpperCase()}</li>
          <li>Date prévue : ${format(debit.executionDate, "PPP", { locale: fr })}</li>
          <li>ID de transaction : ${debit.transaction.id}</li>
        </ul>
        <p>Merci de votre confiance !</p>
        <p>Cordialement,<br>L'équipe Cotizoo</p>
      </div>`,
      {
        userName,
        tontineName,
        amount: (debit.amount / 100).toFixed(2),
        currency: debit.currency.toUpperCase(),
        date: format(debit.executionDate, "PPP", { locale: fr }),
        transactionId: debit.transaction.id,
      },
    );

    console.log(`📧 Email de notification envoyé à ${debit.user.email}`);
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de la notification au membre:",
      error,
    );
  }
}
