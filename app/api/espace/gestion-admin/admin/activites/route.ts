import { getConnection } from "@/lib/db/connexion_db";

export async function GET() {
  try {
    const db = await getConnection();
    const [activities]: any = await db.query(
      `SELECT * FROM activites ORDER BY created_at DESC`
    );
    return new Response(JSON.stringify({ data: activities }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await getConnection();
    const { titre, description, commentaire, lignes } = await req.json();

    const [result]: any = await db.query(
      `INSERT INTO activites (titre, description, commentaire) VALUES (?, ?, ?)`,
      [titre, description, commentaire]
    );
    const activiteId = result.insertId;

    for (const l of lignes) {
      await db.query(
        `INSERT INTO activite_lignes (activite_id, resultat, activite, groupes_cibles, themes, date_debut, date_fin, lieux, sources_verification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          activiteId,
          l.resultat,
          l.activite,
          l.groupes_cibles,
          l.themes,
          l.date_debut,
          l.date_fin,
          l.lieux,
          l.sources_verification,
        ]
      );
    }

    return new Response(JSON.stringify({ message: "Activité créée", id: activiteId }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}