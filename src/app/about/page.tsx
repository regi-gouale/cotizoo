import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 font-sans">
      {/* Hero Section */}
      <div className="mb-20 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-title flex items-center justify-center gap-2">
          À propos
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Découvrez comment notre plateforme révolutionne la gestion des
          tontines pour les rendre accessibles, transparentes et sécurisées.
        </p>
      </div>

      {/* Notre Mission */}
      <section className="mb-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 font-title">
              Notre mission
            </h2>
            <p className="text-lg mb-4">
              Chez Cotizoo, nous croyons au pouvoir de l'épargne collective et
              de l'entraide financière. Notre mission est de démocratiser
              l'accès aux tontines en proposant une solution numérique qui
              respecte les traditions tout en apportant modernité et sécurité.
            </p>
            <p className="text-lg">
              Nous voulons permettre à chacun de gérer son épargne collaborative
              sans tracas administratif, en toute transparence et avec une
              confiance absolue.
            </p>
          </div>
          <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
            <div className="h-full w-full bg-muted rounded-lg flex items-center justify-center">
              <Image
                src="https://images.unsplash.com/photo-1626178793926-22b28830aa30?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                fill
                sizes="100%"
                objectFit="cover"
                alt={""}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça fonctionne */}
      <section className="mb-20 bg-muted/30 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-10 text-center font-title">
          Comment fonctionne notre plateforme
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Créez votre tontine</h3>
            <p className="text-muted-foreground">
              Définissez les paramètres de votre tontine: montant, périodicité,
              nombre de participants et durée.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 font-title">
              Invitez vos membres
            </h3>
            <p className="text-muted-foreground">
              Invitez famille, amis ou collègues à rejoindre votre tontine en
              toute simplicité.
            </p>
          </div>

          <div className="bg-background p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-xl font-bold text-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 font-title">
              Gérez en toute sérénité
            </h3>
            <p className="text-muted-foreground">
              Notre plateforme s'occupe des rappels, des paiements et de la
              distribution automatique des fonds.
            </p>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center font-title">
          Les avantages de Cotizoo
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="border border-border p-6 rounded-lg hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 font-title">
              Sécurité garantie
            </h3>
            <p className="text-muted-foreground">
              Transactions sécurisées et traçabilité complète des fonds à tout
              moment.
            </p>
          </div>

          <div className="border border-border p-6 rounded-lg hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 font-title">
              Simplicité d'utilisation
            </h3>
            <p className="text-muted-foreground">
              Interface intuitive accessible à tous, même sans connaissances
              techniques.
            </p>
          </div>

          <div className="border border-border p-6 rounded-lg hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 font-title">
              Transparence totale
            </h3>
            <p className="text-muted-foreground">
              Visualisez en temps réel l'état de votre tontine et l'historique
              des opérations.
            </p>
          </div>

          <div className="border border-border p-6 rounded-lg hover:border-primary/50 transition-colors">
            <h3 className="text-xl font-semibold mb-3 font-title">
              Automatisation
            </h3>
            <p className="text-muted-foreground">
              Fini les rappels manuels et les erreurs de calcul. Tout est
              automatisé.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="text-center bg-primary/10 py-16 px-4 rounded-xl">
        <h2 className="text-3xl font-bold mb-6 font-title">
          Prêt à moderniser votre tontine ?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Rejoignez les milliers d'utilisateurs qui font confiance à Cotizoo
          pour gérer leurs tontines facilement et en toute sécurité.
        </p>
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          asChild
        >
          <Link href="/#cta">Commencer</Link>
        </Button>
      </section>

      {/* FAQ */}
      <section className="mt-20">
        <h2 className="text-3xl font-bold mb-10 text-center font-title">
          Questions fréquentes
        </h2>

        <div className="space-y-6 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-semibold mb-2 font-title">
              Qu'est-ce qu'une tontine ?
            </h3>
            <p className="text-muted-foreground">
              Une tontine est un système d'épargne et de crédit communautaire où
              chaque membre contribue régulièrement à un pot commun. À tour de
              rôle, chaque participant reçoit l'intégralité de la somme
              collectée.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 font-title">
              Comment Cotizoo assure-t-il la sécurité des fonds ?
            </h3>
            <p className="text-muted-foreground">
              Nous utilisons des protocoles de sécurité bancaires pour toutes
              les transactions. Les fonds transitent sur des comptes sécurisés
              et chaque opération est cryptée et traçable.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 font-title">
              Puis-je gérer plusieurs tontines simultanément ?
            </h3>
            <p className="text-muted-foreground">
              Absolument ! Notre plateforme vous permet de créer, rejoindre et
              gérer plusieurs tontines en parallèle, toutes depuis votre tableau
              de bord unique.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 font-title">
              Y a-t-il des frais cachés ?
            </h3>
            <p className="text-muted-foreground">
              Non, nous valorisons la transparence. Tous nos frais sont
              clairement indiqués avant la création de votre tontine, sans
              surprise par la suite.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
