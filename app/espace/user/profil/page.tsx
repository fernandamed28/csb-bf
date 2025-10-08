"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeaderUser from "@/components/Header_user";
import Footer from "@/components/Footer";
import { getToken, setToken } from "@/lib/auth/user/token";

export default function ProfilUser() {
  const [user, setUser] = useState<{ nom: string; prenom: string; email: string; telephone?: string } | null>(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "" });
  const [edit, setEdit] = useState(false);
  const [editPwd, setEditPwd] = useState(false);
  const [pwdForm, setPwdForm] = useState({ oldPassword: "", newPassword: "", newPassword2: "" });
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/compte/user/authentification");
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
      setForm({
        nom: payload.nom,
        prenom: payload.prenom,
        email: payload.email,
        telephone: payload.telephone || "",
      });
    } catch {
      setUser(null);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwdForm({ ...pwdForm, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const res = await fetch("/api/compte/user/profil", {
      method: "POST",
      body: JSON.stringify(form),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("✅ Profil mis à jour avec succès !");
      if (data.token) setToken(data.token);
      setEdit(false);
      setUser({ ...user!, ...form });
    } else {
      setMessage(data.error || "Erreur lors de la mise à jour.");
    }
  };

  const handlePwdSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (pwdForm.newPassword !== pwdForm.newPassword2) {
      setMessage("⚠️ Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    const res = await fetch("/api/compte/user/profil/password", {
      method: "POST",
      body: JSON.stringify({ oldPassword: pwdForm.oldPassword, newPassword: pwdForm.newPassword }),
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("🔒 Mot de passe modifié avec succès !");
      setEditPwd(false);
      setPwdForm({ oldPassword: "", newPassword: "", newPassword2: "" });
    } else {
      setMessage(data.error || "Erreur lors de la modification.");
    }
  };

  return (
    <>
      <HeaderUser />
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg sm:max-w-xl border border-blue-100 transition-all hover:shadow-2xl">
          <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center tracking-tight">
            Mon Profil
          </h1>

          {user && !edit && (
            <div className="space-y-5 text-gray-800">
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <span className="text-gray-500 text-sm">Nom</span>
                <span className="font-semibold">{user.nom}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <span className="text-gray-500 text-sm">Prénom</span>
                <span className="font-semibold">{user.prenom}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 border-b pb-2">
                <span className="text-gray-500 text-sm">Email</span>
                <span className="font-semibold break-words overflow-hidden">{user.email}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <span className="text-gray-500 text-sm">Téléphone</span>
                <span className="font-semibold">{user.telephone || "-"}</span>
              </div>

              <div className="flex flex-wrap gap-3 mt-6 justify-center">
                <button
                  onClick={() => setEdit(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition shadow-sm hover:shadow-md"
                >
                  ✏️ Modifier mes infos
                </button>
                <button
                  onClick={() => setEditPwd(true)}
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Modifier mon mot de passe
                </button>
              </div>
            </div>
          )}

          {/* Formulaire modification infos */}
          {edit && (
            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  placeholder="Nom"
                  className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
                <input
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  placeholder="Prénom"
                  className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  required
                />
              </div>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                placeholder="Téléphone"
                type="tel"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <div className="flex flex-wrap gap-3 justify-center pt-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-sm hover:shadow-md"
                >
                  💾 Enregistrer
                </button>
                <button
                  type="button"
                  onClick={() => setEdit(false)}
                  className="text-gray-500 hover:text-gray-700 underline"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {/* Formulaire mot de passe */}
          {editPwd && (
            <form onSubmit={handlePwdSave} className="space-y-4 mt-6">
              <input
                name="oldPassword"
                value={pwdForm.oldPassword}
                onChange={handlePwdChange}
                placeholder="Mot de passe actuel"
                type="password"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                name="newPassword"
                value={pwdForm.newPassword}
                onChange={handlePwdChange}
                placeholder="Nouveau mot de passe"
                type="password"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <input
                name="newPassword2"
                value={pwdForm.newPassword2}
                onChange={handlePwdChange}
                placeholder="Confirmer le nouveau mot de passe"
                type="password"
                className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
                required
              />
              <div className="flex flex-wrap gap-3 justify-center pt-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold transition shadow-sm hover:shadow-md"
                >
                  🔒 Changer le mot de passe
                </button>
                <button
                  type="button"
                  onClick={() => setEditPwd(false)}
                  className="text-gray-500 hover:text-gray-700 underline"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

          {message && (
            <div
              className={`mt-5 text-center text-sm font-semibold ${
                message.startsWith("✅") || message.startsWith("🔒")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
