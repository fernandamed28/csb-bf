import { getConnection } from "@/lib/db/connexion_db";
import jwt from "jsonwebtoken";
import { sendMail } from "@/lib/email/sendMail";
import bcrypt from "bcryptjs";
import { RowDataPacket } from "mysql2";

const SECRET = process.env.JWT_SECRET || "dev_secret";

interface Admin extends RowDataPacket {
  id: number;
  email: string;
  password_hash: string;
  nom: string;
  prenom: string;
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Champs requis" }), { status: 400 });
    }
    const db = await getConnection();
    const [admins] = await db.query<Admin[]>(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );
    if (admins.length === 0) {
      return new Response(JSON.stringify({ error: "Identifiants invalides" }), { status: 401 });
    }
    const admin = admins[0];
    const match = await bcrypt.compare(password, admin.password_hash);
    if (!match) {
      return new Response(JSON.stringify({ error: "Identifiants invalides" }), { status: 401 });
    }
    const otp = generateOTP();
    const otpToken = jwt.sign(
      { id: admin.id, email: admin.email, otp },
      SECRET,
      { expiresIn: "10m" }
    );
    await sendMail({
      to: admin.email,
      subject: "Votre code de connexion CSB",
      html: `
        <div style="font-family:Arial,sans-serif;padding:24px;">
          <h2 style="color:#1976d2;">Connexion à l'espace admin CSB</h2>
          <p>Bonjour ${admin.prenom},</p>
          <p>Votre code de connexion est :</p>
          <div style="font-size:2rem;font-weight:bold;letter-spacing:6px;margin:24px 0;">${otp}</div>
          <p>Ce code est valable 10 minutes.</p>
        </div>
      `,
    });
    return new Response(JSON.stringify({ otpToken }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}