import { statfs } from "fs/promises";
import net from "net";
import os from "os";
import type { HealthSnapshot } from "../../types";

const DRIVE_LETTERS = ["E", "F", "G", "H"] as const;
const PING_MS = 1500;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function bytesToGb(bytes: number): number {
  return Math.round((bytes / 1024 ** 3) * 10) / 10;
}

async function probeDrive(letter: string): Promise<NonNullable<HealthSnapshot["drives"]>[number]> {
  const root = `${letter}:\\`;
  try {
    const stats = await statfs(root);
    const blockSize = stats.bsize;
    const freeBytes = stats.bfree * blockSize;
    const totalBytes = stats.blocks * blockSize;
    return {
      letter,
      freeGb: bytesToGb(freeBytes),
      totalGb: bytesToGb(totalBytes),
      ok: totalBytes > 0,
    };
  } catch {
    return { letter, ok: false };
  }
}

function tcpReachable(host: string, port: number, ms = PING_MS): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    const done = (ok: boolean) => {
      socket.removeAllListeners();
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(ms);
    socket.once("connect", () => done(true));
    socket.once("timeout", () => done(false));
    socket.once("error", () => done(false));
  });
}

async function cssReachable(): Promise<boolean> {
  const base = process.env.CSS_AUTH_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:9000";
  try {
    const res = await withTimeout(
      fetch(`${base}/.well-known/jwks.json`, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(PING_MS),
      }),
      PING_MS,
    );
    return res.ok;
  } catch {
    try {
      const res = await withTimeout(
        fetch(base, { method: "HEAD", cache: "no-store", signal: AbortSignal.timeout(PING_MS) }),
        PING_MS,
      );
      return res.ok || res.status < 500;
    } catch {
      return false;
    }
  }
}

/** Collect machine health snapshot (Node runtime only). */
export async function collectHealthSnapshot(): Promise<HealthSnapshot> {
  const drives = await Promise.all(DRIVE_LETTERS.map((letter) => probeDrive(letter)));
  const [postgresOk, cssOk] = await Promise.all([
    tcpReachable("127.0.0.1", 5432),
    cssReachable(),
  ]);

  return {
    at: new Date().toISOString(),
    uptimeSec: Math.floor(os.uptime()),
    drives,
    postgresOk,
    cssOk,
  };
}
