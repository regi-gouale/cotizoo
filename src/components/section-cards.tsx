import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { prisma } from "@/lib/prisma";
import { TontineStatus, User, UserTontine } from "@prisma/client";
import { CreditCardIcon, DollarSignIcon, Folder } from "lucide-react";

export async function SectionCards({
  user,
}: {
  user: User & {
    tontines?: (UserTontine & { tontine: { status: TontineStatus } })[];
  };
}) {
  // Get user's tontines from Prisma
  const getTontines = async () => {
    const tontines = await prisma.tontine.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    });
    return tontines;
  };

  const tontines = await getTontines();

  const getNumberOfTontines = () => {
    return tontines.length; // Replace with actual API call
  };
  const getActiveTontines = () => {
    // Get the active tontines
    if (!tontines) {
      return 0;
    }
    const activeTontines = tontines.filter(
      (userTontine) => userTontine.status === TontineStatus.ACTIVE,
    );
    return activeTontines.length; // Replace with actual API call
  };
  const getUpcomingPayments = () => {
    // Simulate an API call to get the upcoming payments
    return "1,250.00 €"; // Replace with actual API call
  };
  const getTotalReceivable = () => {
    // Simulate an API call to get the total receivable
    return "12,250.00 €"; // Replace with actual API call
  };
  const getPendingPayments = () => {
    // Simulate an API call to get the pending payments
    return "250.00 €"; // Replace with actual API call
  };
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <DashboardSectionCard
        title="Mes Tontines"
        value={getNumberOfTontines()}
        action={`${(getActiveTontines() / getNumberOfTontines()) * 100}%`}
        icon={<Folder />}
        children={`Dont ${getActiveTontines()} tontine${getActiveTontines() > 1 ? "s" : ""} actives`}
      />
      <DashboardSectionCard
        title="Prélèvements à venir"
        value={getUpcomingPayments()}
        // action="+12.5%"
        icon={<CreditCardIcon />}
        children="Total prélèvements de ce mois"
        description="Prélèvements automatiques"
      />
      <DashboardSectionCard
        title="Somme à récevoir"
        value="12,250.00 €"
        action="+12.5%"
        icon={<DollarSignIcon />}
        children="Sommes à recevoir cette année"
        description="Total des sommes à recevoir"
      />
      <DashboardSectionCard
        title="Paiements en attente"
        value="250.00 €"
        // action="+12.5%"
        icon={<CreditCardIcon />}
        children="Total des paiements en attente"
        // description="Total des paiements en attente"
      />
    </div>
  );
}
