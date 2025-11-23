import { useState } from 'react';
import { AIService } from '../../services/aiService.ts';
import { ParsedTask, TaskInput } from '../../types/task';
import { Send, Sparkles, Clock, Target, CheckCircle, Calendar } from 'lucide-react';

interface AITaskParserProps {
  userMBTI: string;
  onTaskParsed: (task: ParsedTask) => void;
}

const AITaskParser: React.FC<AITaskParserProps> = ({ userMBTI, onTaskParsed }) => {
  const [taskDescription, setTaskDescription] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedTask, setParsedTask] = useState<ParsedTask | null>(null);

  const handleParseTask = async () => {
    if (!taskDescription.trim()) return;

    setIsParsing(true);
    try {
      const taskInput: TaskInput = {
        description: taskDescription,
        userMBTI
      };

      const result = await AIService.parseTask(taskInput);
      setParsedTask(result);
      onTaskParsed(result);
    } catch (error) {
      console.error('任务解析失败:', error);
    } finally {
      setIsParsing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'personal': return '🏠';
      case 'health': return '💪';
      case 'learning': return '📚';
      case 'social': return '👥';
      case 'creative': return '🎨';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI 智能任务解析</h1>
          <p className="text-gray-600">基于您的MBTI类型，智能解析和优化任务安排</p>
        </div>

        {/* 输入区域 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述您的任务
            </label>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="例如：下周要完成项目提案，每天学1小时英语，周末和朋友聚餐..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              💡 小贴士：尽量具体描述任务内容、时间和要求
            </div>
            <button
              onClick={handleParseTask}
              disabled={!taskDescription.trim() || isParsing}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                taskDescription.trim() && !isParsing
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isParsing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  解析中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  智能解析
                </>
              )}
            </button>
          </div>
        </div>

        {/* 解析结果 */}
        {parsedTask && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">解析结果</h2>
                <p className="text-gray-600 text-sm">基于您的 {userMBTI} 类型优化</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* 任务基本信息 */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">任务标题</h3>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{parsedTask.title}</p>
                </div>

                <div className="flex space-x-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-700 mb-2">优先级</h3>
                    <div className={`px-3 py-2 rounded-lg text-center font-medium ${getPriorityColor(parsedTask.priority)}`}>
                      {parsedTask.priority === 'high' ? '高' : parsedTask.priority === 'medium' ? '中' : '低'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-700 mb-2">分类</h3>
                    <div className="flex items-center justify-center px-3 py-2 bg-gray-100 rounded-lg">
                      <span className="mr-2">{getCategoryIcon(parsedTask.category)}</span>
                      <span className="capitalize">{parsedTask.category}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    预计时长
                  </h3>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                    {parsedTask.estimatedDuration >= 60 
                      ? `${Math.round(parsedTask.estimatedDuration / 60 * 10) / 10} 小时`
                      : `${parsedTask.estimatedDuration} 分钟`
                    }
                  </p>
                </div>
              </div>

              {/* 子任务 */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  建议步骤
                </h3>
                <div className="space-y-2">
                  {parsedTask.subtasks.map((subtask, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                        {index + 1}
                      </div>
                      <span className="text-gray-800">{subtask}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MBTI个性化建议 */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
                {userMBTI} 类型专属建议
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {parsedTask.mbtiSuggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AITaskParser;