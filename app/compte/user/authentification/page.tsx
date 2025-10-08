"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { setToken, getToken } from "@/lib/auth/user/token";

export default function Authentification() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);

  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    if (getToken()) {
      router.replace("/espace/user/activites");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/compte/user/authentification", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Erreur lors de la connexion.");
      return;
    }
    setToken(data.token);
    router.push("/espace/user/activites");
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    setForgotSent(false);
    const res = await fetch("/api/compte/user/authentification/mot-de-passe-oublie", {
      method: "POST",
      body: JSON.stringify({ email: forgotEmail }),
      headers: { "Content-Type": "application/json" },
    });
    setForgotLoading(false);
    if (res.ok) {
      setForgotSent(true);
    } else {
      setForgotError("Aucun compte trouvé ou erreur serveur.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white rounded-2xl shadow-2xl p-8 mb-20 w-full max-w-[430px] space-y-6 border border-blue-100"
        >
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center tracking-tight">Connexion</h1>
          {params.get("inscription") === "ok" && (
            <div className="bg-green-50 text-green-700 px-3 py-2 rounded text-center text-sm">
              Compte créé avec succès, vous pouvez vous connecter.
            </div>
          )}
          {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-center text-sm">{error}</div>}
          <div>
            <label className="block text-gray-600 font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Votre email"
              value={form.email}
              onChange={handleChange}
              required
              className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded w-full transition"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-600 font-medium mb-1" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Votre mot de passe"
              value={form.password}
              onChange={handleChange}
              required
              className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded w-full transition"
              autoComplete="current-password"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 px-6 transition w-full"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
          <div className="flex flex-col items-center gap-2 mt-2">
            <button
              type="button"
              className="text-blue-600 hover:underline text-sm"
              onClick={() => setShowForgot(true)}
            >
              Mot de passe oublié ?
            </button>
            <span className="text-sm text-gray-500">
              Pas encore de compte ?{" "}
              <a href="/compte/user/inscription" className="text-blue-600 hover:underline">
                S'inscrire
              </a>
            </span>
          </div>

          {/* Modal Mot de passe oublié */}
          {showForgot && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs relative animate-fade-in">
      <button
        type="button"
        className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 text-xl"
        onClick={() => {
          setShowForgot(false);
          setForgotEmail("");
          setForgotSent(false);
          setForgotError(null);
        }}
        aria-label="Fermer"
      >
        ×
      </button>
      <h2 className="text-lg font-bold text-blue-700 mb-3 text-center">Mot de passe oublié</h2>
      {forgotSent ? (
        <div className="bg-green-50 text-green-700 px-3 py-2 rounded text-center text-sm">
          Si un compte existe, un email de réinitialisation a été envoyé.
        </div>
      ) : (
        <div className="space-y-3">
          {forgotError && (
            <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-center text-sm">{forgotError}</div>
          )}
          <input
            type="email"
            name="forgotEmail"
            placeholder="Votre email"
            value={forgotEmail}
            onChange={e => setForgotEmail(e.target.value)}
            required
            className="border border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 px-3 py-2 rounded w-full transition"
            autoComplete="email"
          />
          <button
            type="button"
            disabled={forgotLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 w-full transition"
            onClick={handleForgotSubmit}
          >
            {forgotLoading ? "Envoi..." : "Envoyer le lien"}
          </button>
        </div>
      )}
    </div>
  </div>
)}
        </form>
      </main>
      <Footer />
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97);}
          to { opacity: 1; transform: scale(1);}
        }
      `}</style>
    </>
  );
}