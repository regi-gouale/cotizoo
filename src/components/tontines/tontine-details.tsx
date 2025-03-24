"use client";

import { InviteMemberForm } from "@/components/tontines/invite-member-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateMemberRole } from "@/lib/actions/update-member-role.action";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TontineRole, TontineStatus } from "@prisma/client";
import {
  AlertCircle,
  CalendarCheck,
  CalendarIcon,
  CreditCard,
  PlusCircleIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type TontineFrequencyType =
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMIANNUAL"
  | "YEARLY";

type TontineDetailsProps = {
  tontine: {
    id: string;
    name: string;
    description: string;
    status: TontineStatus;
    type: "ROTATIF" | "INVESTISSEMENT" | "PROJET";
    frequency: TontineFrequencyType;
    allocationMethod: "FIXED" | "VOTE" | "RANDOM" | "ENCHERE";
    contributionPerMember: number;
    maxMembers: number;
    startDate: Date;
    endDate: Date;
    penaltyFee: number | null;
    rules?: string | null;
    beneficiaryOrder: string[];
    members: any[];
    transactions: any[];
    historyLogs: any[];
  };
  userRole: TontineRole;
  statistics: {
    totalMembers: number;
    remainingSlots: number;
    totalContributed: number;
    totalRedistributed: number;
    nextContributionDate: Date | null;
  };
};

export function TontineDetails({
  tontine,
  userRole,
  statistics,
}: TontineDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleRoleChange = async (memberId: string, newRole: TontineRole) => {
    const result = await updateMemberRole({
      tontineId: tontine.id,
      memberId,
      newRole,
    });
    if (result) {
      toast.success("Rôle du membre mis à jour !");
      router.refresh();
    } else {
      toast.error("Erreur lors de la mise à jour du rôle du membre");
    }
  };

  // Mapper les types aux labels français
  const tontineTypes = {
    ROTATIF: "Tontine Rotative",
    INVESTISSEMENT: "Tontine d'Investissement",
    PROJET: "Tontine de Projet",
  };

  const tontineFrequencies: Record<TontineFrequencyType, string> = {
    WEEKLY: "Hebdomadaire",
    BIWEEKLY: "Bi-mensuelle",
    MONTHLY: "Mensuelle",
    QUARTERLY: "Trimestrielle",
    SEMIANNUAL: "Semestrielle",
    YEARLY: "Annuelle",
  };

  const allocationMethods = {
    FIXED: "Fixe",
    VOTE: "Vote",
    RANDOM: "Aléatoire",
    ENCHERE: "Enchère",
  };

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec le nom de la tontine et le statut */}
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

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <Users size={18} />
                Membres
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    onSuccess={handleSuccess}
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

      {/* Onglets */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="members">
            Membres ({statistics.totalMembers})
          </TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        {/* Onglet Détails */}
        <TabsContent value="details" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Type de tontine</h3>
                    <p>{tontineTypes[tontine.type]}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Fréquence</h3>
                    <p>{tontineFrequencies[tontine.frequency]}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Méthode d'allocation</h3>
                    <p>{allocationMethods[tontine.allocationMethod]}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Date de début</h3>
                    <p>{formatDate(tontine.startDate)}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Date de fin</h3>
                    <p>{formatDate(tontine.endDate)}</p>
                  </div>

                  <div>
                    <h3 className="font-medium">Pénalité de retard</h3>
                    <p>{tontine.penaltyFee}%</p>
                  </div>
                </div>
              </div>

              {tontine.rules && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Règles additionnelles</h3>
                  <p className="text-sm whitespace-pre-wrap">{tontine.rules}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Résumé financier</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Total des cotisations</h3>
                    <p className="text-xl">
                      {formatCurrency(statistics.totalContributed)}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Total redistribué</h3>
                    <p className="text-xl">
                      {formatCurrency(statistics.totalRedistributed)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Cotisation individuelle</h3>
                    <p className="text-xl">
                      {formatCurrency(tontine.contributionPerMember)}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Reste à collecter</h3>
                    <p className="text-xl">
                      {formatCurrency(
                        tontine.contributionPerMember * tontine.maxMembers -
                          statistics.totalContributed,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertCircle size={14} />
                <span>
                  Les montants affichés sont mis à jour quotidiennement
                </span>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Membres */}
        <TabsContent value="members" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Membres de la tontine</CardTitle>
              <CardDescription>
                {statistics.totalMembers} membre
                {statistics.totalMembers > 1 ? "s" : ""} sur un maximum de{" "}
                {tontine.maxMembers}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tontine.members.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback>
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Membre depuis {formatDate(member.joinedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          member.role === "ADMIN" ? "default" : "outline"
                        }
                      >
                        {member.role === "ADMIN" ? "Admin" : "Membre"}
                      </Badge>
                      {userRole === "ADMIN" && member.role !== "ADMIN" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRoleChange(member.id, "ADMIN")}
                        >
                          Définir comme Admin
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            {userRole === "ADMIN" && statistics.remainingSlots > 0 && (
              <CardFooter>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <div className="w-full flex items-center justify-center">
                    <DialogTrigger asChild className="">
                      <Button
                        variant="outline"
                        className="text-primary-foreground dark:text-primary"
                      >
                        <PlusCircleIcon className="mr-2 h-4 w-4" />
                        Inviter un membre
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle className="sr-only">
                          Inviter un membre
                        </DialogTitle>
                      </DialogHeader>
                      <InviteMemberForm
                        onSuccess={handleSuccess}
                        tontineId={tontine.id}
                      />
                    </DialogContent>
                  </div>
                </Dialog>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        {/* Onglet Planning */}
        <TabsContent value="planning" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Planning des bénéficiaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tontine.beneficiaryOrder.map(
                  (memberId: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">{memberId}</p>
                        <p className="text-sm text-muted-foreground">
                          Bénéficiaire n°{index + 1}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Onglet Transactions */}
        <TabsContent value="transactions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Transactions récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {tontine.transactions.length > 0 ? (
                <div className="space-y-4">
                  {tontine.transactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 border rounded-md"
                    >
                      <div>
                        <p className="font-medium">
                          {transaction.type === "COTISATION"
                            ? "Cotisation"
                            : "Redistribution"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            transaction.status === "COMPLETED"
                              ? "default"
                              : transaction.status === "PENDING"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {transaction.status === "COMPLETED"
                            ? "Complété"
                            : transaction.status === "PENDING"
                              ? "En attente"
                              : "Échoué"}
                        </Badge>
                        <p
                          className={`font-medium ${
                            transaction.type === "COTISATION"
                              ? "text-rose-600"
                              : "text-green-600"
                          }`}
                        >
                          {transaction.type === "COTISATION" ? "-" : "+"}
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Aucune transaction enregistrée
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir toutes les transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique de la tontine</CardTitle>
            </CardHeader>
            <CardContent>
              {tontine.historyLogs.length > 0 ? (
                <div className="space-y-4">
                  {tontine.historyLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="flex items-start gap-3 p-3 border rounded-md"
                    >
                      <div className="rounded-full p-2 bg-muted flex-shrink-0">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {getHistoryActionLabel(log.action)}
                        </p>
                        {log.details && (
                          <p className="text-sm">{log.details}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {log.user ? `Par ${log.user.name} - ` : ""}
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  Aucun historique disponible
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Voir tout l'historique
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getHistoryActionLabel(action: string) {
  const labels: Record<string, string> = {
    CREATION: "Création de la tontine",
    JOIN: "Nouveau membre",
    EXCLUSION: "Exclusion d'un membre",
    PAYMENT: "Paiement enregistré",
    RULES_UPDATED: "Règles mises à jour",
    REDISTRIBUTION: "Redistribution des fonds",
    SUSPENSION: "Tontine suspendue",
    RESUMPTION: "Tontine reprise",
    COMPLETION: "Tontine terminée",
    CANCELLATION: "Tontine annulée",
    BENEFICIARY_ORDER_UPDATED: "Ordre des bénéficiaires mis à jour",
    MEMBER_ROLE_UPDATED: "Rôle du membre mis à jour",
    BENEFICIARY_ORDER: "Ordre des bénéficiaires",
  };

  return labels[action] || action;
}
