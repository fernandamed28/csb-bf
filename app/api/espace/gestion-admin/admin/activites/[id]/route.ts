import { getConnection } from "@/lib/db/connexion_db";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getConnection();
    const [activites]: any = await db.query(`SELECT * FROM activites WHERE id = ?`, [params.id]);
    if (activites.length === 0) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    const [lignes]: any = await db.query(`SELECT * FROM activite_lignes WHERE activite_id = ?`, [params.id]);
    return new Response(JSON.stringify({ ...activites[0], lignes }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getConnection();
    const { titre, description, commentaire, lignes } = await req.json();

    await db.query(
      `UPDATE activites SET titre = ?, description = ?, commentaire = ? WHERE id = ?`,
      [titre, description, commentaire, params.id]
    );
    await db.query(`DELETE FROM activite_lignes WHERE activite_id = ?`, [params.id]);
    for (const l of lignes) {
      await db.query(
        `INSERT INTO activite_lignes (activite_id, resultat, activite, groupes_cibles, themes, date_debut, date_fin, lieux, sources_verification) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          params.id,
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
    return new Response(JSON.stringify({ message: "Activité mise à jour" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getConnection();
    await db.query(`DELETE FROM activites WHERE id = ?`, [params.id]);
    return new Response(JSON.stringify({ message: "Activité supprimée" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}