import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { FilterState } from '../types';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableCompanies: string[];
  availableTopics: string[];
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  availableCompanies,
  availableTopics,
  isOpen,
  onToggle
}) => {
  const difficulties = ['Easy', 'Medium', 'Hard'];


  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'companies' | 'topics' | 'difficulties', value: string) => {
    const currentArray = filters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      companies: [],
      topics: [],
      difficulties: [],
      roundTypes: [],
      recency: ''
    });
  };

  const hasActiveFilters = filters.search || 
    filters.companies.length > 0 || 
    filters.topics.length > 0 || 
    filters.difficulties.length > 0 || 
    filters.roundTypes.length > 0 || 
    filters.recency;

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={onToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className={`px-6 pb-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Questions
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search by title, description, or content..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {/* Companies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Companies ({filters.companies.length})
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableCompanies.map(company => (
                <label key={company} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.companies.includes(company)}
                    onChange={() => toggleArrayFilter('companies', company)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{company}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topics ({filters.topics.length})
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {availableTopics.map(topic => (
                <label key={topic} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.topics.includes(topic)}
                    onChange={() => toggleArrayFilter('topics', topic)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty ({filters.difficulties.length})
            </label>
            <div className="space-y-2">
              {difficulties.map(difficulty => (
                <label key={difficulty} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.difficulties.includes(difficulty)}
                    onChange={() => toggleArrayFilter('difficulties', difficulty)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`ml-2 text-sm font-medium ${
                    difficulty === 'Easy' ? 'text-green-600' :
                    difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {difficulty}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;