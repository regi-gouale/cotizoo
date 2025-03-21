import { ContactForm } from "@/components/forms/contact-form";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact | cotizoo",
  description:
    "Contactez notre équipe pour toute question ou demande d'assistance concernant vos tontines.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 font-sans">
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 font-title">
          Contactez-nous
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Une question, une suggestion ou besoin d'aide ? Notre équipe est là
          pour vous répondre.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4 font-title">
            Envoyez-nous un message
          </h2>
          <Card>
            <CardContent className="pt-6">
              <ContactForm />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4 font-title">
            Informations de contact
          </h2>
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2625.477148547307!2d2.3455459762767467!3d48.85340997133291!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e671e7d254c3f7%3A0x5bf978cc9b092a06!2sParis%2C%20France!5e0!3m2!1sfr!2sfr!4v1710936790831!5m2!1sfr!2sfr"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                  title="Notre adresse"
                />
              </CardContent>
            </Card>

            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Adresse</h3>
                  <p className="text-muted-foreground">
                    123 Avenue de la Tontine
                    <br />
                    75001 Paris, France
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">contact@cotizoo.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Téléphone</h3>
                  <p className="text-muted-foreground">+33 1 23 45 67 89</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4 font-title">
          Foire aux questions
        </h2>
        <p className="mb-8 text-muted-foreground max-w-3xl mx-auto">
          Consultez notre section FAQ pour trouver rapidement des réponses aux
          questions les plus fréquentes.
        </p>
        <a
          href="/faq"
          className="inline-flex items-center justify-center h-10 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          Consulter la FAQ
        </a>
      </div>
    </div>
  );
}
