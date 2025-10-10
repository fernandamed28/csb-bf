"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth/admin/token";
import { motion } from "framer-motion";
import Header from "../Header_admin";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  ChartBarIcon,
  UsersIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState([
    {
      id: 1,
      title: "Activités enregistrées",
      value: "-",
      icon: CalendarDaysIcon,
      color: "from-blue-600 to-cyan-500",
      href: "/espace/gestion-admin/admin/activites",
    },
    {
      id: 2,
      title: "Utilisateurs enregistrés",
      value: "-",
      icon: UsersIcon,
      color: "from-green-600 to-lime-500",
      href: "/espace/gestion-admin/admin/gestion-utilisateurs",
    },
    {
      id: 4,
      title: "Taux d’activité",
      value: "-",
      icon: ChartBarIcon,
      color: "from-orange-500 to-yellow-400",
      href: "/espace/gestion-admin/admin/statistiques",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/compte/login/admin-csb-bf");
    }
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const res = await fetch("/api/espace/gestion-admin/admin/dashboard");
      const data = await res.json();
      setStats([
        {
          id: 1,
          title: "Activités enregistrées",
          value: data.activites ?? "0",
          icon: CalendarDaysIcon,
          color: "from-blue-600 to-cyan-500",
          href: "/espace/gestion-admin/admin/activites",
        },
        {
          id: 2,
          title: "Utilisateurs enregistrés",
          value: data.users ?? "0",
          icon: UsersIcon,
          color: "from-green-600 to-lime-500",
          href: "/espace/gestion-admin/admin/gestion-utilisateurs",
        },
        {
          id: 3,
          title: "Taux d’activité",
          value: data.tauxActivite !== undefined ? `${data.tauxActivite}%` : "-",
          icon: ChartBarIcon,
          color: "from-orange-500 to-yellow-400",
          href: "/espace/gestion-admin/admin/statistiques",
        },
      ]);
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-[#f8fbff] via-[#eef4ff] to-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            className="text-[25px] md:text-[25px] lg:text-[35px] font-extrabold text-blue-700/60 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Tableau de bord
          </motion.h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 justify-center lg:grid-cols-4 gap-6">
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
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {loading ? (
                        <span className="animate-pulse bg-gray-200 rounded w-10 h-6 inline-block" />
                      ) : (
                        stat.value
                      )}
                    </h3>
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