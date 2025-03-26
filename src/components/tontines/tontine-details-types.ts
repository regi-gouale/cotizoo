"use client";

import { TontineRole, TontineStatus } from "@prisma/client";

export type TontineFrequencyType =
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMIANNUAL"
  | "YEARLY";

export type TontineDetailsProps = {
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

export const tontineTypes = {
  ROTATIF: "Tontine Rotative",
  INVESTISSEMENT: "Tontine d'Investissement",
  PROJET: "Tontine de Projet",
};

export const tontineFrequencies: Record<TontineFrequencyType, string> = {
  WEEKLY: "Hebdomadaire",
  BIWEEKLY: "Bi-mensuelle",
  MONTHLY: "Mensuelle",
  QUARTERLY: "Trimestrielle",
  SEMIANNUAL: "Semestrielle",
  YEARLY: "Annuelle",
};

export const allocationMethods = {
  FIXED: "Fixe",
  VOTE: "Vote",
  RANDOM: "Aléatoire",
  ENCHERE: "Enchère",
};

export const historyActionLabels: Record<string, string> = {
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
