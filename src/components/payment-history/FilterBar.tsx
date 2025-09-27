
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

interface FilterBarProps {
  filterPeriod: string;
  setFilterPeriod: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filterPeriod, setFilterPeriod }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1">
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <div className="relative">
          <Input placeholder="Rechercher..." />
          <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
     
    </div>
  );
};

export default FilterBar;
