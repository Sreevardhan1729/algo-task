import React, { useState, useMemo } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  Calendar,
  TrendingUp,
  Building,
  Tag,
  Clock
} from 'lucide-react';
import { Question, FilterState } from '../types';

interface QuestionsTableProps {
  questions: Question[];
  filters: FilterState;
  onQuestionClick: (question: Question) => void;
}

type SortField = 'title' | 'difficulty' | 'frequency' | 'lastAsked' | 'companies';
type SortDirection = 'asc' | 'desc';

const QuestionsTable: React.FC<QuestionsTableProps> = ({ 
  questions, 
  filters, 
  onQuestionClick 
}) => {
  const [sortField, setSortField] = useState<SortField>('frequency');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = questions.filter(question => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchMatch = 
          question.title.toLowerCase().includes(searchLower) ||
          question.description?.toLowerCase().includes(searchLower) ||
          question.text.toLowerCase().includes(searchLower);
        if (!searchMatch) return false;
      }

      // Company filter
      if (filters.companies.length > 0) {
        const hasCompany = filters.companies.some(company => 
          question.companies.includes(company)
        );
        if (!hasCompany) return false;
      }

      // Topic filter
      if (filters.topics.length > 0) {
        const hasTopic = filters.topics.some(topic => 
          question.topics?.includes(topic)
        );
        if (!hasTopic) return false;
      }

      // Difficulty filter
      if (filters.difficulties.length > 0) {
        if (!question.difficulty || !filters.difficulties.includes(question.difficulty)) {
          return false;
        }
      }



      // Recency filter
      if (filters.recency) {
        const daysAgo = parseInt(filters.recency);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        
        if (question.lastAsked) {
          const lastAskedDate = new Date(question.lastAsked);
          if (lastAskedDate < cutoffDate) return false;
        }
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          const aDiff = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0;
          const bDiff = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0;
          comparison = aDiff - bDiff;
          break;
        case 'frequency':
          comparison = (a.frequency || 0) - (b.frequency || 0);
          break;
        case 'lastAsked':
          const aDate = a.lastAsked ? new Date(a.lastAsked).getTime() : 0;
          const bDate = b.lastAsked ? new Date(b.lastAsked).getTime() : 0;
          comparison = aDate - bDate;
          break;
        case 'companies':
          comparison = a.companies.length - b.companies.length;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [questions, filters, sortField, sortDirection]);

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoundTypeColor = (roundType?: string) => {
    switch (roundType) {
      case 'OA': return 'bg-blue-100 text-blue-700';
      case 'Technical': return 'bg-purple-100 text-purple-700';
      case 'HR': return 'bg-green-100 text-green-700';
      case 'Onsite': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ 
    field, 
    children 
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-gray-700 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
    >
      <span>{children}</span>
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp className="w-4 h-4" /> : 
          <ChevronDown className="w-4 h-4" />
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Questions ({filteredAndSortedQuestions.length})
          </h3>
          <div className="text-sm text-gray-500">
            Showing {filteredAndSortedQuestions.length} of {questions.length} questions
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-6">
                <SortButton field="title">Title</SortButton>
              </th>
              <th className="text-left py-3 px-4">
                <SortButton field="difficulty">Difficulty</SortButton>
              </th>
              <th className="text-left py-3 px-4">Topics</th>
              <th className="text-left py-3 px-4">
                <SortButton field="companies">Companies</SortButton>
              </th>
              
              <th className="text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedQuestions.map((question) => (
              <tr 
                key={question.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onQuestionClick(question)}
              >
                <td className="py-4 px-6">
                  <div className="flex flex-col">
                    <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {question.title}
                    </h4>
                    {question.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {question.description}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  {question.difficulty && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                  )}
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {question.topics?.slice(0, 2).map(topic => (
                      <span
                        key={topic}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium flex items-center"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {topic}
                      </span>
                    ))}
                    {question.topics && question.topics.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{question.topics.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-wrap gap-1">
                    {question.companies.slice(0, 2).map(company => (
                      <span
                        key={company}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center"
                      >
                        <Building className="w-3 h-3 mr-1" />
                        {company}
                      </span>
                    ))}
                    {question.companies.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{question.companies.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuestionClick(question);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedQuestions.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Clock className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms to find more questions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsTable;