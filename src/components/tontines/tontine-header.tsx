"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TontineStatus } from "@prisma/client";
import { CalendarCheck, CreditCard, PlusCircleIcon, Users } from "lucide-react";
import Link from "next/link";
import { InviteMemberForm } from "./invite-member-form";
import {
  TontineDetailsProps,
  tontineFrequencies,
} from "./tontine-details-types";

type TontineHeaderProps = {
  tontine: TontineDetailsProps["tontine"];
  userRole: TontineDetailsProps["userRole"];
};

export function TontineHeader({ tontine, userRole }: TontineHeaderProps) {
  const getStatusBadge = (status: TontineStatus) => {
    const isExpired = new Date(tontine.endDate) < new Date();

    if (status === "COMPLETED" || isExpired) {
      return (
        <Badge variant="outline" className="bg-gray-100">
          Terminée
        </Badge>
      );
    }

    if (status === "SUSPENDED") {
      return <Badge variant="destructive">Suspendue</Badge>;
    }

    return (
      <Badge variant="default" className="bg-green-500">
        En cours
      </Badge>
    );
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">{tontine.name}</h1>
        <p className="text-muted-foreground">{tontine.description}</p>
      </div>
      <div className="flex items-center gap-3">
        {getStatusBadge(tontine.status)}
        {userRole === "ADMIN" && (
          <Button variant="outline" asChild>
            <Link href={`/dashboard/tontines/${tontine.id}/settings`}>
              Gérer la tontine
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

type TontineStatsProps = {
  tontine: TontineDetailsProps["tontine"];
  statistics: TontineDetailsProps["statistics"];
  onInviteMemberSuccess: () => void;
  isInviteDialogOpen: boolean;
  setInviteDialogOpen: (open: boolean) => void;
};

export function TontineStats({
  tontine,
  statistics,
  onInviteMemberSuccess,
  isInviteDialogOpen,
  setInviteDialogOpen,
}: TontineStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Users size={18} />
              Membres
            </div>
            <Dialog
              open={isInviteDialogOpen}
              onOpenChange={setInviteDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-primary-foreground dark:text-primary"
                >
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="sr-only">Inscription</DialogTitle>
                </DialogHeader>
                <InviteMemberForm
                  onSuccess={onInviteMemberSuccess}
                  tontineId={tontine.id}
                />
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {statistics.totalMembers} / {tontine.maxMembers}
          </div>
          <p className="text-sm text-muted-foreground">
            {statistics.remainingSlots > 0
              ? `${statistics.remainingSlots} places disponibles`
              : "Tontine complète"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <CreditCard size={18} />
            Contribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(tontine.contributionPerMember)}
          </div>
          <p className="text-sm text-muted-foreground">
            par personne {tontineFrequencies[tontine.frequency].toLowerCase()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium flex items-center gap-2">
            <CalendarCheck size={18} />
            Prochaine échéance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {statistics.nextContributionDate ? (
            <>
              <div className="text-2xl font-bold">
                {formatDate(statistics.nextContributionDate)}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatCurrency(tontine.contributionPerMember)} à verser
              </p>
            </>
          ) : (
            <div className="text-md">Aucune échéance prévue</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
