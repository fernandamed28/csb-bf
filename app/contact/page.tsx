"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const posts = [
  {
    id: 1,
    title: "Lancement du nouveau programme syndical",
    excerpt:
      "Découvrez les grandes lignes du nouveau programme CSB pour 2025 et les ambitions portées par l’organisation.",
    image: "/blog1.jpg",
    date: "2025-10-01",
    author: "A. Ouédraogo",
  },
  {
    id: 2,
    title: "Retour sur l’atelier régional de Ouaga",
    excerpt:
      "Synthèse des échanges, recommandations et perspectives issues de l’atelier régional du 15 septembre.",
    image: "/blog2.jpg",
    date: "2025-09-15",
    author: "M. Sawadogo",
  },
  {
    id: 3,
    title: "CSB lance sa plateforme digitale",
    excerpt:
      "Un nouvel outil pour suivre les activités, rapports et annonces de la confédération en temps réel.",
    image: "/blog3.jpg",
    date: "2025-09-05",
    author: "S. Kaboré",
  },
];

export default function Home() {
  const [isFading, setIsFading] = useState(false);

  // Scroll fluide + effet fade avant le déplacement
  const handleScrollToBlog = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsFading(true);
    setTimeout(() => {
      const blogSection = document.querySelector("#blog");
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: "smooth" });
      }
      setTimeout(() => setIsFading(false), 100);
    }, 50);
  };

  return (
    <>
      <Header />
      <AnimatePresence>
        {isFading && (
          <motion.div
            className="fixed inset-0 bg-white z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <main className="bg-gradient-to-br from-[#f9fbff] via-[#e9f3ff] to-white min-h-screen">

      </main>
      <Footer />
    </>
  );
}
