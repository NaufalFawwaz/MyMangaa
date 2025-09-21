import * as mangadex from '@/lib/mangadex';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q: query = '', page = '1', limit = '20' } = req.query;
    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (parsedPage - 1) * parsedLimit;

    const result = await mangadex.searchManga({
      query,
      offset,
      limit: parsedLimit,
    });

    const totalPages = Math.ceil((result.total || 0) / parsedLimit);

    res.status(200).json({
      mangaList: result.mangaList,
      currentPage: parsedPage,
      totalPages,
      totalItems: result.total || 0,
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to fetch manga data',
      details: error.message,
      mangaList: [],
      currentPage: 1,
      totalPages: 1
    });
  }
}