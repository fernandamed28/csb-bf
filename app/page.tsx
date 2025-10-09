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
    image: "/medias/images/luca-bravo-9l_326FISzk-unsplash.jpg",
    date: "2025-10-01",
    author: "A. Ouédraogo",
  },
  {
    id: 2,
    title: "Retour sur l’atelier régional de Ouaga",
    excerpt:
      "Synthèse des échanges, recommandations et perspectives issues de l’atelier régional du 15 septembre.",
    image: "/medias/images/csb_logo.png",
    date: "2025-09-15",
    author: "M. Sawadogo",
  },
  {
    id: 3,
    title: "CSB lance sa plateforme digitale",
    excerpt:
      "Un nouvel outil pour suivre les activités, rapports et annonces de la confédération en temps réel.",
    image: "/medias/images/carlos-muza-hpjSkU2UYSU-unsplash.jpg",
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
        {/* HERO */}
        <section className="relative flex items-center justify-center min-h-[75vh] overflow-hidden">
          {/* Fond animé */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-700 via-cyan-500 to-blue-400 opacity-20 blur-[90px]"
            animate={{ opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Contenu */}
          <motion.div
            className="relative z-10 text-center max-w-4xl mx-auto px-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="text-[25px] md:text-[25px] lg:text-[40px] font-bold text-blue-700 mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-700 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Confédération Syndicale Burkinabè (CSB)
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 font-semibold leading-relaxed">
              Retrouvez les actualités, analyses, annonces et activités de la
              Confédération Syndicale Burkinabè. <br />
              <span className="text-cyan-600 font-semibold">
                Restez informés, restez engagés.
              </span>
            </p>
            <motion.a
              href="/compte/user/authentification"
              /*onClick={handleScrollToBlog}*/
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block bg-gradient-to-r from-blue-700 to-cyan-500 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              Explorer les activités
            </motion.a>
          </motion.div>
        </section>

        {/* BLOG SECTION */}
        <section id="blog" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.h2
              className="text-center text-[25px] md:text-[25px] lg:text-[40px] font-bold text-blue-700 mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Derniers articles
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-3xl shadow-[1px_1px_7px_rgba(0,0,0,0.1)] border border-blue-100 flex flex-col min-h-[440px] transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-[1px_1px_20px_rgba(0,0,0,0.2)]"
                >
                  <div className="relative w-full h-[230px] overflow-hidden rounded-t-3xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={500}
                      height={230}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/10" />
                  </div>

                  <div className="flex flex-col flex-1 p-7">
                    <div className="flex gap-3 text-cyan-500 text-sm font-semibold mb-2 opacity-90">
                      <span>
                        {new Date(post.date).toLocaleDateString("fr-FR")}
                      </span>
                      <span>• {post.author}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-blue-700 mb-3 group-hover:text-cyan-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-base mb-5 flex-1 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <a
                      href="#"
                      className="text-cyan-600 font-semibold text-base hover:text-blue-700 transition-all duration-200 relative after:content-[''] after:block after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-blue-700 after:to-cyan-400 after:transition-all after:duration-300 hover:after:w-full after:absolute after:left-0 after:bottom-[-2px]"
                    >
                      Lire l’article →
                    </a>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="py-24 px-4 md:py-32 bg-gradient-to-br from-white via-[#f2f8ff] to-[#e3f3ff] flex flex-wrap items-center justify-center gap-16 md:gap-28"
        >
          <motion.div
            className="max-w-xl px-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[25px] md:text-[25px] lg:text-[40px] font-bold text-blue-700 mb-6">
              À propos de la CSB
            </h2>
            <p className="text-gray-700 text-lg mb-6 font-semibold leading-relaxed">
              La Confédération Syndicale Burkinabè (CSB) est une organisation engagée
              pour la défense des droits des travailleurs, la promotion du dialogue
              social et le renforcement du mouvement syndical au Burkina Faso.
            </p>
            <ul className="space-y-3">
              {[
                "Actualités syndicales et sociales",
                "Analyses et dossiers thématiques",
                "Vie de l’organisation",
                "Plateforme ouverte aux membres",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center text-lg text-cyan-600 font-semibold"
                >
                  <span className="mr-2 text-blue-700">✔</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Image
              src="/medias/images/csb_logo.png"
              alt="À propos"
              width={350}
              height={350}
              className="rounded-[32px] shadow-2xl hover:scale-105 transition-transform duration-500 p-10 bg-white"
            />
          </motion.div>
        </section>
      </main>
      <Footer />
    </>
  );
}
