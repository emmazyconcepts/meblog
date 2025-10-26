import { useState, useEffect } from "react";

export default function SearchBar({ onSearch = () => {} }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isActive, setIsActive] = useState(false);

  // Debounce search to avoid too many requests
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="relative w-full text-amber-50">
      <div className="relative">
        <input
          type="text"
          placeholder="Search safety guides..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setTimeout(() => setIsActive(false), 200)}
          className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-white placeholder-white"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick search tips */}
      {isActive && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-2 p-4">
          <p className="text-sm text-gray-600 mb-2">Try searching for:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "safety",
              "legal",
              "health",
              "business",
              "technology",
              "rights",
              "tips",
            ].map((term) => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
