const API_BASE = 'https://api.mangadex.org';

export async function searchManga({ query = '', offset = 0, limit = 20 }) {
  try {
    const params = new URLSearchParams();

    params.append('limit', Math.min(100, Math.max(1, limit)).toString());
    params.append('offset', Math.max(0, offset).toString());
    params.append('includes[]', 'cover_art');

    params.append('contentRating[]', 'safe');
    params.append('contentRating[]', 'suggestive');

    if (query) {
      params.append('order[relevance]', 'desc');
    } else {
      params.append('order[latestUploadedChapter]', 'desc');
    }

    params.append('availableTranslatedLanguage[]', 'en');
    params.append('availableTranslatedLanguage[]', 'id');
    params.append('availableTranslatedLanguage[]', 'ja');

    if (query) {
      params.append('title', query);
    }

    const url = `${API_BASE}/manga?${params.toString()}`;

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) throw new Error(`API Error: ${res.status}`);

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) return { mangaList: [], total: 0, offset, limit };

    const mangaList = data.data.map(item => {
      const title = item.attributes.title.en || Object.values(item.attributes.title)[0] || 'Untitled';
      const description = item.attributes.description?.en || '';

      let coverUrl = '/placeholder-cover.jpg';
      const coverArt = item.relationships?.find(rel => rel.type === 'cover_art');
      if (coverArt?.attributes?.fileName) {
        coverUrl = `https://uploads.mangadex.org/covers/${item.id}/${coverArt.attributes.fileName}.512.jpg`;
      }

      return {
        id: item.id,
        title,
        coverUrl,
        description,
        status: item.attributes.status,
        year: item.attributes.year,
      };
    });

    return {
      mangaList,
      total: data.total || 0,
      offset: parseInt(offset),
      limit: parseInt(limit),
    };
  } catch (error) {
    console.error('Error fetching manga:', error);
    throw new Error(`Failed to fetch manga: ${error.message}`);
  }
}

export async function getChapters(mangaId, language = 'en') {
  try {
    const params = new URLSearchParams();
    params.append('limit', '100');
    params.append('order[chapter]', 'asc');
    params.append('includes[]', 'scanlation_group');
    params.append('translatedLanguage[]', language);
    params.append('includeFuturePublishAt', '0');

    const url = `${API_BASE}/manga/${mangaId}/feed?${params.toString()}`;

    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) throw new Error(`Chapter API Error: ${res.status}`);

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) return [];

    return data.data.map(chapter => ({
      id: chapter.id,
      chapter: chapter.attributes.chapter || 'Oneshot',
      title: chapter.attributes.title || '',
      publishAt: chapter.attributes.publishAt,
      language: chapter.attributes.translatedLanguage,
      scanlationGroups: chapter.relationships
        ?.filter(rel => rel.type === 'scanlation_group')
        ?.map(rel => rel.attributes?.name) || [],
    }));
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

export async function getChaptersByLanguages(mangaId, languages = ['en', 'id', 'ja']) {
  try {
    const chaptersByLanguage = {};

    for (const lang of languages) {
      const chapters = await getChapters(mangaId, lang);
      chaptersByLanguage[lang] = chapters;
    }
    
    return chaptersByLanguage;
  } catch (error) {
    console.error('Error fetching chapters by languages:', error);
    return {};
  }
}