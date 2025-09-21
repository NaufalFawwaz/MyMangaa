export default function Footer() {
  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--bg-secondary)] py-8 transition-bg">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-3">
            MyMangaa
          </h3>
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-2xl mx-auto">
            Data disediakan oleh{' '}
            <a 
              href="https://mangadex.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline font-medium"
            >
              MangaDex API
            </a>
            {' '}untuk tujuan edukasi dan portofolio.
          </p>
        </div>

        <div className="border-t border-[var(--bg-secondary)] my-5"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-3 md:mb-0">
            <p className="text-xs text-[var(--text-muted)]">
              © {new Date().getFullYear()} MyMangaa. All rights reserved.
            </p>
          </div>
          
          <div className="text-center md:text-right mt-3 md:mt-0">
            <p className="text-xs text-[var(--text-muted)]">
              Support official releases
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Gunakan toggle di header untuk beralih antara <span className="text-[var(--color-primary)] font-medium">Light/Dark Mode</span>
          </p>
        </div>
      </div>
    </footer>
  );
}