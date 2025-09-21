import Link from 'next/link';
import FavoriteButton from './FavoriteButton';

export default function Card({ manga, isFavorite, onToggleFavorite }) {
  return (
    <div className="card card-hover">
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
        <FavoriteButton
          manga={manga}
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
        />
      </div>

      <Link href={`/manga/${manga.id}`} className="block">
        <div className="relative w-full h-64 overflow-hidden">
          <img
            src={manga.coverUrl}
            alt={manga.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x400?text=No+Cover';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <div className="p-4 h-28 flex flex-col justify-between">
          <h3 className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--color-primary)] transition-colors duration-200 min-h-[2.5rem] truncate-2">
            {manga.title}
          </h3>

          <div className="flex flex-wrap gap-1 mt-2">
            {manga.status && (
              <span className={
                manga.status === 'ongoing' 
                  ? 'badge-ongoing' 
                  : 'badge-completed'
              }>
                {manga.status === 'ongoing' ? 'ONGOING' : 'COMPLETED'}
              </span>
            )}
            {manga.year && (
              <span className="badge-year">
                {manga.year}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}