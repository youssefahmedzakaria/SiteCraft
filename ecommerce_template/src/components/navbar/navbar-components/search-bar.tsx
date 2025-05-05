import React from 'react';
import { Search } from 'lucide-react';

export interface SearchBarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  placeholder?: string;
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  expanded,
  setExpanded,
  placeholder = 'Search...',
  iconColor = 'text-gray-300',
  backgroundColor = 'bg-white/20',
  textColor = 'text-white'
}) => {
  return expanded ? (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        autoFocus
        className={`pl-8 pr-4 py-1.5 text-sm ${backgroundColor} rounded-[15px] w-40 focus:outline-none focus:ring-1 focus:ring-white/50 ${textColor}`}
        onBlur={() => setExpanded(false)}
      />
      <Search className={`absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 ${iconColor}`} />
    </div>
  ) : (
    <button
      onClick={() => setExpanded(true)}
      className="p-1 hover:opacity-80"
    >
      <Search className={`h-5 w-5 ${iconColor}`} />
    </button>
  );
};