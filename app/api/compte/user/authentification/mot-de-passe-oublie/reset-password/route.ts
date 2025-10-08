import { getConnection } from "@/lib/db/connexion_db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET = process.env.JWT_SECRET || "dev_secret";

interface JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(JSON.stringify({ error: "Token ou mot de passe manquant" }), { status: 400 });
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, SECRET) as JwtPayload;
    } catch {
      return new Response(JSON.stringify({ error: "Lien expiré ou invalide" }), { status: 400 });
    }

    const db = await getConnection();
    const hash = await bcrypt.hash(password, 10);

    await db.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, payload.id]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}
