import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { useEffect, useState } from 'react';

export default function ToggleDarkMode({ isDark, toggleDarkMode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        className="p-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-colors duration-200" 
        aria-label="Loading theme toggle" 
      />
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      className="cursor-pointer p-2.5 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--bg-card)] hover:shadow-sm active:scale-95"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <SunIcon className="h-5 w-5 text-white" />
      ) : (
        <MoonIcon className="h-5 w-5 text-black" />
      )}
    </button>
  );
}