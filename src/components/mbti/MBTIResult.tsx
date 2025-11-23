import { MBTIType, MBTIResult } from '../../types/mbti';
import { mbtiAnalysis } from '../../data/mbtiAnalysis';
import { Brain, Target, Users, Zap, Clock, CheckCircle, TrendingUp } from 'lucide-react';

interface MBTIResultProps {
  result: MBTIResult;
  onContinue: () => void;
}

const MBTIResultComponent: React.FC<MBTIResultProps> = ({ result, onContinue }) => {
  const analysis = mbtiAnalysis[result.type];
  const confidencePercentage = Math.round(result.confidence * 100);

  const getDimensionExplanation = (type: MBTIType) => {
    const explanations = {
      'E': '外向 - 从外部世界获取能量，喜欢与人互动',
      'I': '内向 - 从内在世界获取能量，需要独处时间',
      'S': '感觉 - 关注具体细节和实际经验',
      'N': '直觉 - 关注可能性和大局观',
      'T': '思考 - 基于逻辑和客观分析做决定',
      'F': '情感 - 基于价值观和他人感受做决定',
      'J': '判断 - 喜欢计划和结构，追求确定性',
      'P': '知觉 - 喜欢灵活和变化，保持开放选择'
    };

    return type.split('').map(letter => ({
      letter,
      explanation: explanations[letter as keyof typeof explanations]
    }));
  };

  const dimensions = getDimensionExplanation(result.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部结果 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-4">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{result.type}</h1>
            <h2 className="text-xl text-gray-600 mb-4">{analysis.title}</h2>
            <p className="text-gray-700 max-w-2xl mx-auto">{analysis.description}</p>
          </div>

          {/* 置信度 */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">测试结果置信度</span>
              <span className="text-sm font-semibold text-purple-600">{confidencePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${confidencePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* 维度解释 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {dimensions.map((dim, index) => {
            const icons = [Users, Target, Brain, Zap];
            const Icon = icons[index];
            return (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {dim.letter} - {dim.explanation?.split(' - ')[0]}
                  </h3>
                </div>
                <p className="text-gray-600 text-sm">{dim.explanation?.split(' - ')[1]}</p>
              </div>
            );
          })}
        </div>

        {/* 优势和劣势 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              你的优势
            </h3>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-orange-700 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              成长空间
            </h3>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 时间管理建议 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            个性化时间管理建议
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.time_management_tips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                <p className="text-gray-700 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 继续按钮 */}
        <div className="text-center">
          <button
            onClick={onContinue}
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
          >
            开始个性化时间管理之旅
          </button>
        </div>
      </div>
    </div>
  );
};

export default MBTIResultComponent;