import { Store, ClientRateLimitInfo } from "express-rate-limit";

interface PenaltyEntry {
  count: number;
  resetTime: number;
  penaltyUntil?: number;
}

export class PenaltyStore implements Store {
  private hits = new Map<string, PenaltyEntry>();
  private windowMs: number;
  private maxHits: number;
  private penaltyMs: number;

  constructor(options: {
    windowMs: number;
    max: number;
    penaltyMs: number;
  }) {
    this.windowMs = options.windowMs;
    this.maxHits = options.max;
    this.penaltyMs = options.penaltyMs;
  }

  async increment(key: string): Promise<ClientRateLimitInfo> {
    const now = Date.now();
    let entry = this.hits.get(key);

    // Check if under penalty
    if (entry?.penaltyUntil && now < entry.penaltyUntil) {
      return {
        totalHits: entry.count,
        resetTime: new Date(entry.penaltyUntil),
      };
    }

    // Reset if window expired and no penalty
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + this.windowMs,
      };
    }

    entry.count++;

    // Apply penalty if limit exceeded
    if (entry.count > this.maxHits) {
      entry.penaltyUntil = now + this.penaltyMs;
    }

    this.hits.set(key, entry);

    return {
      totalHits: entry.count,
      resetTime: new Date(entry.penaltyUntil || entry.resetTime),
    };
  }

  async decrement(key: string): Promise<void> {
    const entry = this.hits.get(key);
    if (entry && entry.count > 0) {
      entry.count--;
      this.hits.set(key, entry);
    }
  }

  async resetKey(key: string): Promise<void> {
    this.hits.delete(key);
  }

  async reset(): Promise<void> {
    this.hits.clear();
  }

  // Cleanup expired entries periodically
  startCleanup(intervalMs: number = 60000): void {
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.hits.entries()) {
        if (now > (entry.penaltyUntil || entry.resetTime)) {
          this.hits.delete(key);
        }
      }
    }, intervalMs);
  }
}
