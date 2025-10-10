import { getConnection } from "@/lib/db/connexion_db";

export async function GET() {
  try {
    const db = await getConnection();

    // Nombre d'activités
    const [actRows]: any = await db.query("SELECT COUNT(*) as count FROM activites");
    const activitesCount = actRows[0]?.count || 0;

    // Nombre d'utilisateurs
    const [userRows]: any = await db.query("SELECT COUNT(*) as count FROM users");
    const usersCount = userRows[0]?.count || 0;

    // Nombre de rapports (exemple, adapte si tu as une table rapports)
    let rapportsCount = 0;
    try {
      const [rapRows]: any = await db.query("SELECT COUNT(*) as count FROM rapports");
      rapportsCount = rapRows[0]?.count || 0;
    } catch {
      rapportsCount = 0; // Si pas de table rapports
    }

    // Taux d’activité (exemple : % d’activités ayant au moins une ligne)
    const [withLignesRows]: any = await db.query(`
      SELECT COUNT(DISTINCT a.id) as count
      FROM activites a
      JOIN activite_lignes l ON l.activite_id = a.id
    `);
    const activitesWithLignes = withLignesRows[0]?.count || 0;
    const tauxActivite = activitesCount > 0 ? Math.round((activitesWithLignes / activitesCount) * 100) : 0;

    return Response.json({
      activites: activitesCount,
      users: usersCount,
      rapports: rapportsCount,
      tauxActivite,
    });
  } catch (error) {
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}