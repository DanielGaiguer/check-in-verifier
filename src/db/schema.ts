import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  date,
  integer,
} from "drizzle-orm/pg-core";

/* ================================
   RESPONSÁVEIS
================================ */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

/* ================================
   LOCAIS (BANCADAS / GAVETEIROS)
================================ */
export const places = pgTable("places", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Ex: Bancada 1, Gaveteiro A
});

/* ================================
   TIPOS DE PROBLEMAS / CHECKS
================================ */
export const issues = pgTable("issues", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  description: text("description").notNull(),
});

/* ================================
   CHECK-INS
================================ */
export const checkins = pgTable("checkins", {
  id: serial("id").primaryKey(),
  date: date("date").notNull().unique(),
  overallStatus: boolean("overall_status").notNull(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================================
   PROBLEMAS POR LOCAL
================================ */
export const checkinWorkbenchIssues = pgTable("checkin_workbench_issues ", {
  id: serial("id").primaryKey(),
  checkinId: integer("checkin_id")
    .references(() => checkins.id)
    .notNull(),
  workbenchId: integer("workbench_id")
    .references(() => places.id)
    .notNull(),
  issueId: integer("issue_id")
    .references(() => issues.id)
    .notNull(),
  observation: text("observation"),
});

/* ================================
   FOTOS
================================ */
export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  checkinWorkbenchIssuesId: integer("checkin_workbench_issues_id")
    .references(() => checkinWorkbenchIssues.id)
    .notNull(),
  url: text("url").notNull(),
});
