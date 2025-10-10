"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { EnvelopeIcon, UserIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import Header from "@/components/Header_user";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/espace/contact", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });
      setLoading(false);
      if (res.ok) {
        setSent(true);
      } else {
        setError("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch {
      setLoading(false);
      setError("Erreur réseau.");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-blue-100"
        >
          <h1 className="text-3xl font-extrabold text-blue-700 mb-2 text-center">Contactez-nous</h1>
          <p className="text-gray-500 text-center mb-6">Une question, une suggestion ? Écrivez-nous, nous vous répondrons rapidement.</p>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 text-green-700 px-4 py-3 rounded text-center font-semibold"
            >
              Merci pour votre message ! Nous vous répondrons très vite.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-center">{error}</div>
              )}
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="nom">
                  Nom
                </label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-3 py-2 border border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="pl-10 pr-3 py-2 border border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                    placeholder="Votre email"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="sujet">
                  Sujet
                </label>
                <input
                  id="sujet"
                  name="sujet"
                  type="text"
                  value={form.sujet}
                  onChange={handleChange}
                  required
                  className="px-3 py-2 border border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition"
                  placeholder="Sujet de votre message"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="px-3 py-2 border border-blue-200 rounded w-full focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition resize-none"
                  placeholder="Votre message..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded py-2 transition text-lg"
              >
                {loading ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}