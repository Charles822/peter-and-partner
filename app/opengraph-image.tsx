import { createBrandSocialImageResponse, BRAND_OG_SIZE } from "@/lib/og-brand-image";

export const runtime = "nodejs";
export const alt = "On-Call CTO";
export const size = BRAND_OG_SIZE;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createBrandSocialImageResponse();
}
