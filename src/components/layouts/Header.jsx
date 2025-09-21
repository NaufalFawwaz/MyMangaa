import SearchBar from '../ui/SearchBar';
import ToggleDarkMode from '@/components/ui/ToggleDarkMode';
import Link from 'next/link';

export default function Header({ searchQuery, onSearch, isDark, toggleDarkMode }) {
  return (
    <header className="sticky top-0 z-50 bg-[var(--bg-primary)] shadow-lg border-b border-[var(--bg-secondary)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--bg-primary)]/90 transition-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link 
            href="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-200">
              <span className="text-white font-bold text-sm">MM</span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text transition-all duration-200">
              MyMangaa
            </h1>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:block w-80">
              <SearchBar 
                value={searchQuery} 
                onChange={onSearch}
              />
            </div>
            <ToggleDarkMode isDark={isDark} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>

        <div className="sm:hidden py-3">
          <SearchBar 
            value={searchQuery} 
            onChange={onSearch}
          />
        </div>
      </div>
    </header>
  );
}