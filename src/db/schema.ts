import {
  pgTable,
  serial,
  text,
  boolean,
  timestamp,
  date,
  integer,
  uuid, 
} from "drizzle-orm/pg-core";

/* ================================
   RESPONSÁVEIS
================================ */
export const users = pgTable("users", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text("name").notNull(),
});

  /* ================================
     SALAS / LABORATORIOS
  ================================ */

export const lab = pgTable("lab", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text("name").notNull(),
});
/* ================================
   LOCAIS (BANCADAS / GAVETEIROS)
================================ */
export const places = pgTable("places", {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text("name").notNull(), // Ex: Bancada 1, Gaveteiro A
  labId: uuid("lab_id").references(() => lab.id).notNull()
});

/* ================================
   TIPOS DE PROBLEMAS / CHECKS
================================ */
export const issues = pgTable("issues", {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text("code").notNull(),
  description: text("description").notNull(),
});

/* ================================
   CHECK-INS
================================ */
export const checkins = pgTable("checkins", {
  id: uuid('id').defaultRandom().primaryKey(),
  date: date("date").notNull().unique(),
  overallStatus: boolean("overall_status").notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================================
   PROBLEMAS POR LOCAL
================================ */
export const checkinPlacesIssues = pgTable("checkin_places_issues", {
  id: uuid('id').defaultRandom().primaryKey(),
  checkinId: uuid("checkin_id")
    .references(() => checkins.id)
    .notNull(),
  placeId: uuid("place_id")
    .references(() => places.id)
    .notNull(),
  issueId: uuid("issue_id")
    .references(() => issues.id)
    .notNull(),
  observation: text("observation"),
});

/* ================================
   FOTOS
================================ */
export const photos = pgTable("photos", {
  id: uuid('id').defaultRandom().primaryKey(),
  checkinPlacesIssuesId: uuid("checkin_places_issues_id")
    .references(() => checkinPlacesIssues.id)
    .notNull(),
  url: text("url").notNull(),
});
