import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-16 md:px-8 w-full">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-6 relative w-64 h-64">
          <Image
            src="/images/404-illustration.svg"
            alt="Illustration de page introuvable"
            fill
            priority
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          Page introuvable
        </h1>
        <p className="mb-8 text-muted-foreground">
          Désolé, nous ne trouvons pas la page que vous recherchez. Elle a
          peut-être été déplacée ou supprimée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/">Retourner à l'accueil</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/contact">Nous contacter</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
