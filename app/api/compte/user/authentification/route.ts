import { getConnection } from "@/lib/db/connexion_db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Champs requis manquants" }), { status: 400 });
    }
    const db = await getConnection();
    const [users]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "Email ou mot de passe incorrect" }), { status: 401 });
    }
    const user = users[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return new Response(JSON.stringify({ error: "Email ou mot de passe incorrect" }), { status: 401 });
    }
    // Génère un JWT avec les infos du user
    const token = jwt.sign(
      { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email },
      SECRET,
      { expiresIn: "7d" }
    );
    return new Response(JSON.stringify({ token }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}