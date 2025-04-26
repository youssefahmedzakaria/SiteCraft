import React from 'react';
import { Search } from 'lucide-react';

export interface FullSearchBarProps {
  placeholder?: string;
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

export const FullSearchBar: React.FC<FullSearchBarProps> = ({
  placeholder = 'Search...',
  iconColor = 'text-gray-300',
  backgroundColor = 'bg-white/20',
  textColor = 'text-white',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-1.5 text-sm ${backgroundColor} rounded-[15px] placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-white ${textColor}`}
      />
      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${iconColor}`} />
    </div>
  );
};
