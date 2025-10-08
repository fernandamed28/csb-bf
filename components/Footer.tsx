export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-700 to-cyan-400 text-white pt-10 pb-4">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-start gap-10">
        {/* Bloc 1 */}
        <div className="flex-1 mb-8 md:mb-0">
          <div className="flex items-center gap-3 mb-4">
            <img src="/medias/images/csb_logo.png" alt="" className="w-12 h-12 rounded-full shadow" />
            <span className="font-bold text-2xl tracking-tight">CSB</span>
          </div>
          <p className="text-white/80 mb-3">
            La Confédération Syndicale Burkinabè (CSB) défend les droits des travailleurs, promeut le dialogue social et l’innovation syndicale au Burkina Faso.
          </p>
          <div className="flex gap-4 mt-3">
            <a
              href="#"
              className="hover:text-yellow-200 transition-colors"
              aria-label="Facebook"
              title="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.02 3.66 9.16 8.44 9.93v-7.03h-2.54v-2.9h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.23 22 17.09 22 12.07z"/></svg>
            </a>
            <a
              href="#"
              className="hover:text-yellow-200 transition-colors"
              aria-label="Twitter"
              title="Twitter"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 11.07 11c0 .34.04.67.1.99C7.69 11.8 4.84 10.13 2.98 7.7c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.94 3.62-.72-.02-1.4-.22-1.99-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.12 2.94 3.99 2.97A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.38-.01-.57A8.7 8.7 0 0 0 24 4.59a8.48 8.48 0 0 1-2.54.7z"/></svg>
            </a>
            <a
              href="#"
              className="hover:text-yellow-200 transition-colors"
              aria-label="LinkedIn"
              title="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.76 1.37-1.56 2.82-1.56 3.02 0 3.58 1.99 3.58 4.58v5.75z"/></svg>
            </a>
          </div>
        </div>
        {/* Bloc 2 */}
        <div className="flex-1 mb-8 md:mb-0">
          <h3 className="font-bold text-lg mb-3">Navigation</h3>
          <ul className="space-y-2">
            <li>
              <a href="#hero" className="hover:text-yellow-200 transition-colors">Accueil</a>
            </li>
            <li>
              <a href="#blog" className="hover:text-yellow-200 transition-colors">Articles</a>
            </li>
            <li>
              <a href="#about" className="hover:text-yellow-200 transition-colors">À propos</a>
            </li>
            <li>
              <a href="#contact" className="hover:text-yellow-200 transition-colors">Contact</a>
            </li>
          </ul>
        </div>
        {/* Bloc 3 */}
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-3">Contact</h3>
          <div className="mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-200" fill="currentColor" viewBox="0 0 24 24"><path d="M21 8V7l-3 2-2-2-7 7 2 2 7-7 2 2 3-2z"/></svg>
            <span>contact@csb.org</span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-200" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
            <span>Ouagadougou, Burkina Faso</span>
          </div>
          <div className="mb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-200" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1C7.61 22 2 16.39 2 9.5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.35.27 2.67.76 3.88a1 1 0 0 1-.21 1.11l-2.2 2.2z"/></svg>
            <span>+226 </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/20 mt-10 pt-6 text-center text-white/80 text-sm">
        © {new Date().getFullYear()} CSB Blog. Tous droits réservés.
      </div>
    </footer>
  );
}