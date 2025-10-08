"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Header from "@/app/espace/gestion-admin/admin/Header_admin";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function ActiviteDetail() {
  const { id } = useParams();
  const [activite, setActivite] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/espace/gestion-admin/admin/activites/${id}`).then(res => setActivite(res.data));
  }, [id]);

  if(!activite) return <p>Chargement...</p>;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-4">
          <h1 className="text-2xl font-bold">{activite.titre}</h1>
          <p>{activite.description}</p>
          {activite.commentaire && <p className="text-gray-600 italic">Commentaire : {activite.commentaire}</p>}

          <h2 className="font-bold mt-4">Tableau détaillé</h2>
          <table className="min-w-full border mt-2">
            <thead className="bg-blue-100">
              <tr>
                <th className="border px-3 py-1">#</th>
                <th className="border px-3 py-1">Résultat</th>
                <th className="border px-3 py-1">Activité</th>
                <th className="border px-3 py-1">Groupes Cibles</th>
                <th className="border px-3 py-1">Thèmes</th>
                <th className="border px-3 py-1">Dates / Lieux</th>
                <th className="border px-3 py-1">Sources</th>
              </tr>
            </thead>
            <tbody>
              {activite.lignes.map((l:any, idx:number) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="border px-2 py-1">{idx+1}</td>
                  <td className="border px-2 py-1">{l.resultat}</td>
                  <td className="border px-2 py-1">{l.activite}</td>
                  <td className="border px-2 py-1">{l.groupes_cibles}</td>
                  <td className="border px-2 py-1">{l.themes}</td>
                  <td className="border px-2 py-1">{new Date(l.dates_lieux).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{l.sources_verification}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </>
  );
}
