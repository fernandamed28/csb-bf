"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) {
      setError("Lien invalide.");
      return;
    }
    if (password !== password2) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/compte/user/authentification/mot-de-passe-oublie/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    if (res.ok) {
      setDone(true);
      setTimeout(() => router.push("/compte/user/authentification"), 2500);
    } else {
      const data = await res.json();
      setError(data.error || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-[400px] space-y-5 border border-blue-100"
        >
          <h1 className="text-2xl font-bold text-blue-700 mb-2 text-center">Nouveau mot de passe</h1>
          {done ? (
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded text-center">
              Mot de passe modifié ! Redirection...
            </div>
          ) : (
            <>
              {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-center">{error}</div>}
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="border px-3 py-2 rounded w-full"
              />
              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={password2}
                onChange={e => setPassword2(e.target.value)}
                required
                className="border px-3 py-2 rounded w-full"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 w-full transition"
              >
                {loading ? "Enregistrement..." : "Réinitialiser"}
              </button>
            </>
          )}
        </form>
      </main>
      <Footer />
    </>
  );
}