import { getConnection } from "@/lib/db/connexion_db";

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = await getConnection();
    const [lignes]: any = await db.query(
      `SELECT * FROM activite_lignes WHERE activite_id = ? ORDER BY id ASC`,
      [id]
    );
    return new Response(JSON.stringify({ data: lignes }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
