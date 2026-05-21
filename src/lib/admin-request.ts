import { parseAdminSessionToken, getAdminSessionCookieName } from "@/lib/admin-auth";

function parseCookies(cookieHeader: string) {
  return cookieHeader.split(";").reduce<Record<string, string>>((acc, pair) => {
    const [rawKey, ...rawValue] = pair.trim().split("=");
    if (!rawKey) {
      return acc;
    }

    acc[rawKey] = decodeURIComponent(rawValue.join("="));
    return acc;
  }, {});
}

export function isAdminAuthenticatedRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const cookies = parseCookies(cookieHeader);
  const token = cookies[getAdminSessionCookieName()];
  return Boolean(parseAdminSessionToken(token));
}
