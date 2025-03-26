"use client";

import { historyActionLabels } from "./tontine-details-types";

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function getUserFromId(userId: string, members: any[]) {
  const member = members.find((member) => member.id === userId);
  return member ? member.user : null;
}

export function getHistoryActionLabel(action: string) {
  return historyActionLabels[action] || action;
}
