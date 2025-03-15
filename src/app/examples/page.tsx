import { CardWithHover } from "@/components/ui/card-with-hover";

export default function ExamplesPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Nos produits</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CardWithHover
          title="Solution de Payment"
          description="Acceptez les paiements en ligne avec notre solution sécurisée et facile à intégrer."
          imageUrl="/images/payment.webp"
          href="/products/payment"
          badges={["Sécurisé", "Rapide"]}
        />

        <CardWithHover
          title="Gestion des abonnements"
          description="Automatisez vos revenus récurrents avec notre plateforme de gestion d'abonnements."
          imageUrl="/images/subscription.webp"
          href="/products/subscription"
          badges={["Flexible", "Analytique"]}
        />

        <CardWithHover
          variant="featured"
          title="Solution complète e-commerce"
          description="Tout ce dont vous avez besoin pour créer et gérer une boutique en ligne performante."
          imageUrl="/images/ecommerce.webp"
          href="/products/ecommerce"
          badges={["Populaire", "Tout-en-un"]}
        />
      </div>
    </div>
  );
}
