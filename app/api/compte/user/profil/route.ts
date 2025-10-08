import { getConnection } from "@/lib/db/connexion_db";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth || !auth.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }
    const token = auth.slice(7);
    let payload: any;
    try {
      payload = jwt.verify(token, SECRET);
    } catch {
      return new Response(JSON.stringify({ error: "Token invalide" }), { status: 401 });
    }
    const { nom, prenom, email, telephone } = await req.json();
    if (!nom || !prenom || !email) {
      return new Response(JSON.stringify({ error: "Champs requis" }), { status: 400 });
    }
    const db = await getConnection();
    await db.query("UPDATE users SET nom = ?, prenom = ?, email = ?, telephone = ? WHERE id = ?", [nom, prenom, email, telephone, payload.id]);
    // Nouveau token avec infos à jour
    const newToken = jwt.sign(
      { id: payload.id, nom, prenom, email, telephone },
      SECRET,
      { expiresIn: "7d" }
    );
    return new Response(JSON.stringify({ success: true, token: newToken }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}