import React, { useState } from 'react';
import { Search } from 'lucide-react';

export interface FullSearchBarProps {
  placeholder?: string;
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
  onSearch?: (query: string) => void;
}

export const FullSearchBar: React.FC<FullSearchBarProps> = ({
  placeholder = 'Search...',
  iconColor = 'text-gray-300',
  backgroundColor = 'bg-white/20',
  textColor = 'text-white',
  className = '',
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-1.5 text-sm ${backgroundColor} rounded-[15px] placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-white ${textColor}`}
      />
      <button 
        type="submit"
        className="absolute left-3 top-1/2 transform -translate-y-1/2"
      >
        <Search className={`h-4 w-4 ${iconColor}`} />
      </button>
    </form>
  );
};
