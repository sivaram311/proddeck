import { randomUUID } from "crypto";
import type { ProdDeckPack } from "@/lib/pack";

export type HelpdeskTicket = {
  id: string;
  title: string;
  category: string;
  body: string;
  crewRole: string;
  status: "open";
  createdAt: string;
  createdBy: string;
};

type Store = { tickets: HelpdeskTicket[] };

function store(): Store {
  const g = globalThis as typeof globalThis & { __proddeckHelpdesk?: Store };
  if (!g.__proddeckHelpdesk) {
    g.__proddeckHelpdesk = { tickets: [] };
  }
  return g.__proddeckHelpdesk;
}

export function listTickets(): HelpdeskTicket[] {
  return [...store().tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createTicket(input: {
  title: string;
  category: string;
  body?: string;
  createdBy: string;
  pack: ProdDeckPack;
}): HelpdeskTicket | { error: string; code: string } {
  const title = input.title.trim();
  if (!title) return { error: "title required", code: "VALIDATION" };
  const cat = input.pack.helpdesk.categories.find((c) => c.id === input.category);
  if (!cat) return { error: "unknown category", code: "VALIDATION" };
  const ticket: HelpdeskTicket = {
    id: randomUUID(),
    title,
    category: cat.id,
    body: (input.body || "").trim(),
    crewRole: cat.crewRole,
    status: "open",
    createdAt: new Date().toISOString(),
    createdBy: input.createdBy || "unknown",
  };
  store().tickets.unshift(ticket);
  return ticket;
}
