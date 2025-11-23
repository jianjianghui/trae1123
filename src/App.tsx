import { useState } from 'react';
import { Toaster } from 'sonner';
import { MBTIType, MBTIResult } from './types/mbti';
import { ParsedTask } from './types/task';
import MBTITest from './components/mbti/MBTITest';
import MBTIResultComponent from './components/mbti/MBTIResult';
import AITaskParser from './components/tasks/AITaskParser';
import PomodoroTimer from './components/timer/PomodoroTimer';
import TaskManager from './components/tasks/TaskManager';
import { Brain, Target, Clock, CheckSquare, User } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState<'test' | 'result' | 'dashboard'>('test');
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'parser'>('timer');

  const handleTestComplete = (result: MBTIResult) => {
    setMbtiResult(result);
    setCurrentStep('result');
  };

  const handleContinueToDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handleTaskParsed = (task: ParsedTask) => {
    console.log('任务已解析:', task);
  };

  if (currentStep === 'test') {
    return <MBTITest onComplete={handleTestComplete} />;
  }

  if (currentStep === 'result') {
    return (
      <MBTIResultComponent 
        result={mbtiResult!} 
        onContinue={handleContinueToDashboard} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Brain className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-800">MBTI智能时间管理</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
                <User className="w-4 h-4 text-purple-600 mr-2" />
                <span className="text-purple-800 font-medium">{mbtiResult?.type}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="flex">
        {/* 侧边栏 */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('timer')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'timer'
                    ? 'bg-purple-100 text-purple-800 border-r-2 border-purple-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Clock className="w-5 h-5 mr-3" />
                个性化番茄钟
              </button>
              
              <button
                onClick={() => setActiveTab('tasks')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'tasks'
                    ? 'bg-purple-100 text-purple-800 border-r-2 border-purple-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckSquare className="w-5 h-5 mr-3" />
                智能任务管理
              </button>
              
              <button
                onClick={() => setActiveTab('parser')}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'parser'
                    ? 'bg-purple-100 text-purple-800 border-r-2 border-purple-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Target className="w-5 h-5 mr-3" />
                AI任务解析
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-6">
          {activeTab === 'timer' && <PomodoroTimer userMBTI={mbtiResult!.type} />}
          {activeTab === 'tasks' && <TaskManager userMBTI={mbtiResult!.type} />}
          {activeTab === 'parser' && <AITaskParser userMBTI={mbtiResult!.type} onTaskParsed={handleTaskParsed} />}
        </div>
      </div>

      {/* Toast通知 */}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
