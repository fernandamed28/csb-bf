"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setToken, getToken } from "@/lib/auth/admin/token";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AdminAuthPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


    useEffect(() => {
      // Redirige vers la page de login si PAS de token
      if (!getToken()) {
        router.replace("/compte/login/admin-csb-bf");
      }
    }, [router]);


  // 1ère étape : login + envoi OTP
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/compte/admin/auth/login", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setOtpToken(data.otpToken);
    setStep(2);
  };

  // 2ème étape : vérification OTP
  const handleOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/compte/admin/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ otpToken, otp }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Erreur");
      return;
    }
    setToken(data.adminToken);
    router.push("/espace/gestion-admin/admin/dashboard");
  };

  return (
      <>
        <Header />
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <form
        onSubmit={step === 1 ? handleLogin : handleOtp}
        className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-[400px] space-y-5 border border-blue-100"
      >
        <h1 className="text-2xl font-bold text-blue-700 mb-2 text-center">Connexion Admin</h1>
        {error && <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-center">{error}</div>}
        {step === 1 ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              className="border px-3 py-2 rounded w-full"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              className="border px-3 py-2 rounded w-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 w-full transition"
            >
              {loading ? "Envoi du code..." : "Se connecter"}
            </button>
          </>
        ) : (
          <>
            <div className="text-center text-sm text-gray-600 mb-2">
              Un code a été envoyé à votre email.
            </div>
            <input
              type="text"
              placeholder="Code reçu par email"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              className="border px-3 py-2 rounded w-full tracking-widest text-center font-mono"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 w-full transition"
            >
              {loading ? "Vérification..." : "Valider le code"}
            </button>
          </>
        )}
      </form>
    </main>
        <Footer />
    </>
  );
}