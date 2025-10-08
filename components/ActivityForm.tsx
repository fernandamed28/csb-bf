"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  CalendarDaysIcon,
  MapPinIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface Ligne {
  resultat: string;
  activite: string;
  groupes_cibles: string;
  themes: string;
  date_debut: string;
  date_fin: string;
  lieux: string;
  sources_verification: string;
}

export default function ActivityForm({
  editing,
  onSaved,
}: {
  editing?: any;
  onSaved: () => void;
}) {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [lignes, setLignes] = useState<Ligne[]>([
    {
      resultat: "",
      activite: "",
      groupes_cibles: "",
      themes: "",
      date_debut: "",
      date_fin: "",
      lieux: "",
      sources_verification: "",
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editing) {
      setTitre(editing.titre || "");
      setDescription(editing.description || "");
      setCommentaire(editing.commentaire || "");
      setLignes(
        editing.lignes?.length
          ? editing.lignes
          : [
              {
                resultat: "",
                activite: "",
                groupes_cibles: "",
                themes: "",
                date_debut: "",
                date_fin: "",
                lieux: "",
                sources_verification: "",
              },
            ]
      );
    }
  }, [editing]);

  const handleLigneChange = (i: number, field: keyof Ligne, value: string) => {
    const copy = [...lignes];
    copy[i][field] = value;
    setLignes(copy);
  };

  const addLigne = () =>
    setLignes([
      ...lignes,
      {
        resultat: "",
        activite: "",
        groupes_cibles: "",
        themes: "",
        date_debut: "",
        date_fin: "",
        lieux: "",
        sources_verification: "",
      },
    ]);

  const removeLigne = (i: number) =>
    setLignes(lignes.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await axios.put(
          `/api/espace/gestion-admin/admin/activites/${editing.id}`,
          { titre, description, commentaire, lignes }
        );
      } else {
        await axios.post(`/api/espace/gestion-admin/admin/activites`, {
          titre,
          description,
          commentaire,
          lignes,
        });
      }
      onSaved();
    } catch {
      alert("❌ Une erreur est survenue lors de l’enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100"
    >
      {/* --- Loader --- */}
      {loading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      )}

      {/* --- En-tête --- */}
      <header className="border-b pb-4 mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-blue-700">
          {editing ? "✏️ Modifier une activité" : "🆕 Nouvelle activité"}
        </h2>
      </header>

      {/* --- Section informations générales --- */}
      <section className="space-y-4">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            placeholder="Ex : Sensibilisation sur l’hygiène publique"
            className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Décrivez brièvement l’activité..."
            className="w-full border border-gray-300 px-3 py-2 rounded-lg resize-y focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            disabled={loading}
          />
        </div>
      </section>

      {/* --- Lignes de détails --- */}
      <section className="mt-8 space-y-5">
        <h3 className="font-bold text-lg text-blue-600 flex items-center gap-2">
          <PlusIcon className="w-5 h-5 text-blue-500" />
          Détails de l’activité
        </h3>

        {lignes.map((ligne, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative border border-blue-100 p-5 rounded-xl bg-gradient-to-br from-white to-blue-50/50 shadow-sm hover:shadow-md transition-all"
          >
            {/* bouton suppression */}
            {lignes.length > 1 && (
              <button
                type="button"
                onClick={() => removeLigne(idx)}
                className="absolute top-3 right-3 text-red-500 hover:bg-red-100 rounded-full p-1"
                title="Supprimer cette ligne"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <textarea
                placeholder="Résultat attendu"
                value={ligne.resultat}
                onChange={(e) =>
                  handleLigneChange(idx, "resultat", e.target.value)
                }
                className="border px-3 py-2 rounded-lg resize-y focus:ring-2 focus:ring-blue-300"
                rows={2}
                disabled={loading}
              />
              <textarea
                placeholder="Activité"
                value={ligne.activite}
                onChange={(e) =>
                  handleLigneChange(idx, "activite", e.target.value)
                }
                className="border px-3 py-2 rounded-lg resize-y focus:ring-2 focus:ring-blue-300"
                rows={2}
                disabled={loading}
              />
              <textarea
                placeholder="Groupes cibles"
                value={ligne.groupes_cibles}
                onChange={(e) =>
                  handleLigneChange(idx, "groupes_cibles", e.target.value)
                }
                className="border px-3 py-2 rounded-lg resize-y focus:ring-2 focus:ring-blue-300"
                rows={2}
                disabled={loading}
              />
              <textarea
                placeholder="Thèmes"
                value={ligne.themes}
                onChange={(e) =>
                  handleLigneChange(idx, "themes", e.target.value)
                }
                className="border px-3 py-2 rounded-lg resize-y focus:ring-2 focus:ring-blue-300"
                rows={2}
                disabled={loading}
              />

              {/* Période */}
              <div className="flex flex-col sm:flex-row gap-2 items-center sm:col-span-2">
                <CalendarDaysIcon className="w-5 h-5 text-blue-500" />
                <input
                  type="date"
                  value={ligne.date_debut}
                  onChange={(e) =>
                    handleLigneChange(idx, "date_debut", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-300"
                />
                <span className="text-gray-500">au</span>
                <input
                  type="date"
                  value={ligne.date_fin}
                  onChange={(e) =>
                    handleLigneChange(idx, "date_fin", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg flex-1 focus:ring-2 focus:ring-blue-300"
                />
              </div>

              {/* Lieu */}
              <div className="flex items-center gap-2 sm:col-span-2">
                <MapPinIcon className="w-5 h-5 text-blue-500" />
                <input
                  type="text"
                  placeholder="Lieu(x)"
                  value={ligne.lieux}
                  onChange={(e) =>
                    handleLigneChange(idx, "lieux", e.target.value)
                  }
                  className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <textarea
                placeholder="Sources de vérification"
                value={ligne.sources_verification}
                onChange={(e) =>
                  handleLigneChange(idx, "sources_verification", e.target.value)
                }
                className="border px-3 py-2 rounded-lg resize-y focus:ring-2 focus:ring-blue-300 sm:col-span-2"
                rows={2}
                disabled={loading}
              />
            </div>
          </motion.div>
        ))}

        {/* Bouton ajouter ligne */}
        <div className="flex justify-start">
          <button
            type="button"
            onClick={addLigne}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 flex items-center gap-2 transition-all duration-200"
          >
            <PlusIcon className="w-5 h-5" /> Ajouter une ligne
          </button>
        </div>
      </section>

      {/* --- Commentaire --- */}
      <section className="mt-8">
        <label className="block font-semibold mb-1 text-gray-700">
          Commentaire (optionnel)
        </label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 px-3 py-2 rounded-lg resize-y focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
          disabled={loading}
        />
      </section>

      {/* --- Bouton de validation --- */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
        >
          {editing ? "Mettre à jour" : "Enregistrer"}
        </button>
      </div>
    </motion.form>
  );
}
