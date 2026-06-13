import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

/*
 * Tiny JSON store: Vercel Blob (private) in production, local file in dev.
 * Shared by leads, admins, etc.
 */
const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

export async function readJson<T>(name: string, fallback: T): Promise<T> {
  if (hasBlob) {
    try {
      const res = (await get(name, { access: "private" })) as unknown as {
        statusCode: number;
        stream: ReadableStream;
      } | null;
      if (!res || res.statusCode !== 200) return fallback;
      return JSON.parse(await new Response(res.stream).text()) as T;
    } catch {
      return fallback;
    }
  }
  try {
    const p = path.join(process.cwd(), "data", name);
    return JSON.parse(await fs.readFile(p, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson(name: string, data: unknown): Promise<void> {
  if (hasBlob) {
    await put(name, JSON.stringify(data), {
      access: "private",
      allowOverwrite: true,
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return;
  }
  const p = path.join(process.cwd(), "data", name);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf-8");
}
