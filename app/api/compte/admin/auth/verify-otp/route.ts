import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  try {
    const { otpToken, otp } = await req.json();
    if (!otpToken || !otp) {
      return new Response(JSON.stringify({ error: "Champs requis" }), { status: 400 });
    }
    let payload: any;
    try {
      payload = jwt.verify(otpToken, SECRET);
    } catch {
      return new Response(JSON.stringify({ error: "OTP expiré ou invalide" }), { status: 401 });
    }
    if (payload.otp !== otp) {
      return new Response(JSON.stringify({ error: "Code incorrect" }), { status: 401 });
    }
    // Auth OK, génère un vrai token admin
    const adminToken = jwt.sign(
      { id: payload.id, email: payload.email, role: "admin" },
      SECRET,
      { expiresIn: "6h" }
    );
    return new Response(JSON.stringify({ adminToken }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
  }
}