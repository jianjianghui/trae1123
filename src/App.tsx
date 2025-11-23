import { useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { MBTIType, MBTIResult } from './types/mbti';
import { ParsedTask } from './types/task';
import MBTITest from './components/mbti/MBTITest';
import MBTIResultComponent from './components/mbti/MBTIResult';
import AITaskParser from './components/tasks/AITaskParser';
import ChatPage from './pages/ChatPage';
import PomodoroTimer from './components/timer/PomodoroTimer';
import TaskManager from './components/tasks/TaskManager';
import Profile from './pages/Profile';
import { Brain, Target, Clock, CheckSquare, User } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState<'test' | 'result' | 'dashboard'>('test');
  const [mbtiResult, setMbtiResult] = useState<MBTIResult | null>(null);
  const [activeTab, setActiveTab] = useState<'timer' | 'tasks' | 'parser' | 'profile'>('tasks');
  const [preferredMethods, setPreferredMethods] = useState<string[]>(["番茄钟", "四象限", "时间块", "GTD"]);
  const [profile, setProfile] = useState<{ name: string; code: string; avatarUrl?: string }>({
    name: '未命名用户',
    code: 'U-000'
  });

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem('app.profile');
      const storedMethods = localStorage.getItem('app.methods');
      if (storedProfile) {
        const p = JSON.parse(storedProfile);
        setProfile({ name: p.name || '未命名用户', code: p.code || 'U-000', avatarUrl: p.avatarUrl });
      }
      if (storedMethods) {
        const m = JSON.parse(storedMethods);
        if (Array.isArray(m)) setPreferredMethods(m);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('app.profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('app.methods', JSON.stringify(preferredMethods));
    } catch {}
  }, [preferredMethods]);

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
        <div className="hidden md:block w-64 bg-white shadow-lg min-h-screen">
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
                AI对话
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 p-6 pb-20 md:pb-6">
          {activeTab === 'timer' && <PomodoroTimer userMBTI={mbtiResult!.type} />}
          {activeTab === 'tasks' && <TaskManager userMBTI={mbtiResult!.type} />}
          {activeTab === 'parser' && <ChatPage />}
          {activeTab === 'profile' && (
            <Profile
              mbtiType={mbtiResult?.type ?? '未知'}
              name={profile.name}
              code={profile.code}
              avatarUrl={profile.avatarUrl}
              methods={preferredMethods}
              onUpdateMethods={setPreferredMethods}
              onUpdateProfile={setProfile}
            />
          )}
        </div>
      </div>

      {/* 移动端底部标签栏 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around items-center h-14">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex flex-col items-center text-xs ${activeTab === 'tasks' ? 'text-purple-600' : 'text-gray-600'}`}
          >
            <CheckSquare className="w-5 h-5 mb-0.5" />
            智能任务管理
          </button>
          <button
            onClick={() => setActiveTab('parser')}
            className={`flex flex-col items-center text-xs ${activeTab === 'parser' ? 'text-purple-600' : 'text-gray-600'}`}
          >
            <Target className="w-5 h-5 mb-0.5" />
            AI对话
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center text-xs ${activeTab === 'profile' ? 'text-purple-600' : 'text-gray-600'}`}
          >
            <User className="w-5 h-5 mb-0.5" />
            个人中心
          </button>
        </div>
      </nav>

      {/* Toast通知 */}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
