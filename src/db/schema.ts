
import {
  pgTable,
  text,
  timestamp,
  date,
  uuid,
  unique, 
} from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";

export const checkinStatusEnum = pgEnum("checkin_status", [
  "organized",
  "disorganized",
]);

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
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* ================================
   PROBLEMAS POR LOCAL
================================ */
export const checkinPlaceIssues = pgTable("checkin_place_issues", {
    id: uuid('id').defaultRandom().primaryKey(),

    checkinPlaceId: uuid("checkin_places_id")
      .references(() => checkinPlaces.id)
      .notNull(),

    issueId: uuid("issue_id")
      .references(() => issues.id)
      .notNull(),
  },
  (table) => ({
    uniqueIssuePerPlace: unique().on(
      table.checkinPlaceId,
      table.issueId
    ),
  })
);

/* ================================
   FOTOS
================================ */
export const photos = pgTable("photos", {
  id: uuid('id').defaultRandom().primaryKey(),
  checkinPlaceId: uuid("checkin_place_id")
    .references(() => checkinPlaces.id)
    .notNull(),
  url: text("url").notNull(),
});

export const checkinPlaces = pgTable("checkin_places", {
  id: uuid('id').defaultRandom().primaryKey(),
  checkinId: uuid("checkin_id")
    .references(() => checkins.id)
    .notNull(),
  placeId: uuid("place_id")
    .references(() => places.id)
    .notNull(),
  status: checkinStatusEnum("status").notNull(),
  observation: text("observation")
}, 
  (table) => ({
    uniqueCheckinPlace: unique().on(table.checkinId, table.placeId)
  })
)