import React from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  X, 
  Building, 
  Tag, 
  Clock, 
  TrendingUp, 
  Calendar,
  Copy,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { Question } from '../types';

interface QuestionModalProps {
  question: Question | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({ question, isOpen, onClose }) => {
  if (!isOpen || !question) return null;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoundTypeColor = (roundType?: string) => {
    switch (roundType) {
      case 'OA': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Technical': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'HR': return 'bg-green-100 text-green-700 border-green-200';
      case 'Onsite': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const renderMarkdown = (text: string) => {
    // Simple markdown rendering for headers, bold, code blocks
    let html = text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-gray-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-gray-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code class="text-sm">$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">$1</code>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');
    
    return `<p class="mb-4">${html}</p>`;
  };

  return (
    <div className="fixed w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white  rounded-xl shadow-2xl mx-44 w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{question.title}</h2>
              <div className="flex flex-wrap items-center gap-3">
                {question.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                )}
                {question.roundType && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoundTypeColor(question.roundType)}`}>
                    {question.roundType}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-120px)]">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Problem Statement */}
              <div className="prose max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(question.text) }}
                  className="text-gray-800 leading-relaxed"
                />
              </div>

              {/* Sample Input/Output */}
              {(question.sampleInput || question.sampleOutput) && (
                <div className="mt-8 space-y-4">
                  {question.sampleInput && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-900">Sample Input</h4>
                        <button
                          onClick={() => copyToClipboard(question.sampleInput!)}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-sm text-blue-800 whitespace-pre-wrap font-mono">
                        {question.sampleInput}
                      </pre>
                    </div>
                  )}

                  {question.sampleOutput && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-green-900">Sample Output</h4>
                        <button
                          onClick={() => copyToClipboard(question.sampleOutput!)}
                          className="p-1 text-green-600 hover:text-green-800 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <pre className="text-sm text-green-800 whitespace-pre-wrap font-mono">
                        {question.sampleOutput}
                      </pre>
                    </div>
                  )}
                 {question.explanation && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-yellow-900">Explanation</h4>
                      <button
                        onClick={() => copyToClipboard(question.explanation!)}
                        className="p-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-yellow-800 whitespace-pre-wrap">
                      {question.explanation}
                    </div>
                  </div>
                )} 
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Companies */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Companies ({question.companies.length})
                </h4>
                <div className="space-y-2">
                  {question.companies.map(company => (
                    <div key={company} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                      <span className="text-sm font-medium text-gray-800">{company}</span>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Topics */}
              {question.topics && question.topics.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Topics ({question.topics.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {question.topics.map(topic => (
                      <span
                        key={topic}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Metadata
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Question ID</span>
                    <span className="text-sm font-mono text-gray-900">
                      {question.id.slice(0, 12)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Practice Now
                </button>
                <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Add to Favorites
                </button>
                <button 
                  onClick={() => copyToClipboard(window.location.href)}
                  className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Share Question
                </button>
              </div>

              {/* Tips */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <AlertCircle className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="text-sm font-medium text-yellow-800">Pro Tip</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Focus on understanding the problem constraints and edge cases before coding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionModal;