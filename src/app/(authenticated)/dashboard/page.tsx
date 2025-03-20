import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import {
  ArrowRight,
  CoinsIcon,
  CreditCardIcon,
  Plus,
  UsersIcon,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Button className="w-full sm:w-auto">
          <Link href="/dashboard/tontines/create" className="flex items-center">
            <Plus className="mr-2 size-4" />
            Créer une tontine
          </Link>
        </Button>
      </div>

      <DashboardWelcome user={session.user} />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Mes tontines
              </CardTitle>
              <CoinsIcon className="size-4 text-primary" />
            </div>
            <CardDescription>Vos tontines actives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link
                href="/dashboard/tontines"
                className="flex items-center text-sm"
              >
                Voir les détails
                <ArrowRight className="ml-1 size-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Paiements à venir
              </CardTitle>
              <CreditCardIcon className="size-4 text-primary" />
            </div>
            <CardDescription>Prochaines échéances</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link
                href="/dashboard/paiements"
                className="flex items-center text-sm"
              >
                Voir les détails
                <ArrowRight className="ml-1 size-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
              <UsersIcon className="size-4 text-primary" />
            </div>
            <CardDescription>Membres de vos tontines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link
                href="/dashboard/contacts"
                className="flex items-center text-sm"
              >
                Voir les détails
                <ArrowRight className="ml-1 size-3" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* <DashboardStats /> */}
    </div>
  );
}
