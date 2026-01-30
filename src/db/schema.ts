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
export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

  /* ================================
     SALAS / LABORATORIOS
  ================================ */

export const lab = pgTable("lab", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});
/* ================================
   LOCAIS (BANCADAS / GAVETEIROS)
================================ */
export const place = pgTable("place", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // Ex: Bancada 1, Gaveteiro A
  lab: integer("lab").references(() => lab.id).notNull()
});

/* ================================
   TIPOS DE PROBLEMAS / CHECKS
================================ */
export const issue = pgTable("issue", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  description: text("description").notNull(),
});

/* ================================
   CHECK-INS
================================ */
export const checkin = pgTable("checkin", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  overallStatus: boolean("overall_status").notNull(),
  userId: integer("user_id")
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================================
   PROBLEMAS POR LOCAL
================================ */
export const checkinPlacesIssue = pgTable("checkin_places_issue", {
  id: serial("id").primaryKey(),
  checkinId: integer("checkin_id")
    .references(() => checkin.id)
    .notNull(),
  placeId: integer("place_id")
    .references(() => place.id)
    .notNull(),
  issueId: integer("issue_id")
    .references(() => issue.id)
    .notNull(),
  observation: text("observation"),
});

/* ================================
   FOTOS
================================ */
export const photo = pgTable("photo", {
  id: serial("id").primaryKey(),
  checkinPlacesIssuesId: integer("checkin_places_issue_id")
    .references(() => checkinPlacesIssue.id)
    .notNull(),
  url: text("url").notNull(),
});
