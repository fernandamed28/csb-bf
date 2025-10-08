import { getConnection } from "@/lib/db/connexion_db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { nom, prenom, email, telephone, password } = await req.json();
    if (!nom || !prenom || !email || !password) {
      return new Response(JSON.stringify({ error: "Champs requis manquants" }), { status: 400 });
    }
    const db = await getConnection();
    const [users]: any = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (users.length > 0) {
      return new Response(JSON.stringify({ error: "Email déjà utilisé" }), { status: 409 });
    }
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (nom, prenom, email, telephone, password_hash) VALUES (?, ?, ?, ?, ?)",
      [nom, prenom, email, telephone, hash]
    );
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}