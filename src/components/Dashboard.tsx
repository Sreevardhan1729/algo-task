import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, Download, FileText, Share2, Settings } from 'lucide-react';
import Sidebar from './Sidebar';
import FilterPanel from './FilterPanel';
import QuestionsTable from './QuestionsTable';
import QuestionModal from './QuestionModal';
import CompanyInsights from './CompanyInsights';
import TopicAnalysis from './TopicAnalysis';
import { Question, FilterState } from '../types';
import { extractQuestionData, generateCompanyInsights, generateTopicAnalysis } from '../utils/dataProcessor';
import { mockQuestionsData } from '../data/mockData';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('questions');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    companies: [],
    topics: [],
    difficulties: [],
    roundTypes: [],
    recency: ''
  });

  // Load and process questions data
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        // Process mock data (in real app, this would be an API call)
        const processedQuestions = Object.entries(mockQuestionsData).map(([id, data]) =>
          extractQuestionData(id, data)
        );
        setQuestions(processedQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Generate insights and analysis
  const companyInsights = useMemo(() => 
    generateCompanyInsights(questions), [questions]
  );
  
  const topicAnalysis = useMemo(() => 
    generateTopicAnalysis(questions), [questions]
  );

  // Get unique values for filters
  const availableCompanies = useMemo(() => 
    [...new Set(questions.flatMap(q => q.companies))].sort(), [questions]
  );
  
  const availableTopics = useMemo(() => 
    [...new Set(questions.flatMap(q => q.topics || []))].sort(), [questions]
  );

  const handleQuestionClick = (question: Question) => {
    setSelectedQuestion(question);
    setModalOpen(true);
  };

  const handleExport = (format: 'csv' | 'json') => {
    const dataStr = format === 'csv' 
      ? convertToCSV(questions)
      : JSON.stringify(questions, null, 2);
    
    const dataBlob = new Blob([dataStr], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-questions.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: Question[]) => {
    const headers = ['Title', 'Difficulty', 'Topics', 'Companies', 'Round Type', 'Frequency', 'Last Asked'];
    const rows = data.map(q => [
      q.title,
      q.difficulty || '',
      q.topics?.join('; ') || '',
      q.companies.join('; '),
      q.roundType || '',
      q.frequency?.toString() || '',
      q.lastAsked || ''
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
  };

  const renderMainContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'questions':
        return (
          <QuestionsTable
            questions={questions}
            filters={filters}
            onQuestionClick={handleQuestionClick}
          />
        );
      case 'company-insights':
        return <CompanyInsights insights={companyInsights} />;
      case 'topic-analysis':
        return <TopicAnalysis analysis={topicAnalysis} />;
      case 'recent-trends':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Trends</h2>
            <p className="text-gray-600">Recent trends analysis coming soon...</p>
          </div>
        );
      case 'hot-topics':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hot Topics</h2>
            <p className="text-gray-600">Hot topics analysis coming soon...</p>
          </div>
        );
      case 'false-positives':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">False Positives</h2>
            <p className="text-gray-600">False positives analysis coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {activeTab === 'questions' && 'All Questions'}
                  {activeTab === 'company-insights' && 'Company Insights'}
                  {activeTab === 'topic-analysis' && 'Topic Analysis'}
                  {activeTab === 'recent-trends' && 'Recent Trends'}
                  {activeTab === 'hot-topics' && 'Hot Topics'}
                  {activeTab === 'false-positives' && 'False Positives'}
                </h1>
                <p className="text-sm text-gray-500">
                  Analyze and prepare for coding interviews
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  JSON
                </button>
              </div>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Filters - Only show for questions tab */}
        {activeTab === 'questions' && (
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            availableCompanies={availableCompanies}
            availableTopics={availableTopics}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
        )}

        {/* Content */}
        <main className="flex-1 p-6">
          {renderMainContent()}
        </main>
      </div>

      {/* Question Modal */}
      <QuestionModal
        question={selectedQuestion}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;