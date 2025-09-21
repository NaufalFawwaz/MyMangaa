import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/layouts/Layout';
import Header from '@/components/layouts/Header';
import { useDarkMode } from '@/hooks/useDarkMode';
import Button from '@/components/ui/Button';
import * as mangadex from '@/lib/mangadex';

export default function ChapterPage({ initialChapter }) {
  const { isDark, toggleDarkMode, isMounted: isDarkModeMounted } = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isDarkModeMounted) {
    return (
      <Layout>
        <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      </Layout>
    );
  }

  if (!initialChapter) {
    return (
      <Layout>
        <Header 
          isDark={isDark} 
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />
        <div className="p-6 text-center text-[var(--text-primary)]">Chapter tidak ditemukan.</div>
      </Layout>
    );
  }

  const handleSearch = (value) => {
    setSearchQuery(value);
    // if (value.trim()) {
    //   window.location.href = `/?q=${encodeURIComponent(value)}`;
    // }
  };

  return (
    <Layout>
      <Header 
        isDark={isDark} 
        toggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      <main className="min-h-screen bg-[var(--bg-primary)] transition-bg">
        <div className="p-4 sm:p-6 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {initialChapter.mangaTitle} - Chapter {initialChapter.chapterNumber}
              </h1>
              {initialChapter.language && (
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Bahasa: {getLanguageName(initialChapter.language)}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Link href={`/manga/${initialChapter.mangaId}`} passHref>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 transition-all duration-200 hover:shadow-sm"
                >
                  ← Kembali ke Manga
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            {initialChapter.prevChapter && (
              <Link href={`/chapter/${initialChapter.prevChapter.id}`} passHref>
                <Button 
                  variant="secondary" 
                  size="md"
                  className="transition-all duration-200 hover:shadow-md"
                >
                  ← Prev Chapter
                </Button>
              </Link>
            )}
            {initialChapter.nextChapter && (
              <Link href={`/chapter/${initialChapter.nextChapter.id}`} passHref>
                <Button 
                  variant="primary" 
                  size="md"
                  className="transition-all duration-200 hover:shadow-md"
                >
                  Next Chapter →
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-8 mb-12">
            {initialChapter.images.map((img, idx) => (
              <div key={idx} className="bg-[var(--bg-card)] rounded-lg p-4 shadow-sm border border-[var(--bg-secondary)] transition-all duration-200">
                <img
                  src={img}
                  alt={`Halaman ${idx + 1}`}
                  className="w-full max-w-full h-auto rounded-lg shadow-md mx-auto block"
                  onLoad={() => setIsLoading(false)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x800?text=Image+Error';
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8 pb-8">
            {initialChapter.prevChapter && (
              <Link href={`/chapter/${initialChapter.prevChapter.id}`} passHref>
                <Button 
                  variant="secondary" 
                  size="md"
                  className="transition-all duration-200 hover:shadow-md"
                >
                  ← Prev Chapter
                </Button>
              </Link>
            )}
            {initialChapter.nextChapter && (
              <Link href={`/chapter/${initialChapter.nextChapter.id}`} passHref>
                <Button 
                  variant="primary" 
                  size="md"
                  className="transition-all duration-200 hover:shadow-md"
                >
                  Next Chapter →
                </Button>
              </Link>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <div className="bg-[var(--bg-card)] rounded-lg p-4 shadow-sm border border-[var(--bg-secondary)]">
              <div className="text-center">
                <p className="text-[var(--text-secondary)] mb-3">
                  Anda telah mencapai akhir chapter
                </p>
                <Link href={`/manga/${initialChapter.mangaId}`} passHref>
                  <Button 
                    variant="primary" 
                    size="md"
                    className="transition-all duration-200 hover:shadow-md"
                  >
                    Kembali ke Daftar Chapter
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

const getLanguageName = (code) => {
  const languages = {
    'en': 'English',
    'id': 'Indonesian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'es': 'Spanish',
    'fr': 'French',
    'ru': 'Russian',
    'th': 'Thai',
    'vi': 'Vietnamese',
    'pt': 'Portuguese',
    'ar': 'Arabic',
    'de': 'German',
    'it': 'Italian',
    'nl': 'Dutch',
    'tr': 'Turkish',
  };
  return languages[code] || code.toUpperCase();
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const API_BASE = 'https://api.mangadex.org';

  try {
    const serverRes = await fetch(`${API_BASE}/at-home/server/${id}`);
    const serverData = await serverRes.json();
    if (!serverData.baseUrl || !serverData.chapter?.hash) return { notFound: true };

    const images = serverData.chapter.data.map(filename => 
      `${serverData.baseUrl}/data/${serverData.chapter.hash}/${filename}`
    );

    const chapterInfoRes = await fetch(`${API_BASE}/chapter/${id}?includes[]=manga`);
    const chapterInfo = await chapterInfoRes.json();
    const mangaRel = chapterInfo.data.relationships.find(r => r.type === 'manga');
    
    let mangaTitle = 'Unknown Manga';
    let mangaId = '';
    let chapterLanguage = chapterInfo.data.attributes.translatedLanguage || 'en';
    
    if (mangaRel) {
      mangaId = mangaRel.id;
      const mangaRes = await fetch(`${API_BASE}/manga/${mangaRel.id}`);
      const mangaData = await mangaRes.json();
      mangaTitle = mangaData.data.attributes.title.en || 
                   mangaData.data.attributes.title.ja || 
                   Object.values(mangaData.data.attributes.title)[0] || 
                   'Untitled';
    }

    let nextChapter = null;
    let prevChapter = null;

    if (mangaId) {
      const chaptersRes = await fetch(`${API_BASE}/manga/${mangaId}/feed?limit=500&order[chapter]=asc&includes[]=scanlation_group&translatedLanguage[]=${chapterLanguage}`);
      const chaptersData = await chaptersRes.json();
      
      if (chaptersData.data && Array.isArray(chaptersData.data)) {
        const chapters = chaptersData.data
          .map(chap => ({
            id: chap.id,
            chapter: chap.attributes.chapter || 'Oneshot',
            title: chap.attributes.title || '',
            publishAt: chap.attributes.publishAt,
            language: chap.attributes.translatedLanguage,
          }))
          .sort((a, b) => {
            const chapterA = parseFloat(a.chapter) || 0;
            const chapterB = parseFloat(b.chapter) || 0;
            return chapterA - chapterB;
          });

        const currentIndex = chapters.findIndex(chap => chap.id === id);
        
        if (currentIndex > 0) {
          prevChapter = chapters[currentIndex - 1];
        }
        
        if (currentIndex < chapters.length - 1) {
          nextChapter = chapters[currentIndex + 1];
        }
      }
    }

    return {
      props: {
        initialChapter: {
          id,
          mangaId,
          mangaTitle,
          chapterNumber: chapterInfo.data.attributes.chapter || 'Oneshot',
          language: chapterLanguage,
          images,
          nextChapter,
          prevChapter,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching chapter:', error);
    return { notFound: true };
  }
}