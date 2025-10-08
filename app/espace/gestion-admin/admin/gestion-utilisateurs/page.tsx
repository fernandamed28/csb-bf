"use client";

import { motion } from "framer-motion";
import Header from "../Header_admin";
import { ChartBarIcon, UsersIcon, CalendarDaysIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/Footer";
import { hr } from "framer-motion/client";
import Link from "next/link";

const stats = [
  {
    id: 1,
    title: "Activités en cours",
    value: "12",
    icon: CalendarDaysIcon,
    color: "from-blue-600 to-cyan-500",
    href: "/espace/gestion-admin/admin/activites",
  },
  {
    id: 2,
    title: "Utilisateurs enregistrés",
    value: "245",
    icon: UsersIcon,
    color: "from-green-600 to-lime-500",
    href: "/espace/gestion-admin/admin/gestion-utilisateurs",
  },
  {
    id: 3,
    title: "Rapports disponibles",
    value: "37",
    icon: ClipboardDocumentListIcon,
    color: "from-purple-600 to-pink-500",
    href: "/espace/gestion-admin/admin/rapports",
  },
  {
    id: 4,
    title: "Taux d’activité",
    value: "87%",
    icon: ChartBarIcon,
    color: "from-orange-500 to-yellow-400",
    href: "/espace/gestion-admin/admin/statistiques",
  },
];


export default function Dashboard() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#eef4ff] to-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* TITRE */}
          <motion.h1
            className="text-[25px] md:text-[25px] lg:text-[35px] font-extrabold text-blue-700/60 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Tableau de bord 
          </motion.h1>

          {/* STAT CARDS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Link key={stat.id} href={stat.href}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`cursor-pointer bg-white shadow-lg rounded-xl p-6 flex flex-col items-start justify-between border-l-4 border-transparent hover:border-l-4 hover:border-cyan-500 transition-all duration-300`}
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{stat.value}</h3>
              <p className="text-gray-500 font-semibold">{stat.title}</p>
            </motion.div>
          </Link>
        );
      })}
    </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
