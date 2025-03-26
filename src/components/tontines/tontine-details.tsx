"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TontineDetailsTab } from "./tontine-details-tab";
import { TontineDetailsProps } from "./tontine-details-types";
import { TontineHeader, TontineStats } from "./tontine-header";
import { HistoryTab } from "./tontine-history-tab";
import { MembersTab } from "./tontine-members-tab";
import { PlanningTab } from "./tontine-planning-tab";
import { TransactionsTab } from "./tontine-transactions-tab";

export function TontineDetails({
  tontine,
  userRole,
  statistics,
}: TontineDetailsProps) {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const handleInviteMemberSuccess = () => {
    setIsInviteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec le nom de la tontine et le statut */}
      <TontineHeader tontine={tontine} userRole={userRole} />

      {/* Cartes statistiques */}
      <TontineStats
        tontine={tontine}
        statistics={statistics}
        onInviteMemberSuccess={handleInviteMemberSuccess}
        isInviteDialogOpen={isInviteDialogOpen}
        setInviteDialogOpen={setIsInviteDialogOpen}
      />

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
        <TabsContent value="details">
          <TontineDetailsTab tontine={tontine} statistics={statistics} />
        </TabsContent>

        {/* Onglet Membres */}
        <TabsContent value="members">
          <MembersTab
            tontine={tontine}
            statistics={statistics}
            userRole={userRole}
            isInviteDialogOpen={isInviteDialogOpen}
            setInviteDialogOpen={setIsInviteDialogOpen}
            onInviteMemberSuccess={handleInviteMemberSuccess}
          />
        </TabsContent>

        {/* Onglet Planning */}
        <TabsContent value="planning">
          <PlanningTab tontine={tontine} />
        </TabsContent>

        {/* Onglet Transactions */}
        <TabsContent value="transactions">
          <TransactionsTab tontine={tontine} />
        </TabsContent>

        {/* Onglet Historique */}
        <TabsContent value="history">
          <HistoryTab tontine={tontine} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
