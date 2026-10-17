import type { SelectQueryBuilder, StringReference } from "kysely";
import type { PageInfoClass } from "./pageInfo.js";
import { sql } from "kysely";
import { RegistryOperationError } from "@/utils/errors.js";

type Page<Row> = {
  edges: { cursor: string; node: Row }[];
  pageInfo: PageInfoClass;
};

type PageArgs = {
  first: number;
  after?: string | null;
};

export const EMPTY_PAGE: Page<never> = {
  edges: [],
  pageInfo: { hasPreviousPage: false, hasNextPage: false },
};

function encodeCursor(values: string[]) {
  return Buffer.from(JSON.stringify(values), "utf8").toString("base64");
}

function parseCursor(cursor: string): unknown {
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
  }
  catch {
    return undefined;
  }
}

function isCursorValues(values: unknown, keyCount: number): values is string[] {
  return Array.isArray(values)
    && values.length === keyCount
    && values.every(value => typeof value === "string");
}

function decodeCursor(cursor: string, keyCount: number) {
  const values = parseCursor(cursor);
  if (!isCursorValues(values, keyCount)) {
    throw new RegistryOperationError({ name: "INVALID_CURSOR_ERROR" });
  }

  return values;
}

export async function paginate<DB, TB extends keyof DB & string, Row>(
  query: SelectQueryBuilder<DB, TB, Row>,
  keys: NoInfer<StringReference<DB, TB>>[],
  { first, after }: PageArgs,
): Promise<Page<Row>> {
  const keyRefs = keys.map(key => sql.ref(key));

  // Keys go through `::text` so timestamps keep Postgres's microseconds; a JS Date would cut them to milliseconds
  let pageQuery = query
    .select(sql<string[]>`json_build_array(${sql.join(keyRefs.map(ref => sql`${ref}::text`))})`.as("pageCursor"))
    .$castTo<Row & { pageCursor: string[] }>();

  if (after) {
    const values = decodeCursor(after, keys.length);
    pageQuery = pageQuery.where(sql<boolean>`(${sql.join(keyRefs)}) > (${sql.join(values)})`);
  }

  for (const ref of keyRefs) {
    pageQuery = pageQuery.orderBy(ref, "asc");
  }

  const rows = await pageQuery.limit(first + 1).execute();

  const hasNextPage = rows.length > first;
  const edges = rows.slice(0, first).map(row => ({
    cursor: encodeCursor(row.pageCursor),
    node: row,
  }));

  return {
    edges,
    pageInfo: {
      hasPreviousPage: !!after,
      hasNextPage,
      continuationToken: hasNextPage ? edges[edges.length - 1].cursor : undefined,
    },
  };
}
