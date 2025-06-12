import { Question, CompanyInsight, TopicAnalysis } from '../types';

export const extractQuestionData = (questionId: string, data: any): Question => {
  
  // Extract title from the first line or use the question ID
  let text = data.text || '';
  const title = extractTitle(text) || questionId.replace(/_\d+$/, '').replace(/-/g, ' ');
  // Extract difficulty
  let difficulty = extractDifficulty(text);
  difficulty = difficulty=="Moderate" ? "Medium" : difficulty
  
  // Extract topics using keyword matching
  const topics = data.topic
  
  // Extract round type
  const roundType = extractRoundType(text);
  
  // Extract sample input/output
  const { sampleInput, sampleOutput, explanation } = extractSampleIO(text);
  
  // Extract description (first 2 sentences)
  const description = extractDescription(text).substring(13);
  let temp = text;
  text = grabBetween(text,"##  Problem statement","##### Sample Input")
  temp = grabBetween(temp,"##  Problem statement","C++ (g++ 5.4)")
  text = (temp.length)<(text.length) ? temp : text
  text = text.substring(13)
  text = "##  Problem statement" + text
  text =text.replace(/\[.*?\]/g);
  const urlPattern = /https?:\/\/[^\s]+/g;
  text= text.replace(urlPattern, '');
  return {
    id: questionId,
    title,
    text,
    companies: data.companies || [],
    difficulty,
    topics,
    roundType,
    frequency: Math.floor(Math.random() * 100) + 1, // Mock frequency
    lastAsked: generateRandomDate(),
    sampleInput,
    sampleOutput,
    explanation,
    description,
    dateAdded: generateRandomDate()
  };
};

const extractTitle = (text: string): string => {
  // Look for title patterns in markdown
  const titleMatch = text.match(/^#\s+(.*?)\s*$/m);
  return titleMatch ? titleMatch[1].trim() : '';
};

const extractDifficulty = (
  text: string
): 'Easy' | 'Moderate' | 'Medium' | 'Hard' | undefined => {
  // Look for one of the four difficulty words, case-sensitive
  const match = text.match(/\b(Easy|Moderate|Medium|Hard)\b/);
  return match ? (match[1] as 'Easy' | 'Moderate' | 'Medium' | 'Hard') : undefined;
};


const extractRoundType = (text: string): 'OA' | 'Technical' | 'HR' | 'Onsite' | undefined => {
  const roundMatch = text.match(/\b(OA|Online Assessment|Technical|HR|Onsite|Phone Screen)\b/i);
  if (roundMatch) {
    const round = roundMatch[1].toLowerCase();
    if (round.includes('oa') || round.includes('online')) return 'OA';
    if (round.includes('technical') || round.includes('phone')) return 'Technical';
    if (round.includes('hr')) return 'HR';
    if (round.includes('onsite')) return 'Onsite';
  }
  return undefined;
};
const grabBetween = (txt: string, start: string, end: string): string => {
  const parts = txt.split(start);
  if (parts.length < 2) return "";
  const afterStart = parts[1];
  return afterStart.split(end)[0].trim();
};


const extractSampleIO = (text: string): { sampleInput?: string; sampleOutput?: string; explanation?: string } => {
  let exampleInput = "";
  if (text.includes("##### Sample Input")) {
    exampleInput = grabBetween(
      text,
      "##### Sample Input 1",
      "##### Sample Output"
    );
  }
  let exampleOutput = "";
  if (text.includes("##### Sample Output")) {
    exampleOutput = grabBetween(
      text,
      "##### Sample Output 1",
      "##### Explanation"
    );
  }
  let explanation1 = "";
  if (text.includes("##### Explanation")) {
    explanation1 = grabBetween(
      text,
      "##### Explanation",
      "##### Sample Input 2"
    );
  }
  let explanation2 = "";
  if (text.includes("##### Explanation")) {
    explanation2 = grabBetween(
      text,
      "##### Explanation",
      "C++ (g++ 5.4)"
    );
  }
  let explanation =""
  if(explanation1.length< explanation2.length){
    explanation = explanation1
  }
  else{
    explanation = explanation2
  }
  
  return {
    sampleInput: exampleInput ? exampleInput : undefined,
    sampleOutput: exampleOutput ? exampleOutput : undefined,
    explanation: explanation ? explanation : undefined
  };
};

const extractDescription = (text: string): string => {
  return grabBetween(text, "##  Problem statement", "Detailed explanation");
};
const formatTitle = (title: string): string => {
  return title.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const generateRandomDate = (): string => {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

export const generateCompanyInsights = (questions: Question[]): CompanyInsight[] => {
  const companyMap = new Map<string, Question[]>();
  
  questions.forEach(question => {
    question.companies.forEach(company => {
      if (!companyMap.has(company)) {
        companyMap.set(company, []);
      }
      companyMap.get(company)!.push(question);
    });
  });
  
  return Array.from(companyMap.entries()).map(([company, companyQuestions]) => {
    const topicDistribution: Record<string, number> = {};
    const difficultyDistribution: Record<string, number> = {};
    
    companyQuestions.forEach(question => {
      question.topics?.forEach(topic => {
        topicDistribution[topic] = (topicDistribution[topic] || 0) + 1;
      });
      
      if (question.difficulty) {
        difficultyDistribution[question.difficulty] = 
          (difficultyDistribution[question.difficulty] || 0) + 1;
      }
    });
    
    const topQuestions = companyQuestions
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
      .slice(0, 5);
    
    return {
      company,
      totalQuestions: companyQuestions.length,
      topicDistribution,
      difficultyDistribution,
      topQuestions
    };
  }).sort((a, b) => b.totalQuestions - a.totalQuestions);
};

export const generateTopicAnalysis = (questions: Question[]): TopicAnalysis[] => {
  const topicMap = new Map<string, { questions: Question[]; companies: Set<string> }>();
  
  questions.forEach(question => {
    question.topics?.forEach(topic => {
      if (!topicMap.has(topic)) {
        topicMap.set(topic, { questions: [], companies: new Set() });
      }
      topicMap.get(topic)!.questions.push(question);
      question.companies.forEach(company => {
        topicMap.get(topic)!.companies.add(company);
      });
    });
  });
  
  const totalQuestions = questions.length;
  
  return Array.from(topicMap.entries()).map(([topic, data]) => {
    const count = data.questions.length;
    const percentage = (count / totalQuestions) * 100;
    
    const difficulties = data.questions
      .map(q => q.difficulty)
      .filter(Boolean);
    const avgDifficulty = getMostCommonDifficulty(difficulties);
    
    return {
      topic,
      count,
      percentage,
      companies: Array.from(data.companies),
      avgDifficulty,
      recentTrend: getRandomTrend()
    };
  }).sort((a, b) => b.count - a.count);
};

const getMostCommonDifficulty = (difficulties: string[]): string => {
  if (difficulties.length === 0) return 'Medium';
  
  const counts = difficulties.reduce((acc, diff) => {
    acc[diff] = (acc[diff] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)[0][0];
};

const getRandomTrend = (): 'up' | 'down' | 'stable' => {
  const trends = ['up', 'down', 'stable'] as const;
  return trends[Math.floor(Math.random() * trends.length)];
};