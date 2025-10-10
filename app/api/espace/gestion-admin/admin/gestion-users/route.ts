import { getConnection } from "@/lib/db/connexion_db";
import { sendMail } from "@/lib/email/sendMail";
import { RowDataPacket } from "mysql2"; // ✅ Import du bon type

// 🧱 Typage du modèle utilisateur
interface User extends RowDataPacket {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: "actif" | "inactif";
  created_at: string;
}

// 📥 GET — Récupération des utilisateurs
export async function GET(req: Request) {
  try {
    const url = new URL(req.url || "", "http://localhost:3000/compte/login/admin-csb-bf");
    const statut = url.searchParams.get("statut");

    const db = await getConnection();

    let query = "SELECT * FROM users";
    const params: any[] = [];

    if (statut === "actif" || statut === "inactif") {
      query += " WHERE statut = ?";
      params.push(statut);
    }

    query += " ORDER BY created_at DESC";

    // ✅ Typage propre du résultat MySQL
    const [users] = await db.query<User[]>(query, params);

    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/users :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}

// 🔄 PATCH — Activation / désactivation utilisateur
export async function PATCH(req: Request) {
  try {
    const { id, statut } = await req.json();

    if (!id || !["actif", "inactif"].includes(statut)) {
      return new Response(JSON.stringify({ error: "Paramètres invalides" }), { status: 400 });
    }

    const db = await getConnection();

    // 🔹 Mise à jour du statut
    await db.query("UPDATE users SET statut = ? WHERE id = ?", [statut, id]);

    // 🔹 Si l'utilisateur vient d’être activé → envoi d’un mail
    if (statut === "actif") {
      const [users] = await db.query<User[]>("SELECT * FROM users WHERE id = ?", [id]);

      if (users.length > 0) {
        const user = users[0];

        await sendMail({
          to: user.email,
          subject: "Votre compte CSB a été activé",
          html: `
            <div style="font-family:Arial,sans-serif;padding:24px;">
              <h2 style="color:#1976d2;">Félicitations ${user.prenom} !</h2>
              <p>Votre compte a été activé le ${new Date().toLocaleDateString("fr-FR")}.</p>
              <p>Vous pouvez maintenant vous connecter à votre espace utilisateur.</p>
              <p style="color:#1976d2;">L'équipe CSB</p>
            </div>
          `,
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Erreur PATCH /api/users :", error);
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
