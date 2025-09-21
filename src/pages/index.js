import { useState, useEffect } from 'react';
import Layout from '@/components/layouts/Layout';
import Header from '@/components/layouts/Header';
import Card from '@/components/ui/Card';
import Pagination from '@/components/common/Pagination';
import Footer from '@/components/layouts/Footer';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useFavorites } from '@/hooks/useFavorite';
import { useDebounce } from '@/hooks/useDebounce';
import * as mangadex from '@/lib/mangadex';

export async function getServerSideProps() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/search?page=1&limit=20`);
    if (!response.ok) throw new Error(`API returned status ${response.status}`);

    const data = await response.json();
    return {
      props: {
        initialManga: data.mangaList || [],
        initialTotalPages: data.totalPages || 1,
        initialPage: data.currentPage || 1,
      },
    };
  } catch (error) {
    return {
      props: {
        initialManga: [],
        initialTotalPages: 1,
        initialPage: 1,
      },
    };
  }
}

export default function Home({ initialManga = [], initialTotalPages = 1, initialPage = 1 }) {
  const [mangaList, setMangaList] = useState(initialManga);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);

  const debouncedSearch = useDebounce(searchQuery, 500);
  const { isDark, toggleDarkMode, isMounted } = useDarkMode();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchManga = async () => {
      if (!isMounted) return;
      setLoading(true);

      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
        const response = await fetch(
          `${baseUrl}/api/search?q=${encodeURIComponent(debouncedSearch)}&page=${currentPage}&limit=20`,
          { signal: controller.signal, headers: { 'Accept': 'application/json' } }
        );

        if (!isMounted || !response.ok) return;

        const data = await response.json();
        if (isMounted) {
          setMangaList(Array.isArray(data.mangaList) ? data.mangaList : []);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setMangaList([]);
          setTotalPages(1);
          setCurrentPage(1);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchManga();
    return () => { isMounted = false; controller.abort(); };
  }, [debouncedSearch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleToggleFavorite = (manga) => {
    isFavorite(manga.id) ? removeFavorite(manga.id) : addFavorite(manga);
  };

  if (!isMounted) {
    return (
      <Layout>
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        searchQuery={searchQuery}
        onSearch={handleSearch}
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="min-h-screen bg-[var(--bg-primary)] transition-bg">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                  {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Koleksi Manga'}
                </h1>
                <p className="text-[var(--text-secondary)] mt-2">
                  {mangaList.length > 0
                    ? `Menampilkan ${mangaList.length} hasil`
                    : 'Temukan manga favorit Anda'}
                </p>
              </div>

              {mangaList.length > 0 && (
                <div className="flex items-center gap-2 bg-[var(--bg-card)] px-4 py-2 rounded-lg shadow-sm border border-[var(--bg-secondary)] transition-bg">
                  <span className="text-sm text-[var(--text-muted)]">Halaman</span>
                  <span className="font-medium text-[var(--text-primary)]">{currentPage}</span>
                  <span className="text-sm text-[var(--text-muted)]">dari</span>
                  <span className="font-medium text-[var(--text-primary)]">{totalPages}</span>
                </div>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="bg-[var(--bg-card)] rounded-xl shadow-md overflow-hidden animate-pulse border border-[var(--bg-secondary)] transition-bg">
                    <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/5"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : mangaList.length === 0 ? (
              <div className="text-center py-16 bg-[var(--bg-card)] rounded-xl shadow-sm border border-[var(--bg-secondary)] transition-bg">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
                  {searchQuery ? 'Tidak ada hasil ditemukan' : 'Belum ada manga'}
                </h3>
                <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto">
                  {searchQuery
                    ? `Tidak ada hasil untuk "${searchQuery}". Coba kata kunci lain atau jelajahi koleksi.`
                    : 'Mulai dengan mencari manga favorit Anda.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Lihat Semua Manga
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-10">
                  {mangaList.map((manga) => (
                    <div key={manga.id} className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <Card
                        manga={manga}
                        isFavorite={isFavorite(manga.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </Layout>
  );
}