import { getConnection } from "@/lib/db/connexion_db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return new Response(JSON.stringify({ error: "Champs requis" }), { status: 400 });
    }
    const db = await getConnection();
    const [users]: any = await db.query("SELECT * FROM users WHERE id = ?", [payload.id]);
    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "Utilisateur introuvable" }), { status: 404 });
    }
    const user = users[0];
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) {
      return new Response(JSON.stringify({ error: "Mot de passe actuel incorrect" }), { status: 401 });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, payload.id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}