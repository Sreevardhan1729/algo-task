import React from 'react';
import { 
  Building2, 
  TrendingUp, 
  Star, 
  BarChart3,
  Users,
  Target,
  Award
} from 'lucide-react';
import { CompanyInsight } from '../types';

interface CompanyInsightsProps {
  insights: CompanyInsight[];
}

const CompanyInsights: React.FC<CompanyInsightsProps> = ({ insights }) => {
  const getTopicColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    return colors[index % colors.length];
  };
  const colorMap: Record<string, string> = {
    'bg-red-500': '#DC143C',
  'bg-blue-500': '#3B82F6',
  'bg-green-500': '#10B981',
  'bg-purple-500': '#8B5CF6',
  'bg-orange-500': '#F97316',
  'bg-indigo-500': '#6366F1',
  'bg-pink-500': '#EC4899',
  'bg-teal-500': '#14B8A6',
  'bg-yellow-500': '#F59E0B',
  'bg-gray-500': '#6B7280',
};

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderPieChart = (distribution: Record<string, number>, getColor: (key: string, index: number) => string) => {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    if (total === 0) return null;
    
    const entries = Object.entries(distribution).sort(([, a], [, b]) => b - a);
    let currentAngle = 0;
    
    return (
      <div className="relative">
        <svg viewBox="0 0 100 100" className="w-32 h-32">
          {entries.map(([key, count], index) => {
            const percentage = count / total;
            const angle = percentage * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
            
            const largeArc = angle > 180 ? 1 : 0;
            const pathData = [
              `M 50 50`,
              `L ${x1} ${y1}`,
              `A 40 40 0 ${largeArc} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={key}
                d={pathData}
                fill={colorMap[getColor(key, index)] || '#000000'}
                className={`${getColor(key, index).replace('bg-', 'text-')} opacity-80 hover:opacity-100 transition-opacity`}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{total}</div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
        </div>
      </div>
    );
  };

  const renderLegend = (distribution: Record<string, number>, getColor: (key: string, index: number) => string) => {
    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    const entries = Object.entries(distribution).sort(([, a], [, b]) => b - a);
    
    return (
      <div className="space-y-2">
        {entries.map(([key, count], index) => {
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getColor(key, index)}`} />
                <span className="text-sm text-gray-700">{key}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {count} ({percentage}%)
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Building2 className="w-6 h-6 mr-3 text-blue-600" />
          Company Insights
        </h2>
        <div className="text-sm text-gray-500">
          {insights.length} companies analyzed
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Top Company</h3>
              <p className="text-2xl font-bold">{insights[0]?.company || 'N/A'}</p>
              <p className="text-blue-100">{insights[0]?.totalQuestions || 0} questions</p>
            </div>
            <Award className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total Questions</h3>
              <p className="text-2xl font-bold">
                {insights.reduce((sum, insight) => sum + insight.totalQuestions, 0)}
              </p>
              <p className="text-green-100">Across all companies</p>
            </div>
            <Target className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Avg per Company</h3>
              <p className="text-2xl font-bold">
                {Math.round(insights.reduce((sum, insight) => sum + insight.totalQuestions, 0) / insights.length) || 0}
              </p>
              <p className="text-purple-100">Questions per company</p>
            </div>
            <Users className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Company Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <div key={insight.company} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{insight.company}</h3>
                  <p className="text-sm text-gray-500">{insight.totalQuestions} questions</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4" />
                <span>#{index + 1}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Topic Distribution */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Topic Distribution
                </h4>
                <div className="flex items-start space-x-4">
                  {renderPieChart(insight.topicDistribution, (key, idx) => getTopicColor(idx))}
                  <div className="flex-1">
                    {renderLegend(insight.topicDistribution, (key, idx) => getTopicColor(idx))}
                  </div>
                </div>
              </div>

              {/* Difficulty Distribution */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Difficulty Distribution
                </h4>
                <div className="flex items-start space-x-4">
                  {renderPieChart(insight.difficultyDistribution, (key) => getDifficultyColor(key))}
                  <div className="flex-1">
                    {renderLegend(insight.difficultyDistribution, (key) => getDifficultyColor(key))}
                  </div>
                </div>
              </div>
            </div>

            {/* Top Questions */}
            
          </div>
        ))}
      </div>

      {insights.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Company Data</h3>
          <p className="text-gray-500">
            Company insights will appear once questions are loaded and analyzed.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompanyInsights;