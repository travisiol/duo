import type { CoinArt } from "@/components/ImageDrop";

/**
 * Where coin art becomes a URL the chain can hold.
 *
 * A 320px PNG is ~100KB of base64. Putting that in calldata would cost more
 * than the launch and may not even fit in a block, so a data URL is NOT a
 * shippable tokenURI — it is only good enough to preview locally.
 *
 * Plug a pinning service (IPFS/Arweave) or your own upload endpoint in here
 * and return the resulting URL. Until then `ART_UPLOAD_CONFIGURED` is false
 * and the launch path says so rather than sending something that fails.
 */
export const ART_UPLOAD_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_ART_UPLOAD_URL);

export async function uploadArt(art: CoinArt): Promise<string> {
  const endpoint = process.env.NEXT_PUBLIC_ART_UPLOAD_URL;
  if (!endpoint) {
    throw new Error("No art upload endpoint is configured.");
  }

  const blob = await (await fetch(art.dataUrl)).blob();
  const body = new FormData();
  body.append("file", blob, art.name);

  const res = await fetch(endpoint, { method: "POST", body });
  if (!res.ok) throw new Error(`Upload failed (${res.status}).`);

  const json: unknown = await res.json();
  const url = (json as { url?: string })?.url;
  if (!url) throw new Error("Upload endpoint returned no url.");
  return url;
}
