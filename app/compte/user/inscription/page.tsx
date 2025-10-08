"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { INDICATIFS } from "@/lib/data/indicatifs";

export default function Inscription() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    email2: "",
    indicatif: INDICATIFS[0].code,
    telephone: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.email !== form.email2) {
      setError("Les emails ne correspondent pas.");
      return;
    }
    if (form.password !== form.password2) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/compte/user/inscription", {
      method: "POST",
      body: JSON.stringify({
        nom: form.nom,
        prenom: form.prenom,
        email: form.email,
        telephone: form.indicatif + form.telephone,
        password: form.password,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription.");
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push("/compte/user/authentification");
    }, 3500);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 mb-20 w-full max-w-[600px] space-y-5 border border-blue-100"
        >
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Créer un compte</h1>
          {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded">{error}</div>}
          {success && (
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded text-center font-semibold">
              Votre compte a été créé avec succès.<br />
              Il sera activé par un administrateur.<br />
              Vous recevrez un email de notification après validation.<br />
              Redirection vers la connexion...
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              name="nom"
              type="text"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full sm:w-1/2"
              autoComplete="family-name"
            />
            <input
              name="prenom"
              type="text"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full sm:w-1/2"
              autoComplete="given-name"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full sm:w-1/2"
              autoComplete="email"
            />
            <input
              name="email2"
              type="email"
              placeholder="Confirmer l'email"
              value={form.email2}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full sm:w-1/2"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="indicatif"
              value={form.indicatif}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full sm:w-1/3"
            >
              {INDICATIFS.map((ind) => (
                <option key={ind.code} value={ind.code}>
                  {ind.flag} {ind.code} {ind.label}
                </option>
              ))}
            </select>
            <input
              name="telephone"
              type="tel"
              placeholder="Téléphone"
              value={form.telephone}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full sm:w-2/3"
              autoComplete="tel"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              name="password"
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full sm:w-1/2"
              autoComplete="new-password"
            />
            <input
              name="password2"
              type="password"
              placeholder="Confirmer le mot de passe"
              value={form.password2}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded w-full sm:w-1/2"
              autoComplete="off"
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 w-full transition"
          >
            {loading ? "Création du compte..." : "Créer mon compte"}
          </button>
          <div className="text-center text-sm mt-2">
            Déjà inscrit ?{" "}
            <a href="/compte/user/authentification" className="text-blue-600 hover:underline">
              Se connecter
            </a>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}