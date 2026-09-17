import { readJSON, writeJSON, StorageKeys } from '@/storage/mmkv';

export interface OutboxEntry {
  id: string;
  idempotencyKey: string;
  kind: 'claim_achievement' | 'claim_reward' | 'submit_score' | 'complete_daily';
  payload: Record<string, unknown>;
  createdAt: number;
}

function readQueue(): OutboxEntry[] {
  return readJSON<OutboxEntry[]>(StorageKeys.outbox) ?? [];
}

function writeQueue(entries: OutboxEntry[]): void {
  writeJSON(StorageKeys.outbox, entries);
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Durable queue for mutations attempted while offline (score submissions,
 * reward/achievement claims, daily-challenge completion). Flushed
 * newest-first on reconnect; each entry carries an idempotency key so a
 * retried flush never double-applies server side.
 */
export const outbox = {
  enqueue(kind: OutboxEntry['kind'], payload: Record<string, unknown>): OutboxEntry {
    const entry: OutboxEntry = {
      id: makeId(),
      idempotencyKey: makeId(),
      kind,
      payload,
      createdAt: Date.now(),
    };
    const queue = readQueue();
    queue.push(entry);
    writeQueue(queue);
    return entry;
  },

  list(): OutboxEntry[] {
    return readQueue();
  },

  remove(id: string): void {
    writeQueue(readQueue().filter((e) => e.id !== id));
  },

  clear(): void {
    writeQueue([]);
  },

  /**
   * Flushes queued entries newest-first via `sender`. Entries that fail stay
   * queued for the next attempt; entries that succeed are removed.
   */
  async flush(sender: (entry: OutboxEntry) => Promise<void>): Promise<{ sent: number; failed: number }> {
    const queue = [...readQueue()].sort((a, b) => b.createdAt - a.createdAt);
    let sent = 0;
    let failed = 0;
    for (const entry of queue) {
      try {
        await sender(entry);
        this.remove(entry.id);
        sent++;
      } catch {
        failed++;
      }
    }
    return { sent, failed };
  },
};
