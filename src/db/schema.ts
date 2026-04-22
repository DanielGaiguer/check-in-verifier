import {
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'

export const checkinStatusEnum = pgEnum('checkin_status', [
  'organized',
  'disorganized',
  'not_checked',
])

export const laboratories = pgTable('laboratories', {
  id: uuid('id').defaultRandom().primaryKey().notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  active: boolean('active').default(true).notNull(),
})

export const places = pgTable(
  'places',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull().unique(),
    labId: uuid('lab_id').references(() => laboratories.id, {
      onDelete: 'cascade',
    }),
    unitId: uuid('unit_id')
      .references(() => units.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    active: boolean('active').default(true).notNull(),
  },
  (table) => [
    index('idx_places_lab').on(table.labId),
    index('idx_places_unit').on(table.unitId),
  ]
)

export const problems = pgTable('problems', {
  id: uuid('id').defaultRandom().primaryKey().notNull().unique(),
  name: text('name').notNull().unique(),
  active: boolean('active').default(true).notNull(),
})

export const placeProblems = pgTable(
  'place_problems',
  {
    placeId: uuid('place_id').references(() => places.id),
    problemId: uuid('problem_id').references(() => problems.id),
  },
  (table) => [primaryKey({ columns: [table.placeId, table.problemId] })]
)

export const people = pgTable('people', {
  id: uuid('id').defaultRandom().primaryKey().notNull().unique(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  active: boolean('active').default(true).notNull(),
})

export const checkins = pgTable(
  'checkins',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull().unique(),
    peopleId: uuid('people_id')
      .references(() => people.id)
      .notNull(),
    unitId: uuid('unit_id')
      .references(() => units.id, {
        onDelete: 'restrict',
      })
      .notNull(),
    date: date('date').notNull(),
    observation: text('observation'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    index('idx_checkins_date').on(table.date),
    index('idx_checkins_people').on(table.peopleId),
    index('idx_checkins_unit').on(table.unitId),
  ]
)

export const checkinItems = pgTable(
  'checkin_items',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull().unique(),
    checkinId: uuid('checkin_id')
      .references(() => checkins.id, { onDelete: 'cascade' })
      .notNull(),
    placeId: uuid('place_id')
      .references(() => places.id)
      .notNull(),
    status: checkinStatusEnum('status').notNull(),
    observation: text('observation'),
  },
  (table) => [
    index('idx_checkin_items_checkin').on(table.checkinId),
    index('idx_checkin_items_place').on(table.placeId),

    unique('unique_checkin_place').on(table.checkinId, table.placeId),
  ]
)

export const checkinItemsProblems = pgTable(
  'checkin_items_problems',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull().unique(),
    checkinItemId: uuid('checkin_item_id')
      .references(() => checkinItems.id, { onDelete: 'cascade' })
      .notNull(),
    problemId: uuid('problem_id')
      .references(() => problems.id)
      .notNull(),
    active: boolean('active').default(true).notNull(),
  },
  (table) => [
    index('idx_checkin_items_problems_item').on(table.checkinItemId),
    index('idx_checkin_items_problems_problem').on(table.problemId),
    unique('unique_item_problem').on(table.checkinItemId, table.problemId),
  ]
)

export const checkinItemPhotos = pgTable(
  'checkin_item_photos',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull().unique(),
    checkinItemId: uuid('checkin_item_id')
      .references(() => checkinItems.id, { onDelete: 'restrict' })
      .notNull(),
    photoUrl: text('photo_url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [index('idx_checkin_item_photos_problem').on(table.checkinItemId)]
)

export const checkinEdits = pgTable('checkin_edits', {
  id: uuid('id').primaryKey().defaultRandom().unique().notNull(),
  checkinId: uuid('checkin_id').references(() => checkins.id),
  editedBy: uuid('people_id').references(() => people.id),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const units = pgTable('units', {
  id: uuid('id').primaryKey().defaultRandom().notNull().unique(),
  name: text('name').notNull(),
  active: boolean('active').default(true).notNull(),
})
