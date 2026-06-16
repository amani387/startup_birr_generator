/** Resolve public site origin (works behind nginx/reverse proxy on VPS). */
export function getSiteOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    const proto = forwardedProto?.split(",")[0]?.trim() || "http";
    return `${proto}://${forwardedHost.split(",")[0].trim()}`;
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;

  return url.origin;
}
