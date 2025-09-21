import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function FavoriteButton({ manga, isFavorite, onToggle }) {
  return (
    <button
      onClick={() => onToggle(manga)}
      className={`p-2 rounded-full ${
        isFavorite
          ? 'text-red-500 bg-red-100 dark:bg-red-900'
          : 'text-gray-500 bg-gray-100 dark:bg-gray-800'
      }`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <FaHeart className="h-5 w-5" />
      ) : (
        <FaRegHeart className="h-5 w-5" />
      )}
    </button>
  );
}