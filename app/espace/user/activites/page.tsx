"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import ActivityForm from "@/components/ActivityForm";
import Modal from "@/components/Modal";
import Header from "@/components/Header_user";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { setToken, getToken } from "@/lib/auth/user/token";





// Helper pour formater la période
function formatPeriode(lignes: any[]) {
  if (!lignes || lignes.length === 0) return "";
  // Cherche la première ligne avec une date_debut
  const first = lignes.find((l) => l.date_debut);
  const last = lignes.findLast ? lignes.findLast((l) => l.date_fin) : [...lignes].reverse().find((l) => l.date_fin);
  if (first && last && first.date_debut && last.date_fin) {
    if (first.date_debut === last.date_fin) {
      return new Date(first.date_debut).toLocaleDateString("fr-FR");
    }
    return `Du ${new Date(first.date_debut).toLocaleDateString("fr-FR")} au ${new Date(last.date_fin).toLocaleDateString("fr-FR")}`;
  }
  if (first && first.date_debut) return `À partir du ${new Date(first.date_debut).toLocaleDateString("fr-FR")}`;
  if (last && last.date_fin) return `Jusqu'au ${new Date(last.date_fin).toLocaleDateString("fr-FR")}`;
  return "";
}

export default function ActivitesAdmin() {
  const [activities, setActivities] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/compte/user/authentification");
    }
    // Ici, tu peux aussi vérifier la validité du token via une API si besoin
  }, [router]);


  // On charge aussi les lignes pour chaque activité
  const fetchActivities = async (resetFilters = false) => {
    setLoading(true);
    const res = await axios.get("/api/espace/gestion-admin/admin/activites");
    const activities = res.data.data;

    // Pour chaque activité, charge ses lignes
    const withLignes = await Promise.all(
      activities.map(async (act: any) => {
        const lignesRes = await axios.get(`/api/espace/gestion-admin/admin/activites/${act.id}/lignes`);
        return { ...act, lignes: lignesRes.data.data || [] };
      })
    );
    setActivities(withLignes);
    setLoading(false);
    if (resetFilters) {
      setSearch("");
      setSort("recent");
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Le filtre s'applique sur titre/description, le tri sur created_at
  const filtered = activities
    .filter(
      (act) =>
        act.titre.toLowerCase().includes(search.toLowerCase()) ||
        act.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sort === "recent"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : a.titre.localeCompare(b.titre)
    );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gradient-to-br from-[#f9fbff] via-[#eef4ff] to-white px-4 sm:px-8 py-12 relative">
        {/* --- LOADING SPINNER --- */}
        {loading && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-white/60">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 1.1,
                ease: "linear",
              }}
              className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-8">
          {/* --- HEADER BAR --- */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-700 tracking-tight">
                Activités
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Consultez les activités
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md flex items-center gap-1 hover:bg-blue-200 transition"
                onClick={() => fetchActivities(true)}
              >
                <ArrowPathIcon className="w-5 h-5" /> Actualiser
              </button>
            </div>
          </div>

          {/* --- FILTRES --- */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center bg-white p-4 rounded-xl shadow-sm border">
            <div className="relative w-full md:w-80">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une activité..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-3 py-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                disabled={loading}
              />
            </div>
            <select
              className="border px-3 py-2 rounded-md bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              disabled={loading}
            >
              <option value="recent">Les plus récentes</option>
              <option value="titre">Titre (A-Z)</option>
            </select>
          </div>

          {/* --- LISTE DES ACTIVITÉS --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {!loading &&
              filtered.map((act) => {
                // On prend la première ligne pour le lieu principal
                const mainLigne = act.lignes && act.lignes.length > 0 ? act.lignes[0] : null;
                return (
                  <motion.div
                    key={act.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border border-blue-100 rounded-2xl shadow-sm cursor-pointer hover:shadow-lg bg-white p-6 flex flex-col justify-between transition group relative overflow-hidden"
                    onClick={() =>
                      router.push(
                        `/espace/user/activites/${act.id}?from=${encodeURIComponent(pathname)}`
                      )
                    }
                  >
                    {/* Bandeau coloré à gauche */}
                    <span className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-blue-500 to-blue-300 rounded-l-2xl group-hover:from-blue-700 group-hover:to-blue-400 transition-all-ease-in-out transition" />
                    <div className="flex-1 flex flex-col gap-2">
                      <h2 className="font-bold text-lg text-blue-700 line-clamp-2 flex items-center gap-2">
                        {act.titre}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-500 text-xs mt-1 flex-wrap">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>
                          {formatPeriode(act.lignes)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-3">
                        {act.description || <span className="italic text-gray-400">Aucune description fournie.</span>}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                        {mainLigne?.lieux && (
                          <>
                      <span className="flex font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded -md items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                        {mainLigne.lieux}
                      </span>
                          </>
                        )}
                      <button
                        className="text-blue-600 hover:underline font-semibold cursor-pointer z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/espace/user/activites/${act.id}?from=${encodeURIComponent(act.titre)}`
                          );
                        }}
                      >
                        Détails
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {/* --- AUCUNE ACTIVITÉ --- */}
          {!loading && filtered.length === 0 && (
            <div className="text-center text-gray-400 py-16 border border-dashed rounded-xl bg-white">
              <p className="text-lg">Aucune activité trouvée.</p>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL --- */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <ActivityForm
            editing={editing}
            onSaved={() => {
              setModalOpen(false);
              fetchActivities();
            }}
          />
        </Modal>
      )}

      <Footer />
    </>
  );
}