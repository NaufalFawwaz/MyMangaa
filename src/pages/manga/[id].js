import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layouts/Layout';
import Header from '@/components/layouts/Header';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useFavorites } from '@/hooks/useFavorite';
import * as mangadex from '@/lib/mangadex';
import Button from '@/components/ui/Button';

const getLanguageInfo = (code) => {
  const languages = {
    'en': { name: 'English', flag: '🇺🇸', color: 'bg-blue-500' },
    'id': { name: 'Indonesian', flag: '🇮🇩', color: 'bg-red-500' },
    'ja': { name: 'Japanese', flag: '🇯🇵', color: 'bg-red-500' },
    'ko': { name: 'Korean', flag: '🇰🇷', color: 'bg-red-500' },
    'zh': { name: 'Chinese', flag: '🇨🇳', color: 'bg-red-500' },
    'es': { name: 'Spanish', flag: '🇪🇸', color: 'bg-red-500' },
    'fr': { name: 'French', flag: '🇫🇷', color: 'bg-blue-500' },
    'ru': { name: 'Russian', flag: '🇷🇺', color: 'bg-blue-500' },
    'th': { name: 'Thai', flag: '🇹🇭', color: 'bg-red-500' },
    'vi': { name: 'Vietnamese', flag: '🇻🇳', color: 'bg-red-500' },
    'pt': { name: 'Portuguese', flag: '🇵🇹', color: 'bg-green-500' },
    'ar': { name: 'Arabic', flag: '🇸🇦', color: 'bg-green-500' },
    'de': { name: 'German', flag: '🇩🇪', color: 'bg-black' },
    'it': { name: 'Italian', flag: '🇮🇹', color: 'bg-green-500' },
    'nl': { name: 'Dutch', flag: '🇳🇱', color: 'bg-orange-500' },
    'tr': { name: 'Turkish', flag: '🇹🇷', color: 'bg-red-500' },
  };
  return languages[code] || { name: code.toUpperCase(), flag: '🌐', color: 'bg-gray-500' };
};

export default function MangaDetail({ initialManga }) {
  const { isDark, toggleDarkMode, isMounted: isDarkModeMounted } = useDarkMode();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);
  const [localFavorite, setLocalFavorite] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chaptersByLanguage, setChaptersByLanguage] = useState({});
  const [activeLanguage, setActiveLanguage] = useState('en');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && initialManga?.id) {
      setLocalFavorite(isFavorite(initialManga.id));
    }
  }, [mounted, initialManga?.id, isFavorite]);

  useEffect(() => {
    if (mounted && initialManga?.id) {
      const fetchChapters = async () => {
        try {
          const languages = ['en', 'id', 'ja', 'ko', 'zh'];
          const chaptersPromises = languages.map(lang =>
            mangadex.getChapters(initialManga.id, lang)
          );

          const chaptersResults = await Promise.all(chaptersPromises);

          const chaptersByLang = {};
          languages.forEach((lang, index) => {
            chaptersByLang[lang] = chaptersResults[index];
          });

          setChaptersByLanguage(chaptersByLang);

          const availableLanguages = languages.filter(lang => chaptersByLang[lang]?.length > 0);
          if (availableLanguages.length > 0) {
            setActiveLanguage(availableLanguages[0]);
          }
        } catch (error) {
          console.error('Error fetching chapters:', error);
        }
      };
      fetchChapters();
    }
  }, [mounted, initialManga?.id]);

  const handleToggleFavorite = () => {
    if (initialManga?.id) {
      if (isFavorite(initialManga.id)) {
        removeFavorite(initialManga.id);
      } else {
        addFavorite(initialManga);
      }
      setLocalFavorite(!localFavorite);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  if (!mounted || !isDarkModeMounted) {
    return (
      <Layout>
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </Layout>
    );
  }

  if (!initialManga) {
    return (
      <Layout>
        <Header
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          onSearch={handleSearch}
        />
        <div className="p-6 text-center text-[var(--text-primary)]">Manga tidak ditemukan.</div>
      </Layout>
    );
  }

  const activeChapters = chaptersByLanguage[activeLanguage] || [];
  const sortedActiveChapters = [...activeChapters].sort((a, b) => {
    const chapterA = parseFloat(a.chapter) || 0;
    const chapterB = parseFloat(b.chapter) || 0;
    return chapterA - chapterB;
  });

  const firstChapter = sortedActiveChapters.length > 0 ? sortedActiveChapters[0] : null;
  const lastChapter = sortedActiveChapters.length > 0 ? sortedActiveChapters[sortedActiveChapters.length - 1] : null;

  return (
    <Layout>
      <Header
        isDark={isDark}
        toggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      <main className="min-h-screen bg-[var(--bg-primary)] transition-bg">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <Link href="/" passHref>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 transition-all duration-200 hover:shadow-sm"
              >
                ← Kembali ke Home
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                src={initialManga.coverUrl}
                alt={initialManga.title}
                className="w-full md:w-64 h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
                <h1 className="text-3xl font-bold text-[var(--text-primary)] leading-tight">
                  {initialManga.title}
                </h1>
                <button
                  onClick={handleToggleFavorite}
                  className={`whitespace-nowrap cursor-pointer font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${localFavorite
                      ? 'bg-[var(--color-accent)] hover:bg-red-600 text-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md'
                      : 'border border-[var(--color-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg px-4 py-2 shadow-sm hover:shadow'
                    }`}
                >
                  {localFavorite ? '❤️ Favorit' : 'Tambah Favorit'}
                </button>
              </div>

              {initialManga.description && (
                <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                  {initialManga.description}
                </p>
              )}

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--bg-secondary)] transition-bg">
                <div>
                  <strong className="text-[var(--text-primary)] font-medium">Status:</strong>{' '}
                  <span className={`capitalize ${initialManga.status === 'ongoing'
                      ? 'text-[var(--status-ongoing)]'
                      : 'text-[var(--status-completed)]'
                    }`}>
                    {initialManga.status || 'Unknown'}
                  </span>
                </div>
                <div>
                  <strong className="text-[var(--text-primary)] font-medium">Tahun:</strong>{' '}
                  <span className="text-[var(--text-secondary)]">
                    {initialManga.year || '—'}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {firstChapter && (
                  <Link href={`/chapter/${firstChapter.id}`} passHref>
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex-1 sm:flex-none transition-all duration-200 hover:shadow-md"
                    >
                      📖 Read First Chapter ({getLanguageInfo(activeLanguage).name})
                    </Button>
                  </Link>
                )}
                {lastChapter && (
                  <Link href={`/chapter/${lastChapter.id}`} passHref>
                    <Button
                      variant="secondary"
                      size="md"
                      className="flex-1 sm:flex-none transition-all duration-200 hover:shadow-md"
                    >
                      📚 Read Last Chapter ({getLanguageInfo(activeLanguage).name})
                    </Button>
                  </Link>
                )}
                <a
                  href={`https://mangadex.org/title/${initialManga.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block flex-1 sm:flex-none"
                >
                  <Button
                    variant="outline"
                    size="md"
                    className="w-full transition-all duration-200 hover:shadow-md"
                  >
                    🌐 MangaDex
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Daftar Chapter</h2>
              <div className="flex flex-wrap gap-2">
                {Object.keys(chaptersByLanguage).map((lang) => {
                  const langInfo = getLanguageInfo(lang);
                  const chapters = chaptersByLanguage[lang] || [];
                  if (chapters.length === 0) return null;

                  return (
                    <button
                      key={lang}
                      onClick={() => setActiveLanguage(lang)}
                      className={`flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeLanguage === lang
                          ? 'bg-[var(--color-primary)] text-white shadow-md'
                          : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-card)] shadow-sm'
                        }`}
                    >
                      <span className="text-lg">{langInfo.flag}</span>
                      <span>{langInfo.name}</span>
                      <span className="bg-white/20 text-white px-1.5 py-0.5 rounded text-xs">
                        {chapters.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {Object.keys(chaptersByLanguage).length === 0 ? (
              <div className="text-center py-8 bg-[var(--bg-card)] rounded-lg shadow-sm border border-[var(--bg-secondary)] transition-bg">
                <div className="text-4xl mb-2">📖</div>
                <p className="text-[var(--text-secondary)]">Belum ada chapter tersedia.</p>
              </div>
            ) : (
              <div className="bg-[var(--bg-card)] rounded-lg shadow-sm overflow-hidden border border-[var(--bg-secondary)] transition-bg">
                {(() => {
                  const activeChapters = chaptersByLanguage[activeLanguage] || [];

                  if (activeChapters.length === 0) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-[var(--text-secondary)]">
                          Belum ada chapter dalam bahasa {getLanguageInfo(activeLanguage).name}.
                        </p>
                      </div>
                    );
                  }

                  const volumes = {};
                  activeChapters.forEach(chapter => {
                    const volume = chapter.attributes?.volume || 'No Volume';
                    if (!volumes[volume]) {
                      volumes[volume] = [];
                    }
                    volumes[volume].push(chapter);
                  });

                  return Object.keys(volumes).map((volume) => (
                    <div key={volume} className="border-b border-[var(--bg-secondary)] last:border-b-0">
                      {volume !== 'No Volume' && (
                        <div className="bg-[var(--bg-secondary)] px-6 py-3">
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                            Volume {volume}
                          </h3>
                        </div>
                      )}
                      <ul className="divide-y divide-[var(--bg-secondary)]">
                        {volumes[volume].map((chapter) => (
                          <li key={chapter.id} className="p-4 hover:bg-[var(--bg-secondary)] transition-all duration-200">
                            <Link href={`/chapter/${chapter.id}`} className="block">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-[var(--text-primary)]">
                                      Chapter {chapter.chapter}
                                    </span>
                                    {chapter.title && (
                                      <span className="text-[var(--text-muted)] text-sm">
                                        - {chapter.title}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-[var(--text-muted)]">
                                      {new Date(chapter.publishAt).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </span>
                                    {chapter.scanlationGroups && chapter.scanlationGroups.length > 0 && (
                                      <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                                        {chapter.scanlationGroups[0]}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="ml-4 text-[var(--color-primary)] text-lg font-semibold transition-colors duration-200">
                                  →
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;
  const API_BASE = 'https://api.mangadex.org';

  try {
    const mangaRes = await fetch(`${API_BASE}/manga/${id}?includes[]=cover_art`);
    const mangaData = await mangaRes.json();

    if (!mangaData.data) {
      return { notFound: true };
    }

    const manga = mangaData.data;
    const title = manga.attributes.title.en ||
      manga.attributes.title.ja ||
      Object.values(manga.attributes.title)[0] ||
      'Untitled';

    const description = manga.attributes.description?.en ||
      manga.attributes.description?.ja ||
      'No description available.';

    const status = manga.attributes.status;
    const year = manga.attributes.year;

    let coverUrl = 'https://via.placeholder.com/300x400?text=No+Cover';
    const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');

    if (coverArt && coverArt.attributes?.fileName) {
      coverUrl = `https://uploads.mangadex.org/covers/${id}/${coverArt.attributes.fileName}.512.jpg`;
    }

    const chapters = await mangadex.getChapters(id, 'en');

    return {
      props: {
        initialManga: {
          id,
          title,
          description,
          status,
          year,
          coverUrl,
          chapters: chapters || [],
        },
      },
    };
  } catch (error) {
    console.error('Error fetching manga detail:', error);
    return { notFound: true };
  }
}