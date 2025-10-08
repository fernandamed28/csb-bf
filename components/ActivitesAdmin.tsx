"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/app/espace/gestion-admin/admin/Header_admin";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import ActivityForm from "@/components/ActivityForm";
import Modal from "@/components/Modal";

export default function ActivitesAdmin() {
  const [activities, setActivities] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const fetchActivities = async () => {
    const res = await axios.get("/api/espace/gestion-admin/admin/activites");
    setActivities(res.data.data);
  };

  useEffect(() => { fetchActivities(); }, []);

  const router = useRouter();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#eef4ff] to-white px-6 py-12">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-700">Activités récentes</h1>
            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => { setEditing(null); setModalOpen(true); }}>Ajouter activité</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activities.map(act => (
              <motion.div key={act.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="border rounded-lg shadow p-4 bg-white">
                <h2 className="font-bold text-lg">{act.titre}</h2>
                <p className="text-sm text-gray-600 line-clamp-3">{act.description}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(act.created_at).toLocaleDateString()}</p>
                <div className="flex justify-between mt-3">
                  <button className="text-blue-600 hover:underline" onClick={() => router.push(`/activites/${act.id}`)}>Voir plus</button>
                  <button className="text-red-600 hover:underline" onClick={async () => { if(confirm("Supprimer ?")) { await axios.delete(`/api/activites/${act.id}`); fetchActivities(); } }}>Supprimer</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <ActivityForm editing={editing} onSaved={() => { setModalOpen(false); fetchActivities(); }} />
        </Modal>
      )}

      <Footer />
    </>
  );
}
