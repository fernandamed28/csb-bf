import { getConnection } from "@/lib/db/connexion_db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Vérifie que tous les champs sont présents
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Champs requis manquants" }),
        { status: 400 }
      );
    }

    // Connexion à la base de données
    const db = await getConnection();

    // Recherche de l'utilisateur
    const [users]: any = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: "Email ou mot de passe incorrect" }),
        { status: 401 }
      );
    }

    const user = users[0];

    // Vérifie le statut de l'utilisateur
    if (user.statut && user.statut.toLowerCase() === "inactif") {
      return new Response(
        JSON.stringify({ error: "Compte non actif.\nContactez le support !" }),
          { status: 403 }
      );
    }

    // Vérifie le mot de passe
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return new Response(
        JSON.stringify({ error: "Email ou mot de passe incorrect" }),
        { status: 401 }
      );
    }

    // Génère un JWT valide pendant 6 heures
    const token = jwt.sign(
      {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        statut: user.statut
      },
      SECRET,
      { expiresIn: "6h" } // ← expire après 6 heures
    );

    // Réponse OK
    return new Response(
      JSON.stringify({ token, message: "Connexion réussie" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur serveur:", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
