"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getToken } from "@/lib/auth/admin/token";
import Header from "../Header_admin";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

type User = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  statut: "actif" | "inactif";
  created_at: string;
};

export default function GestionUtilisateurs() {
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<"all" | "actif" | "inactif">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace("/compte/login/admin-csb-bf");
    }
  }, [router]);

  const fetchUsers = async (statut?: "actif" | "inactif") => {
    setLoading(true);
    let url = "/api/espace/gestion-admin/admin/gestion-users";
    if (statut) url += `?statut=${statut}`;
    const res = await fetch(url);
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(filter === "all" ? undefined : filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleStatut = async (id: number, statut: "actif" | "inactif") => {
    setLoading(true);
    const res = await fetch("/api/espace/gestion-admin/admin/gestion-users", {
      method: "PATCH",
      body: JSON.stringify({ id, statut }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setNotif({
        type: "success",
        message:
          statut === "actif"
            ? "Utilisateur activé et notifié par mail."
            : "Utilisateur désactivé et notifié par mail.",
      });
      fetchUsers(filter === "all" ? undefined : filter);
    } else {
      setNotif({ type: "error", message: data.error || "Erreur lors du changement de statut." });
    }
    setTimeout(() => setNotif(null), 3000);
  };

  // Recherche sur nom, prénom, email
  const filteredUsers = users.filter(
    (u) =>
      u.nom.toLowerCase().includes(search.toLowerCase()) ||
      u.prenom.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <main className="p-8 min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#eef4ff] to-white">
        <div className="max-w-7xl mx-auto mb-6">
          <h1 className="text-3xl font-extrabold mb-6 text-blue-700 tracking-tight">Gestion des utilisateurs</h1>
          {/* Filtres + Recherche */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 rounded transition font-semibold ${
                  filter === "all" ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-blue-50"
                }`}
                onClick={() => setFilter("all")}
              >
                Tous
              </button>
              <button
                className={`px-4 py-2 rounded transition font-semibold ${
                  filter === "actif" ? "bg-green-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-green-50"
                }`}
                onClick={() => setFilter("actif")}
              >
                Actifs
              </button>
              <button
                className={`px-4 py-2 rounded transition font-semibold ${
                  filter === "inactif" ? "bg-red-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-red-50"
                }`}
                onClick={() => setFilter("inactif")}
              >
                Inactifs
              </button>
              <button
                className="ml-4 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold transition"
                onClick={() => {
                  setFilter("all"); // Réinitialise le filtre
                  setSearch("");    // Vide le champ de recherche
                }}
              >
                Actualiser
              </button>

              </div>
              <div className="relative w-full md:w-80 ml-auto">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-3 py-2 bg-white border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                  disabled={loading}
                />
              </div>

          </div>
          {/* Tableau */}
          <div className="overflow-x-auto rounded-xl shadow-lg border border-blue-100 bg-white">
            <table className="min-w-full divide-y divide-blue-100">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Nom</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Prénom</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Téléphone</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3 text-center text-xs font-bold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.1,
                          ease: "linear",
                        }}
                        className="mx-auto w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
                      />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-blue-50 transition"
                      >
                        <td className="px-4 py-3 border-b">{user.nom}</td>
                        <td className="px-4 py-3 border-b">{user.prenom}</td>
                        <td className="px-4 py-3 border-b">{user.email}</td>
                        <td className="px-4 py-3 border-b">{user.telephone}</td>
                        <td className="px-4 py-3 border-b text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                              user.statut === "actif"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {user.statut === "actif" ? (
                              <>
                                <CheckCircleIcon className="w-4 h-4" />
                                Actif
                              </>
                            ) : (
                              <>
                                <XCircleIcon className="w-4 h-4" />
                                Inactif
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b text-center">
                          {user.statut === "actif" ? (
                            <button
                              className="px-3 py-1 rounded bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
                              onClick={() => handleStatut(user.id, "inactif")}
                              disabled={loading}
                            >
                              Désactiver
                            </button>
                          ) : (
                            <button
                              className="px-3 py-1 rounded bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
                              onClick={() => handleStatut(user.id, "actif")}
                              disabled={loading}
                            >
                              Activer
                            </button>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
          {/* Toast notification */}
          <AnimatePresence>
            {notif && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className={`fixed bottom-8 right-8 z-50 px-6 py-4 rounded-lg shadow-lg font-semibold text-white ${
                  notif.type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {notif.message}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}