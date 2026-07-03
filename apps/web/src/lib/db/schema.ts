import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const company = pgTable(
  "company",
  {
    id: text("id").primaryKey(),
    ownerUserId: text("owner_user_id").references(() => user.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    type: text("type").default("real_estate").notNull(),
    cnpj: text("cnpj"),
    email: text("email"),
    phone: text("phone"),
    whatsappNumber: text("whatsapp_number"),
    logoUrl: text("logo_url"),
    marketId: text("market_id").default("br").notNull(),
    verified: boolean("verified").default(false).notNull(),
    rating: numeric("rating", { precision: 2, scale: 1 }).default("0").notNull(),
    yearsActive: integer("years_active").default(0).notNull(),
    activeListings: integer("active_listings").default(0).notNull(),
    soldCount: integer("sold_count").default(0).notNull(),
    reviewsCount: integer("reviews_count").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("company_owner_idx").on(table.ownerUserId)],
);

export const companyLeadConfig = pgTable("company_lead_config", {
  companyId: text("company_id").primaryKey(),
  companyName: text("company_name").notNull(),
  whatsappNumber: text("whatsapp_number").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const scheduledVisit = pgTable(
  "scheduled_visit",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id").notNull(),
    listingTitle: text("listing_title").notNull(),
    listingCategory: text("listing_category").notNull(),
    companyId: text("company_id").notNull(),
    companyName: text("company_name").notNull(),
    buyerId: text("buyer_id").notNull(),
    buyerName: text("buyer_name").notNull(),
    buyerPhone: text("buyer_phone").notNull(),
    buyerEmail: text("buyer_email"),
    preferredDate: text("preferred_date").notNull(),
    preferredTime: text("preferred_time").notNull(),
    notes: text("notes"),
    status: text("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("visit_buyer_idx").on(table.buyerId),
    index("visit_company_idx").on(table.companyId),
    index("visit_listing_idx").on(table.listingId),
  ],
);

export const chatThread = pgTable(
  "chat_thread",
  {
    id: text("id").primaryKey(),
    listingId: text("listing_id").notNull(),
    listingTitle: text("listing_title").notNull(),
    listingCategory: text("listing_category").notNull(),
    companyId: text("company_id").notNull(),
    companyName: text("company_name").notNull(),
    buyerId: text("buyer_id").notNull(),
    buyerName: text("buyer_name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    unique("chat_thread_listing_buyer_unique").on(
      table.listingId,
      table.buyerId,
    ),
    index("chat_thread_buyer_idx").on(table.buyerId),
    index("chat_thread_company_idx").on(table.companyId),
  ],
);

export const chatMessage = pgTable(
  "chat_message",
  {
    id: text("id").primaryKey(),
    threadId: text("thread_id")
      .notNull()
      .references(() => chatThread.id, { onDelete: "cascade" }),
    sender: text("sender").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("chat_message_thread_idx").on(table.threadId, table.createdAt)],
);

export const chatThreadRelations = relations(chatThread, ({ many }) => ({
  messages: many(chatMessage),
}));

export const chatMessageRelations = relations(chatMessage, ({ one }) => ({
  thread: one(chatThread, {
    fields: [chatMessage.threadId],
    references: [chatThread.id],
  }),
}));

export const agent = pgTable(
  "agent",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id")
      .notNull()
      .references(() => company.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    role: text("role"),
    creci: text("creci"),
    phone: text("phone"),
    photoUrl: text("photo_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("agent_company_idx").on(table.companyId)],
);

export const propertyListing = pgTable(
  "property_listing",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").references(() => company.id, {
      onDelete: "set null",
    }),
    agentId: text("agent_id").references(() => agent.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    type: text("type").default("house").notNull(),
    status: text("status").default("active").notNull(),
    transaction: text("transaction").default("buy").notNull(),
    condition: text("condition"),
    price: numeric("price", { precision: 14, scale: 2 }).notNull(),
    currency: text("currency").default("BRL").notNull(),
    country: text("country").notNull(),
    state: text("state"),
    city: text("city").notNull(),
    neighborhood: text("neighborhood"),
    address: text("address"),
    lat: numeric("lat", { precision: 10, scale: 7 }),
    lng: numeric("lng", { precision: 10, scale: 7 }),
    bedrooms: integer("bedrooms").default(0).notNull(),
    bathrooms: integer("bathrooms").default(0).notNull(),
    suites: integer("suites").default(0).notNull(),
    garage: integer("garage").default(0).notNull(),
    livingRooms: integer("living_rooms").default(0).notNull(),
    kitchen: integer("kitchen").default(0).notNull(),
    laundry: integer("laundry").default(0).notNull(),
    pool: boolean("pool").default(false).notNull(),
    area: numeric("area", { precision: 12, scale: 2 }).default("0").notNull(),
    landArea: numeric("land_area", { precision: 12, scale: 2 }),
    heating: text("heating"),
    yearBuilt: integer("year_built"),
    condoFee: numeric("condo_fee", { precision: 12, scale: 2 }),
    iptu: numeric("iptu", { precision: 12, scale: 2 }),
    financing: boolean("financing").default(false).notNull(),
    verified: boolean("verified").default(false).notNull(),
    premium: boolean("premium").default(false).notNull(),
    featured: boolean("featured").default(false).notNull(),
    launch: boolean("launch").default(false).notNull(),
    whatsappNumber: text("whatsapp_number"),
    coverImage: text("cover_image"),
    videoUrl: text("video_url"),
    description: text("description"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("property_company_idx").on(table.companyId),
    index("property_status_idx").on(table.status),
    index("property_location_idx").on(table.country, table.state, table.city),
  ],
);

export const vehicleListing = pgTable(
  "vehicle_listing",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").references(() => company.id, {
      onDelete: "set null",
    }),
    agentId: text("agent_id").references(() => agent.id, { onDelete: "set null" }),
    title: text("title").notNull(),
    type: text("type").default("car").notNull(),
    status: text("status").default("active").notNull(),
    condition: text("condition"),
    make: text("make").notNull(),
    model: text("model").notNull(),
    year: integer("year").notNull(),
    mileage: integer("mileage").default(0).notNull(),
    fuel: text("fuel"),
    transmission: text("transmission"),
    color: text("color"),
    engine: text("engine"),
    drive: text("drive"),
    doors: integer("doors"),
    consumption: text("consumption"),
    warranty: text("warranty"),
    price: numeric("price", { precision: 14, scale: 2 }).notNull(),
    currency: text("currency").default("BRL").notNull(),
    country: text("country").notNull(),
    state: text("state"),
    city: text("city").notNull(),
    address: text("address"),
    lat: numeric("lat", { precision: 10, scale: 7 }),
    lng: numeric("lng", { precision: 10, scale: 7 }),
    coverImage: text("cover_image"),
    videoUrl: text("video_url"),
    has360: boolean("has_360").default(false).notNull(),
    history: text("history").array().default([]).notNull(),
    equipment: text("equipment").array().default([]).notNull(),
    specs: jsonb("specs").$type<Record<string, string>>().default({}).notNull(),
    description: text("description"),
    financing: boolean("financing").default(false).notNull(),
    verified: boolean("verified").default(false).notNull(),
    premium: boolean("premium").default(false).notNull(),
    featured: boolean("featured").default(false).notNull(),
    whatsappNumber: text("whatsapp_number"),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("vehicle_company_idx").on(table.companyId),
    index("vehicle_status_idx").on(table.status),
    index("vehicle_make_idx").on(table.make, table.model),
  ],
);

export const listingImage = pgTable(
  "listing_image",
  {
    id: text("id").primaryKey(),
    listingKind: text("listing_kind").notNull(),
    listingId: text("listing_id").notNull(),
    url: text("url").notNull(),
    position: integer("position").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("listing_image_ref_idx").on(table.listingKind, table.listingId)],
);

export const favorite = pgTable(
  "favorite",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    listingKind: text("listing_kind").notNull(),
    listingId: text("listing_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    unique("favorite_unique").on(table.userId, table.listingKind, table.listingId),
    index("favorite_user_idx").on(table.userId),
  ],
);
