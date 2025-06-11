import React from 'react';
import { 
  BookOpen, 
  Building2, 
  BarChart3, 
  Filter,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'questions', label: 'All Questions', icon: BookOpen, count: null },
    { id: 'company-insights', label: 'Company Insights', icon: Building2, count: null },
    { id: 'topic-analysis', label: 'Topic Analysis', icon: BarChart3, count: null },
    { id: 'recent-trends', label: 'Recent Trends', icon: TrendingUp, count: 'New' },
    { id: 'hot-topics', label: 'Hot Topics', icon: Clock, count: null },
    { id: 'false-positives', label: 'False Positives', icon: AlertTriangle, count: null },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CodePrep</h1>
            <p className="text-sm text-gray-500">Interview Dashboard</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.count && (
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Pro Tip</span>
          </div>
          <p className="text-xs text-gray-600">
            Use filters to narrow down questions by company, topic, or difficulty level.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;