import { FeatureItem } from "@/components/ui/feature-item";
import {
  BarChart3,
  CheckCircle,
  Settings,
  Shield,
  Umbrella,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <main className="w-full px-4" id="features">
      <div className="container mx-auto flex flex-col items-center text-center gap-y-10 justify-center my-12">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 font-title max-w-5xl">
          Notre application révolutionnaire vous offre tout ce dont vous avez
          besoin :
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <FeatureItem
            title="Automatisation intelligente"
            description="Plus besoin de se casser la tête pour savoir à qui faire le virement. Notre système gère automatiquement le prélèvement et le virement des fonds."
            icon={CheckCircle}
          />
          <FeatureItem
            title="Sécurité renforcée"
            description="Vos fonds sont protégés grâce à un compte séquestre et des technologies de pointe."
            icon={Shield}
          />
          <FeatureItem
            title="Assurance intégrée"
            description="Protégez vos investissements avec une assurance qui couvre les imprévus."
            icon={Umbrella}
          />
          <FeatureItem
            title="Tableau de bord intuitif"
            description="Suivez en temps réel l'état de vos tontines dans une interface simple."
            icon={BarChart3}
          />
          <FeatureItem
            title="Flexibilité totale"
            description="Configurez vos tontines selon vos besoins : durée, montant, fréquence et plus encore."
            className=""
            icon={Settings}
          />
        </div>
      </div>
    </main>
  );
}
