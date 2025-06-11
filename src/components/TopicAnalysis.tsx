import React from 'react';
import { 
  Tag, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Building,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { TopicAnalysis as TopicAnalysisType } from '../types';

interface TopicAnalysisProps {
  analysis: TopicAnalysisType[];
}

const TopicAnalysis: React.FC<TopicAnalysisProps> = ({ analysis }) => {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-50 border-green-200';
      case 'down': return 'text-red-600 bg-red-50 border-red-200';
      case 'stable': return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getBarWidth = (percentage: number, maxPercentage: number) => {
    return Math.max((percentage / maxPercentage) * 100, 2);
  };

  const maxPercentage = Math.max(...analysis.map(item => item.percentage));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <BarChart3 className="w-6 h-6 mr-3 text-indigo-600" />
          Topic Analysis
        </h2>
        <div className="text-sm text-gray-500">
          {analysis.length} topics identified
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100 text-sm">Most Popular</p>
              <p className="text-lg font-bold">{analysis[0]?.topic || 'N/A'}</p>
            </div>
            <Tag className="w-6 h-6 text-indigo-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Trending Up</p>
              <p className="text-lg font-bold">
                {analysis.filter(item => item.recentTrend === 'up').length}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Questions</p>
              <p className="text-lg font-bold">
                {analysis.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <PieChart className="w-6 h-6 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Avg per Topic</p>
              <p className="text-lg font-bold">
                {Math.round(analysis.reduce((sum, item) => sum + item.count, 0) / analysis.length) || 0}
              </p>
            </div>
            <Target className="w-6 h-6 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Topic Breakdown</h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {analysis.map((item, index) => (
              <div key={item.topic} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <h4 className="font-semibold text-gray-900 flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                      {item.topic}
                    </h4>
 
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.avgDifficulty)}`}>
                      Avg: {item.avgDifficulty}
                    </span>
                    <span className="text-sm text-gray-600">
                      {item.count} questions ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${getBarWidth(item.percentage, maxPercentage)}%` }}
                  />
                </div>

                {/* Companies */}
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Companies:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.companies.slice(0, 5).map(company => (
                      <span
                        key={company}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                      >
                        {company}
                      </span>
                    ))}
                    {item.companies.length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                        +{item.companies.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Topic Distribution</h3>
        <div className="relative">
          <svg viewBox="0 0 400 200" className="w-full h-48">
            {analysis.slice(0, 10).map((item, index) => {
              const barHeight = (item.percentage / maxPercentage) * 160;
              const x = index * 40 + 20;
              const y = 180 - barHeight;
              
              return (
                <g key={item.topic}>
                  <rect
                    x={x - 15}
                    y={y}
                    width={30}
                    height={barHeight}
                    fill={`url(#gradient-${index})`}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                  <text
                    x={x}
                    y={195}
                    textAnchor="middle"
                    className="fill-gray-600 text-xs"
                    transform={`rotate(-45, ${x}, 195)`}
                  >
                    {item.topic.length > 8 ? item.topic.substring(0, 8) + '...' : item.topic}
                  </text>
                  <text
                    x={x}
                    y={y - 5}
                    textAnchor="middle"
                    className="fill-gray-800 text-xs font-medium"
                  >
                    {item.count}
                  </text>
                </g>
              );
            })}
            
            {/* Gradients */}
            <defs>
              {analysis.slice(0, 10).map((_, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={`hsl(${220 + index * 20}, 70%, 60%)`} />
                  <stop offset="100%" stopColor={`hsl(${220 + index * 20}, 70%, 40%)`} />
                </linearGradient>
              ))}
            </defs>
          </svg>
        </div>
      </div>

      {analysis.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Topic Data</h3>
          <p className="text-gray-500">
            Topic analysis will appear once questions are loaded and processed.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopicAnalysis;