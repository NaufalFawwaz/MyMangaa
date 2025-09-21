import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import * as mangadex from '@/lib/mangadex';

export default function SearchBar({ value, onChange, placeholder = "Cari manga..." }) {
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const searchValue = value || '';
    
    if (searchValue.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults(searchValue);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSearchResults = async (query) => {
    setIsLoading(true);
    try {
      const result = await mangadex.searchManga({
        query: query,
        limit: 5,
        offset: 0
      });
      setSearchResults(result.mangaList || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
  };

  const handleResultClick = (manga) => {
    window.location.href = `/manga/${manga.id}`;
  };

  const safeValue = value || '';

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={safeValue}
          onChange={handleInputChange}
          onFocus={() => safeValue.trim().length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--bg-secondary)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all duration-200 shadow-sm"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-[var(--text-muted)]" />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--color-primary)]"></div>
          </div>
        )}
      </div>

      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--bg-card)] border border-[var(--bg-secondary)] rounded-lg shadow-lg max-h-96 overflow-y-auto transition-all duration-200">
          <div className="py-2">
            {searchResults.map((manga) => (
              <div
                key={manga.id}
                onClick={() => handleResultClick(manga)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors duration-200"
              >
                <div className="w-12 h-16 flex-shrink-0">
                  <img
                    src={manga.coverUrl}
                    alt={manga.title}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100x150?text=No+Cover';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[var(--text-primary)] text-sm truncate">
                    {manga.title}
                  </h4>
                  {manga.year && (
                    <p className="text-xs text-[var(--text-muted)]">
                      {manga.year} • {manga.status || 'Unknown'}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {searchResults.length > 0 && (
              <div className="px-4 py-2 border-t border-[var(--bg-secondary)]">
                <p className="text-xs text-[var(--text-muted)] text-center">
                  {searchResults.length} hasil ditemukan
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {showDropdown && searchResults.length === 0 && safeValue.trim().length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--bg-card)] border border-[var(--bg-secondary)] rounded-lg shadow-lg transition-all duration-200">
          <div className="py-4 px-4 text-center">
            <p className="text-[var(--text-muted)] text-sm">
              Tidak ada manga ditemukan untuk "{safeValue}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}