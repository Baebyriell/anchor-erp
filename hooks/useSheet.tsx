'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { loadSheets, saveSheet } from '../app/actions/sheets';
import { LEGACY_LOCAL_KEYS, type SheetKey } from '../lib/sheets';

export type SaveStatus = 'loading' | 'saved' | 'saving' | 'error';

const SAVE_DELAY_MS = 600;

// Loads a sheet from the server and saves edits back (debounced while typing).
// Data left in this browser by the old local-only version is moved to the
// server once, then removed from the browser.
export function useSheet<Row extends Record<string, any>>(
  key: SheetKey,
  defaultRows: Row[],
  defaultHeaders: string[] | null = null,
) {
  const [rows, setRows] = useState<Row[]>([]);
  const [headers, setHeaders] = useState<string[] | null>(defaultHeaders);
  const [status, setStatus] = useState<SaveStatus>('loading');
  const pending = useRef<{ rows: Row[]; headers: string[] | null } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const defaults = useRef({ rows: defaultRows, headers: defaultHeaders });

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    const next = pending.current;
    if (!next) return;
    pending.current = null;
    setStatus('saving');
    try {
      await saveSheet(key, next.rows, next.headers);
      setStatus(pending.current ? 'saving' : 'saved');
    } catch {
      setStatus('error');
    }
  }, [key]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const sheet = (await loadSheets([key]))[key];
        if (cancelled) return;
        if (sheet) {
          setRows(sheet.rows as Row[]);
          if (sheet.headers) setHeaders(sheet.headers);
          setStatus('saved');
          return;
        }

        const legacyKey = LEGACY_LOCAL_KEYS[key];
        let legacy: Row[] | null = null;
        try {
          const raw = localStorage.getItem(legacyKey);
          legacy = raw ? JSON.parse(raw) : null;
        } catch {
          legacy = null;
        }

        if (Array.isArray(legacy)) {
          setRows(legacy);
          await saveSheet(key, legacy, defaults.current.headers);
          localStorage.removeItem(legacyKey);
        } else {
          setRows(defaults.current.rows);
        }
        if (!cancelled) setStatus('saved');
      } catch {
        if (!cancelled) setStatus('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  // Save anything still waiting when the page is left.
  useEffect(() => () => void flush(), [flush]);

  // Refs hold the latest values so back-to-back header and row edits
  // (as EditableTable does when renaming a column) don't overwrite each other.
  const latest = useRef({ rows, headers });
  latest.current = { rows, headers };

  const schedule = useCallback(
    (nextRows: Row[], nextHeaders: string[] | null) => {
      latest.current = { rows: nextRows, headers: nextHeaders };
      pending.current = { rows: nextRows, headers: nextHeaders };
      setStatus('saving');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, SAVE_DELAY_MS);
    },
    [flush],
  );

  const update = useCallback(
    (nextRows: Row[]) => {
      setRows(nextRows);
      schedule(nextRows, latest.current.headers);
    },
    [schedule],
  );

  const updateHeaders = useCallback(
    (nextHeaders: string[]) => {
      setHeaders(nextHeaders);
      schedule(latest.current.rows, nextHeaders);
    },
    [schedule],
  );

  return { rows, headers: headers ?? [], update, updateHeaders, status };
}

export function SaveIndicator({ status }: { status: SaveStatus }) {
  const label = {
    loading: 'Loading…',
    saving: 'Saving…',
    saved: '✓ Saved to server',
    error: '⚠ Not saved — check your connection',
  }[status];
  const color = status === 'error' ? 'text-rose-400' : status === 'saved' ? 'text-emerald-400' : 'text-slate-500';
  return <span className={`text-[11px] font-bold ${color}`}>{label}</span>;
}
