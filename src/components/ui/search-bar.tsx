
import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Rechercher...",
  onSearch,
  delay = 300,
  className,
}) => {
  const [query, setQuery] = useState<string>("");
  
  // Simple debounce implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [query, delay, onSearch]);
  
  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
      <Input 
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`pl-9 ${className}`}
      />
    </div>
  );
};

export default SearchBar;
