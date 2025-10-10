import { NextRequest } from "next/server";
import { sendMail } from "@/lib/email/sendMail";

export async function POST(req: NextRequest) {
  try {
    const { nom, email, sujet, message } = await req.json();

    if (!nom || !email || !sujet || !message) {
      return Response.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    await sendMail({
      to: "infos@csb-bf.com",
      subject: `[Contact CSB] ${sujet}`,
      html: `
        <div style="font-family:Arial,sans-serif;font-size:16px;">
          <h2 style="color:#1976d2;">Nouveau message de contact</h2>
          <p><strong>Nom :</strong> ${nom}</p>
          <p><strong>Email :</strong> ${email}</p>
          <p><strong>Sujet :</strong> ${sujet}</p>
          <p><strong>Message :</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
        </div>
      `,
      replyTo: email, // <-- fonctionne si tu as ajouté replyTo dans le helper
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: "Erreur lors de l'envoi du message." }, { status: 500 });
  }
}