import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Must match [app/icon.svg](app/icon.svg) — rasterized for Open Graph / Twitter (PNG). */
export const BRAND_OG_SIZE = { width: 1200, height: 630 } as const;

export function createBrandSocialImageResponse() {
  const svg = readFileSync(join(process.cwd(), "app", "icon.svg"), "utf8");
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFA",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse runtime; not next/image */}
        <img src={src} width={280} height={280} alt="" />
      </div>
    ),
    { ...BRAND_OG_SIZE }
  );
}
