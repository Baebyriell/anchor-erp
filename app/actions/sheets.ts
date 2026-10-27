'use server';

import { z } from 'zod';
import { requireUser } from '../../lib/supabase/server';
import { SHEET_KEYS, type SheetKey } from '../../lib/sheets';

const sheetKeySchema = z.enum(SHEET_KEYS);

// Cells are plain text/numbers; limits stop oversized or malformed payloads.
const cellSchema = z.union([z.string().max(2000), z.number().finite(), z.boolean(), z.null()]);
// Keys may be briefly empty while a column header is being retyped.
const rowSchema = z.record(z.string().max(100), cellSchema);
const rowsSchema = z.array(rowSchema).max(5000);
const headersSchema = z.array(z.string().max(100)).max(50).nullable();

const SAVE_LIMIT = { maxHits: 120, windowSeconds: 60 };

async function rateLimit(supabase: Awaited<ReturnType<typeof requireUser>>['supabase']) {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    max_hits: SAVE_LIMIT.maxHits,
    window_seconds: SAVE_LIMIT.windowSeconds,
  });
  if (error || data !== true) throw new Error('Too many requests. Please wait a minute and try again.');
}

export type SheetData = { rows: Record<string, unknown>[]; headers: string[] | null };

export async function loadSheets(keys: SheetKey[]): Promise<Partial<Record<SheetKey, SheetData>>> {
  const parsedKeys = z.array(sheetKeySchema).max(SHEET_KEYS.length).parse(keys);
  const { supabase } = await requireUser();
  const { data, error } = await supabase
    .from('sheets')
    .select('sheet_key, rows, headers')
    .in('sheet_key', parsedKeys);
  if (error) throw new Error('Could not load data.');

  const result: Partial<Record<SheetKey, SheetData>> = {};
  for (const row of data ?? []) {
    result[row.sheet_key as SheetKey] = { rows: row.rows ?? [], headers: row.headers ?? null };
  }
  return result;
}

export async function saveSheet(key: SheetKey, rows: unknown, headers: unknown = null) {
  const sheetKey = sheetKeySchema.parse(key);
  const parsedRows = rowsSchema.parse(rows);
  const parsedHeaders = headersSchema.parse(headers);
  const { supabase, user } = await requireUser();
  await rateLimit(supabase);

  const { error } = await supabase.from('sheets').upsert({
    owner_id: user.id,
    sheet_key: sheetKey,
    rows: parsedRows,
    headers: parsedHeaders,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error('Could not save data.');
}

export async function deleteSheet(key: SheetKey) {
  const sheetKey = sheetKeySchema.parse(key);
  const { supabase, user } = await requireUser();
  await rateLimit(supabase);

  const { error } = await supabase.from('sheets').delete().eq('owner_id', user.id).eq('sheet_key', sheetKey);
  if (error) throw new Error('Could not delete data.');
}
