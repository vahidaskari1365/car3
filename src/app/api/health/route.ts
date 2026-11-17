export const dynamic = "force-static";

export async function GET() {
  return Response.json({ ok: true, app: "khodroyar", mode: "static-data", time: new Date().toISOString() });
}
