import { getAppUrl, isLocalhostUrl } from "@/lib/app-url";

/** Resolve public site origin from an incoming request (proxy-safe). */
export function getSiteOrigin(request: Request): string {
  const url = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto");

  if (forwardedHost) {
    const proto = forwardedProto?.split(",")[0]?.trim() || "http";
    return `${proto}://${forwardedHost.split(",")[0].trim()}`;
  }

  const host = request.headers.get("host");
  if (host && !isLocalhostUrl(host)) {
    const proto = url.protocol.replace(":", "") || "http";
    return `${proto}://${host.split(",")[0].trim()}`;
  }

  return getAppUrl();
}
