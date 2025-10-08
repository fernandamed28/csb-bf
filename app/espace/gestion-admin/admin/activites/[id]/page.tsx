"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/app/espace/gestion-admin/admin/Header_admin";
import Footer from "@/components/Footer";
import {
  PencilIcon,
  ArrowPathIcon,
  TrashIcon,
  CalendarDaysIcon,
  MapPinIcon,
  ArrowLeftIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import ActivityForm from "@/components/ActivityForm";
import Modal from "@/components/Modal";

function formatPeriode(date_debut?: string, date_fin?: string) {
  if (!date_debut && !date_fin) return "";
  if (date_debut && date_fin) {
    if (date_debut === date_fin) {
      return new Date(date_debut).toLocaleDateString();
    }
    return `Du ${new Date(date_debut).toLocaleDateString()} au ${new Date(date_fin).toLocaleDateString()}`;
  }
  if (date_debut) return `À partir du ${new Date(date_debut).toLocaleDateString()}`;
  if (date_fin) return `Jusqu'au ${new Date(date_fin).toLocaleDateString()}`;
  return "";
}

const columns = [
  { key: "resultat", label: "Résultat(s)" },
  { key: "activite", label: "Activité" },
  { key: "groupes_cibles", label: "Groupes Cibles" },
  { key: "themes", label: "Thèmes" },
  { key: "periode", label: "Période" },
  { key: "lieux", label: "Lieu(x)" },
  { key: "sources_verification", label: "Sources" },
];

export default function ActiviteDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [activite, setActivite] = useState<any>(null);
  const [editModal, setEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [allLignes, setAllLignes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [colWidths, setColWidths] = useState<number[]>([60, 180, 180, 160, 120, 120, 120, 140]);
  const resizingCol = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const fetch = async () => {
    setLoading(true);
    const res = await axios.get(`/api/espace/gestion-admin/admin/activites/${id}`);
    setActivite(res.data);
    setAllLignes(res.data.lignes || []);
    setSearch("");
    setSort(null);
    setLoading(false);
  };

  useEffect(() => {
    fetch();
    // eslint-disable-next-line
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Supprimer cette activité ?")) {
      await axios.delete(`/api/espace/gestion-admin/admin/activites/${id}`);
      router.push("/espace/gestion-admin/admin/activites");
    }
  };

  // Tri dynamique
  let lignes = allLignes;
  if (search) {
    const q = search.toLowerCase();
    lignes = lignes.filter((l: any) =>
      Object.values(l).some((val) => (val || "").toString().toLowerCase().includes(q))
    );
  }
  if (sort && sort.key !== "periode") {
    lignes = [...lignes].sort((a, b) => {
      const va = (a[sort.key] || "").toString().toLowerCase();
      const vb = (b[sort.key] || "").toString().toLowerCase();
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  } else if (sort && sort.key === "periode") {
    lignes = [...lignes].sort((a, b) => {
      const va = (a.date_debut || "") + (a.date_fin || "");
      const vb = (b.date_debut || "") + (b.date_fin || "");
      if (va < vb) return sort.dir === "asc" ? -1 : 1;
      if (va > vb) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Resize logic
  const handleMouseDown = (idx: number, e: React.MouseEvent) => {
    resizingCol.current = idx;
    startX.current = e.clientX;
    startWidth.current = colWidths[idx];
    document.body.style.cursor = "col-resize";
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizingCol.current !== null) {
      const delta = e.clientX - startX.current;
      setColWidths((prev) => {
        const next = [...prev];
        next[resizingCol.current!] = Math.max(60, startWidth.current + delta);
        return next;
      });
    }
  };

  const handleMouseUp = () => {
    resizingCol.current = null;
    document.body.style.cursor = "";
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  // Tri au clic sur l'en-tête
  const handleSort = (key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#eef4ff] to-white px-2 md:px-4 py-6 md:py-10 relative">
        {/* Animation de chargement */}
        {loading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        )}
        {!loading && activite && (
          <div className="max-w-full md:max-w-7xl mx-auto bg-white p-4 md:p-8 rounded-2xl shadow space-y-6 overflow-x-auto">
            <div className="flex flex-col md:flex-row gap-4 md:justify-between items-center mb-6">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm md:text-base"
                onClick={() => router.push("/espace/gestion-admin/admin/activites")}
              >
                <ArrowLeftIcon className="w-5 h-5" /> Retour
              </button>
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm md:text-base"
                  onClick={fetch}
                  title="Actualiser"
                >
                  <ArrowPathIcon className="w-4 h-4" /> Actualiser
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 text-sm md:text-base"
                  onClick={() => setEditModal(true)}
                  title="Modifier"
                >
                  <PencilIcon className="w-4 h-4" /> Modifier
                </button>
                <button
                  className="flex items-center gap-1 px-3 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200 text-sm md:text-base"
                  onClick={handleDelete}
                  title="Supprimer"
                >
                  <TrashIcon className="w-4 h-4" /> Supprimer
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-blue-700">{activite.titre}</h1>
                <p className="text-gray-600 mt-2 text-sm text-justify md:text-base">{activite.description}</p>
                {activite.commentaire && (
                  <p className="text-gray-500 text-sm  mt-2 text-justify">
                     {activite.commentaire}
                  </p>
                )}
              </div>
            </div>
            {/* Filtres, recherche, tri */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center border-b pb-3 mb-4">
              <input
                type="text"
                placeholder="Rechercher dans les lignes..."
                className="border px-3 py-2 rounded w-full sm:w-72 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Table responsive, tri et resize */}
            <div className="w-full overflow-x-auto">
              <motion.table
                className="min-w-[900px] w-full border rounded-xl overflow-hidden shadow text-sm md:text-base select-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <thead className="bg-blue-100 text-gray-700  font-bold">
                  <tr>
                    <th
                      style={{ width: colWidths[0], minWidth: 60 }}
                      className="border px-2 py-3 text-center relative group"
                    >
                      #
                      <span
                        className="absolute right-0 top-0 h-full w-2 cursor-col-resize group-hover:bg-blue-200/40"
                        onMouseDown={e => handleMouseDown(0, e)}
                      />
                    </th>
                    {columns.map((col, idx) => (
                      <th
                        key={col.key}
                        style={{ width: colWidths[idx + 1], minWidth: 80 }}
                        className="border px-2 py-3 text-center relative group whitespace-nowrap"
                      >
                        <button
                          type="button"
                          className="flex items-center gap-1 w-full justify-center font-semibold"
                          onClick={() => handleSort(col.key)}
                        >
                          {col.key === "periode" ? (
                            <>
                              <CalendarDaysIcon className="w-4 h-4" />
                              {col.label}
                            </>
                          ) : col.key === "lieux" ? (
                            <>
                              <MapPinIcon className="w-4 h-4" />
                              {col.label}
                            </>
                          ) : (
                            col.label
                          )}
                          {sort?.key === col.key ? (
                            sort.dir === "asc" ? (
                              <ChevronUpIcon className="w-4 h-4" />
                            ) : (
                              <ChevronDownIcon className="w-4 h-4" />
                            )
                          ) : (
                            <ChevronUpDownIcon className="w-4 h-4 opacity-40" />
                          )}
                        </button>
                        <span
                          className="absolute right-0 top-0 h-full w-2 cursor-col-resize group-hover:bg-blue-200/40"
                          onMouseDown={e => handleMouseDown(idx + 1, e)}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lignes.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                        Aucune ligne trouvée.
                      </td>
                    </tr>
                  ) : (
                    lignes.map((l: any, idx: number) => (
                      <tr key={idx} className="hover:bg-blue-50 transition-colors text-gray-500 text-sm align-top">
                        <td className="border px-2 py-2 text-center">{idx + 1}</td>
                        <td className="border px-2 py-2">{l.resultat}</td>
                        <td className="border px-2 py-2">{l.activite}</td>
                        <td className="border px-2 py-2">{l.groupes_cibles}</td>
                        <td className="border px-2 py-2">{l.themes}</td>
                        <td className="border px-2 py-2 text-center whitespace-nowrap">
                          {formatPeriode(l.date_debut, l.date_fin)}
                        </td>
                        <td className="border px-2 py-2">{l.lieux}</td>
                        <td className="border px-2 py-2">{l.sources_verification}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </motion.table>
            </div>
          </div>
        )}
      </main>
      {editModal && (
        <Modal onClose={() => setEditModal(false)}>
          <ActivityForm
            editing={activite}
            onSaved={() => {
              setEditModal(false);
              fetch();
            }}
          />
        </Modal>
      )}
      <Footer />
    </>
  );
}