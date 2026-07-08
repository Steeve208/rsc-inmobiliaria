import fs from "node:fs";
import postgres from "postgres";

const env = fs.readFileSync(".env", "utf8");
const match = env.match(/^DATABASE_URL=(.+)$/m);
if (!match) throw new Error("DATABASE_URL missing in .env");

const sql = postgres(match[1].trim(), { prepare: false });

async function columnType(table, column) {
  const [row] = await sql`
    select udt_name, data_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = ${table}
      and column_name = ${column}
  `;
  return row;
}

async function toTextIfEnum(table, column) {
  const info = await columnType(table, column);
  if (!info) {
    console.log(`skip ${table}.${column} (missing)`);
    return;
  }
  if (info.data_type === "USER-DEFINED" || info.udt_name === "listing_kind") {
    await sql.unsafe(
      `alter table "${table}" alter column "${column}" type text using "${column}"::text`,
    );
    console.log(`fixed ${table}.${column} -> text`);
    return;
  }
  console.log(`${table}.${column} already ${info.data_type} (${info.udt_name})`);
}

try {
  await toTextIfEnum("chat_thread", "listing_category");
  await toTextIfEnum("scheduled_visit", "listing_category");
  console.log("done");
} finally {
  await sql.end();
}
