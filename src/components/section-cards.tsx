import { DashboardSectionCard } from "@/components/dashboard/dashboard-section-card";
import { CreditCardIcon, DollarSignIcon } from "lucide-react";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <DashboardSectionCard
        title="Mes Tontines"
        value={3}
        // action="+12.5%"
        icon={<DollarSignIcon />}
        children="Tontines actives"
      />
      <DashboardSectionCard
        title="Prélèvements à venir"
        value="1,250.00 €"
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
