import { z } from "zod";

export const TicketStatus = {
  OPEN: "OPEN",
  IN_PROGRESS: "IN_PROGRESS",
  CLOSED: "CLOSED",
} as const;

export type TicketStatusType = keyof typeof TicketStatus;

export const TicketFormSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
});

export const CommentFormSchema = z.object({
  content: z.string().min(1, "Le commentaire ne peut pas être vide"),
});

export const UpdateTicketStatusSchema = z.object({
  status: z.enum([TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.CLOSED]),
});

export type TicketWithCommentsAndUser = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date | null;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
  }[];
};
