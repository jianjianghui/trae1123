import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, Clock, Target, Calendar, CheckCircle } from 'lucide-react';

interface PomodoroTimerProps {
  userMBTI: string;
}

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

const mbtiTimerDefaults: Record<string, TimerSettings> = {
  'INTJ': { workDuration: 45, breakDuration: 10, longBreakDuration: 30, sessionsBeforeLongBreak: 3 },
  'INTP': { workDuration: 25, breakDuration: 5, longBreakDuration: 20, sessionsBeforeLongBreak: 4 },
  'ENTJ': { workDuration: 50, breakDuration: 10, longBreakDuration: 25, sessionsBeforeLongBreak: 3 },
  'ENTP': { workDuration: 20, breakDuration: 5, longBreakDuration: 15, sessionsBeforeLongBreak: 6 },
  'INFJ': { workDuration: 40, breakDuration: 15, longBreakDuration: 35, sessionsBeforeLongBreak: 3 },
  'INFP': { workDuration: 30, breakDuration: 10, longBreakDuration: 25, sessionsBeforeLongBreak: 4 },
  'ENFJ': { workDuration: 35, breakDuration: 10, longBreakDuration: 20, sessionsBeforeLongBreak: 4 },
  'ENFP': { workDuration: 25, breakDuration: 5, longBreakDuration: 15, sessionsBeforeLongBreak: 5 },
  'ISTJ': { workDuration: 50, breakDuration: 5, longBreakDuration: 20, sessionsBeforeLongBreak: 4 },
  'ISFJ': { workDuration: 45, breakDuration: 10, longBreakDuration: 25, sessionsBeforeLongBreak: 3 },
  'ESTJ': { workDuration: 55, breakDuration: 5, longBreakDuration: 15, sessionsBeforeLongBreak: 4 },
  'ESFJ': { workDuration: 40, breakDuration: 10, longBreakDuration: 20, sessionsBeforeLongBreak: 4 },
  'ISTP': { workDuration: 35, breakDuration: 10, longBreakDuration: 30, sessionsBeforeLongBreak: 3 },
  'ISFP': { workDuration: 30, breakDuration: 15, longBreakDuration: 30, sessionsBeforeLongBreak: 3 },
  'ESTP': { workDuration: 25, breakDuration: 5, longBreakDuration: 20, sessionsBeforeLongBreak: 5 },
  'ESFP': { workDuration: 20, breakDuration: 10, longBreakDuration: 25, sessionsBeforeLongBreak: 4 }
};

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ userMBTI }) => {
  const [settings, setSettings] = useState<TimerSettings>(mbtiTimerDefaults[userMBTI] || mbtiTimerDefaults['INTJ']);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (!isBreak) {
      // 工作完成，开始休息
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);
      
      if (newSessionCount % settings.sessionsBeforeLongBreak === 0) {
        // 长休息
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        // 短休息
        setTimeLeft(settings.breakDuration * 60);
      }
      setIsBreak(true);
    } else {
      // 休息完成，开始工作
      setTimeLeft(settings.workDuration * 60);
      setIsBreak(false);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(settings.workDuration * 60);
    setIsBreak(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMotivationalMessage = () => {
    const messages: Record<string, string[]> = {
      'INTJ': ['保持专注，你的战略规划正在发挥作用', '每个完成的任务都是向目标迈进的一步'],
      'INTP': ['探索新知识的时间到了', '让你的好奇心引导你发现创新的解决方案'],
      'ENTJ': ['领导力的展现就在此刻', '高效执行，你正在创造卓越的成果'],
      'ENTP': ['让创意自由流动', '每个挑战都是展现你机智的机会'],
      'INFJ': ['你的工作正在为更大的目标服务', '相信你的直觉，它正在指引你前进'],
      'INFP': ['让内心的热情驱动你的创造力', '每个任务都是你表达价值观的机会'],
      'ENFJ': ['你的正能量正在影响周围的人', '通过帮助他人，你正在实现自己的使命'],
      'ENFP': ['保持热情，让工作变得有趣', '你的感染力正在激发团队的活力'],
      'ISTJ': ['坚持系统化的方法，你正在稳步前进', '可靠性是你的超能力，继续保持'],
      'ISFJ': ['你的细心关怀正在为团队创造价值', '通过服务他人，你正在实现个人成长'],
      'ESTJ': ['高效的执行力正在推动项目前进', '你的组织能力确保了团队的成功'],
      'ESFJ': ['通过协作，你正在创造和谐的工作环境', '你的关怀让每个人都感到被重视'],
      'ISTP': ['让实用技能解决当前的问题', '你的冷静分析正在找到最佳解决方案'],
      'ISFP': ['让创意在工作中自然流露', '你的独特视角正在为任务增添价值'],
      'ESTP': ['立即行动，机会就在眼前', '你的活力和适应性正在克服挑战'],
      'ESFP': ['让工作充满乐趣和活力', '你的积极态度正在感染周围的每个人']
    };
    
    const userMessages = messages[userMBTI] || messages['INTJ'];
    return userMessages[Math.floor(Math.random() * userMessages.length)];
  };

  const progress = isBreak 
    ? ((settings.breakDuration * 60 - timeLeft) / (settings.breakDuration * 60)) * 100
    : ((settings.workDuration * 60 - timeLeft) / (settings.workDuration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">个性化番茄钟</h1>
          <p className="text-gray-600">基于您的 {userMBTI} 类型定制的时间管理工具</p>
        </div>

        {/* 计时器主体 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke={isBreak ? "#10b981" : "#3b82f6"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className={`text-sm font-medium ${isBreak ? 'text-green-600' : 'text-blue-600'}`}>
                  {isBreak ? '休息时间' : '专注时间'}
                </div>
              </div>
            </div>

            {/* 激励消息 */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 text-sm italic">
                "{getMotivationalMessage()}"
              </p>
            </div>

            {/* 控制按钮 */}
            <div className="flex justify-center space-x-4 mb-6">
              <button
                onClick={toggleTimer}
                className={`flex items-center px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  isRunning
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : isBreak
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    暂停
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    开始
                  </>
                )}
              </button>
              
              <button
                onClick={resetTimer}
                className="flex items-center px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                重置
              </button>
            </div>

            {/* 会话统计 */}
            <div className="flex justify-center space-x-8 text-sm text-gray-600">
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-800">{sessionCount}</div>
                <div>已完成专注</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-800">{settings.workDuration}</div>
                <div>分钟/专注</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-lg text-gray-800">{settings.breakDuration}</div>
                <div>分钟/休息</div>
              </div>
            </div>
          </div>
        </div>

        {/* 个性化建议 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-600" />
            {userMBTI} 类型专属建议
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">最佳工作时长</h4>
              <p>{settings.workDuration} 分钟专注 + {settings.breakDuration} 分钟休息</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">长休息间隔</h4>
              <p>每 {settings.sessionsBeforeLongBreak} 个专注周期后长休息 {settings.longBreakDuration} 分钟</p>
            </div>
          </div>
        </div>

        {/* 设置面板 */}
        {showSettings && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-600" />
              个性化设置
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  专注时长 (分钟)
                </label>
                <input
                  type="number"
                  value={settings.workDuration}
                  onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value) || 25})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="5"
                  max="90"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  休息时长 (分钟)
                </label>
                <input
                  type="number"
                  value={settings.breakDuration}
                  onChange={(e) => setSettings({...settings, breakDuration: parseInt(e.target.value) || 5})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  长休息时长 (分钟)
                </label>
                <input
                  type="number"
                  value={settings.longBreakDuration}
                  onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value) || 15})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="5"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  长休息间隔 (专注周期)
                </label>
                <input
                  type="number"
                  value={settings.sessionsBeforeLongBreak}
                  onChange={(e) => setSettings({...settings, sessionsBeforeLongBreak: parseInt(e.target.value) || 4})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="2"
                  max="10"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                保存设置
              </button>
            </div>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            {showSettings ? '隐藏设置' : '自定义设置'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;