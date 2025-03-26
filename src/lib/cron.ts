import { TransactionStatus } from "@prisma/client";
import schedule from "node-schedule";
import { prisma } from "./prisma";
import { stripe } from "./stripe";

export const startCronJob = async () => {
  schedule.scheduleJob("* * * * *", async () => {
    // Your cron job logic here
    console.log("🔄 Vérification des paiements programmés...");

    const now = new Date();
    const directDebits = await prisma.scheduledDirectDebit.findMany({
      where: { status: TransactionStatus.PENDING, executionDate: { lte: now } },
    });

    for (const debit of directDebits) {
      console.log(`Processing debit: ${debit.id}`);
      try {
        await stripe.paymentIntents.create({
          amount: debit.amount,
          currency: debit.currency,
          confirm: true,
          payment_method_types: ["sepa_debit"],
          payment_method: debit.paymentMethodId,
        });

        await prisma.scheduledDirectDebit.update({
          where: { id: debit.id },
          data: { status: TransactionStatus.COMPLETED },
        });
        console.log(`✅ Paiement réussi pour ${debit.userId}`);
      } catch (error) {
        await prisma.scheduledDirectDebit.update({
          where: { id: debit.id },
          data: { status: TransactionStatus.FAILED },
        });
        console.error(`Error processing debit ${debit.id}:`, error);
      }
    }
  });
  console.log("🚀 Cron Job démarré !");
};
