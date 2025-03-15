import { CheckCircle } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="w-full px-4" id="features">
      <div className="container mx-auto flex flex-col items-center text-center gap-y-10 justify-center my-12">
        <h2 className="text-2xl font-bold mb-6 font-title">
          Notre application révolutionnaire vous offre tout ce dont vous avez
          besoin :
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-left">
          <FeatureItem
            title="Automatisation intelligente"
            description="Plus besoin de calculs manuels ou de suivi fastidieux. Gestion automatique des fonds."
          />
          <FeatureItem
            title="Sécurité renforcée"
            description="Vos fonds sont protégés grâce à un compte séquestre et des technologies de pointe."
          />
          <FeatureItem
            title="Assurance intégrée"
            description="Protégez vos investissements avec une assurance qui couvre les imprévus."
          />
          <FeatureItem
            title="Tableau de bord intuitif"
            description="Suivez en temps réel l'état de vos tontines dans une interface simple."
          />
          <FeatureItem
            title="Flexibilité totale"
            description="Configurez vos tontines selon vos besoins : durée, montant, fréquence et plus encore."
            className="md:col-span-2"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureItem(props: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-start gap-x-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:scale-105 duration-500 ${props.className || ""}`}
    >
      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
      <div>
        <h3 className="font-medium font-title">{props.title}</h3>
        <p className="text-sm text-muted-foreground">{props.description}</p>
      </div>
    </div>
  );
}
