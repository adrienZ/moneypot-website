import {
  pgTable,
  serial,
  text,
  timestamp,
  unique,
  boolean,
  varchar,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  foreignKey,
  date,
  integer
} from "drizzle-orm/pg-core";

export const authLayerEmailAudience = pgTable("auth_layer_email_audience", {
  id: serial("id").primaryKey().notNull(),
  email: text("email").notNull(),
  providerContactId: text("provider_contact_id").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
});

export const authLayerEmailVerificationCode = pgTable(
  "auth_layer_email_verification_code",
  {
    id: serial("id").primaryKey().notNull(),
    code: text("code").notNull(),
    userId: text("user_id").notNull(),
    email: text("email").notNull(),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
  },
  (table) => {
    return {
      authLayerEmailVerificationCodeUserIdUnique: unique(
        "auth_layer_email_verification_code_user_id_unique"
      ).on(table.userId)
    };
  }
);

export const authLayerUser = pgTable(
  "auth_layer_user",
  {
    id: serial("id").primaryKey().notNull(),
    externalId: text("external_id").notNull(),
    username: text("username"),
    password: text("password"),
    emailVerified: boolean("email_verified").default(false).notNull(),
    email: text("email").notNull(),
    avatar: varchar("avatar", { length: 512 })
      .default("https://www.gravatar.com/avatar")
      .notNull(),
    twoFactorSecret: varchar("two_factor_secret", { length: 128 }),
    twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
  },
  (table) => {
    return {
      authLayerUserExternalIdUnique: unique(
        "auth_layer_user_external_id_unique"
      ).on(table.externalId),
      authLayerUserEmailUnique: unique("auth_layer_user_email_unique").on(
        table.email
      )
    };
  }
);

export const paymentLayerUserLegalInformations = pgTable(
  "payment_layer_user_legal_informations",
  {
    id: serial("id").primaryKey().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    birthDate: date("birth_date"),
    phoneNumber: varchar("phone_number", { length: 50 }),
    userId: varchar("user_id", { length: 15 })
      .notNull()
      .references(() => authLayerUser.externalId)
  }
);

export const paymentLayerPaymentAccount = pgTable(
  "payment_layer_payment_account",
  {
    id: serial("id").primaryKey().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    providerId: varchar("provider_id", { length: 25 }).notNull(),
    providerUserId: varchar("provider_user_id", { length: 20 }).notNull(),
    userId: varchar("user_id", { length: 15 })
      .notNull()
      .references(() => authLayerUser.externalId)
  }
);

export const moneypotWebsiteMoneypotCategory = pgTable(
  "moneypot_website_moneypot_category",
  {
    id: serial("id").primaryKey().notNull(),
    externalId: varchar("external_id", { length: 10 }).notNull(),
    value: varchar("value", { length: 100 }).notNull(),
    image: varchar("image", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
  },
  (table) => {
    return {
      moneypotWebsiteMoneypotCategoryExternalIdUnique: unique(
        "moneypot_website_moneypot_category_external_id_unique"
      ).on(table.externalId),
      moneypotWebsiteMoneypotCategoryValueUnique: unique(
        "moneypot_website_moneypot_category_value_unique"
      ).on(table.value)
    };
  }
);

export const authLayerPasswordResetToken = pgTable(
  "auth_layer_password_reset_token",
  {
    id: serial("id").primaryKey().notNull(),
    token: text("token").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => authLayerUser.id),
    expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
  }
);

export const authLayerOauthAccount = pgTable("auth_layer_oauth_account", {
  id: serial("id").primaryKey().notNull(),
  providerId: text("provider_id").notNull(),
  providerUserId: text("provider_user_id").notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => authLayerUser.id),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
});

export const paymentLayerPhysicalAddress = pgTable(
  "payment_layer_physical_address",
  {
    id: serial("id").primaryKey().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    city: varchar("city", { length: 200 }).notNull(),
    zipCode: varchar("zip_code", { length: 20 }).notNull(),
    countryCode: varchar("country_code", { length: 2 }).notNull(),
    country: varchar("country", { length: 90 }).notNull(),
    streetLineOne: varchar("street_line_one", { length: 100 }).notNull(),
    streetLineTwo: varchar("street_line_two", { length: 100 }),
    userId: varchar("user_id", { length: 15 })
      .notNull()
      .references(() => authLayerUser.externalId)
  }
);

export const authLayerUserSession = pgTable("auth_layer_user_session", {
  id: text("id").primaryKey().notNull(),
  userId: integer("user_id")
    .notNull()
    .references(() => authLayerUser.id),
  expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
  userAgent: varchar("user_agent", { length: 500 }),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
});

export const moneypotWebsiteMoneypot = pgTable(
  "moneypot_website_moneypot",
  {
    id: serial("id").primaryKey().notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    categoryId: varchar("category_id", { length: 10 })
      .notNull()
      .references(() => moneypotWebsiteMoneypotCategory.externalId),
    externalId: varchar("external_id", { length: 15 }).notNull(),
    creatorId: varchar("creator_id", { length: 15 })
      .notNull()
      .references(() => authLayerUser.externalId),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow()
  },
  (table) => {
    return {
      moneypotWebsiteMoneypotExternalIdUnique: unique(
        "moneypot_website_moneypot_external_id_unique"
      ).on(table.externalId)
    };
  }
);
