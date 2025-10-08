import { getConnection } from "@/lib/db/connexion_db";
import jwt from "jsonwebtoken";
import { sendMail } from "@/lib/email/sendMail";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return new Response(JSON.stringify({ error: "Email requis" }), { status: 400 });

    const db = await getConnection();
    const [users]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      // Toujours OK pour la sécurité
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
    const user = users[0];
    const resetToken = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: "30m" });
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/compte/user/authentification/mot-de-passe-oublie?token=${resetToken}`;

    await sendMail({
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html: `

      <div style="font-family: 'Montserrat', Arial, sans-serif; background-color: #f7f7f7; font-weight: 600; padding: 20px;">
  <!-- Lien Google Fonts (certains clients mails le prendront en compte) -->
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">

  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background-color: #1976d2; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 700;">Réinitialisation de mot de passe</h1>
    </div>

    <!-- Body -->
    <div style="padding: 20px; color: #333333; line-height: 1.6; font-weight: 600;">
      <p style="font-size: 16px;">Bonjour <strong>${user.prenom || ""}</strong>,</p>

      <p style="font-size: 16px;">
        Pour réinitialiser votre mot de passe, cliquez sur le bouton ci-dessous :
      </p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #1976d2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; display: inline-block; font-family: 'Montserrat', Arial, sans-serif;">
          Réinitialiser mon mot de passe
        </a>
      </p>

      <p style="font-size: 14px; color: #555555;">
        Ce lien est valable 30 minutes. <br>
        Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.
      </p>

      <p style="margin-top: 40px; font-size: 16px; color: #1976d2; font-weight: 600;">
        L'équipe CSB
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f0f0f0; text-align: center; padding: 10px; font-size: 12px; color: #888888;">
      &copy; 2025 CSB. Tous droits réservés.
    </div>
  </div>
</div>

      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}