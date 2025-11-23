import { useState } from 'react';
import { MBTIType, MBTIQuestion, MBTIResult } from '../../types/mbti';
import { mbtiQuestions } from '../../data/mbtiQuestions';
import { mbtiAnalysis } from '../../data/mbtiAnalysis';
import { ChevronLeft, ChevronRight, Brain, Users, Target, Zap } from 'lucide-react';

interface MBTITestProps {
  onComplete: (result: MBTIResult) => void;
}

interface Answer {
  questionId: number;
  value: string;
  weight: number;
}

const MBTITest: React.FC<MBTITestProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleAnswer = (value: string, weight: number) => {
    const newAnswer = {
      questionId: mbtiQuestions[currentQuestion].id,
      value,
      weight
    };

    const updatedAnswers = answers.filter(a => a.questionId !== newAnswer.questionId);
    updatedAnswers.push(newAnswer);
    setAnswers(updatedAnswers);
    setSelectedOption(value);

    // 自动进入下一题
    setTimeout(() => {
      if (currentQuestion < mbtiQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption('');
      }
    }, 500);
  };

  const calculateResult = (): MBTIResult => {
    const scores = {
      E: 0, I: 0,
      S: 0, N: 0,
      T: 0, F: 0,
      J: 0, P: 0
    };

    answers.forEach(answer => {
      const dimension = answer.value;
      if (dimension === 'E' || dimension === 'I') {
        scores[dimension] += answer.weight;
      } else if (dimension === 'S' || dimension === 'N') {
        scores[dimension] += answer.weight;
      } else if (dimension === 'T' || dimension === 'F') {
        scores[dimension] += answer.weight;
      } else if (dimension === 'J' || dimension === 'P') {
        scores[dimension] += answer.weight;
      }
    });

    const type = `${scores.E > scores.I ? 'E' : 'I'}${
      scores.S > scores.N ? 'S' : 'N'
    }${
      scores.T > scores.F ? 'T' : 'F'
    }${
      scores.J > scores.P ? 'J' : 'P'
    }` as MBTIType;

    const totalQuestions = answers.length;
    const confidence = Math.min(
      Math.max(
        (Math.abs(scores.E - scores.I) +
         Math.abs(scores.S - scores.N) +
         Math.abs(scores.T - scores.F) +
         Math.abs(scores.J - scores.P)) / totalQuestions,
        0
      ),
      1
    );

    const analysis = mbtiAnalysis[type];

    return {
      type,
      scores,
      confidence,
      description: analysis.description,
      traits: analysis.strengths.slice(0, 3)
    };
  };

  const handleComplete = () => {
    if (answers.length === mbtiQuestions.length) {
      const result = calculateResult();
      onComplete(result);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const previousAnswer = answers.find(
        a => a.questionId === mbtiQuestions[currentQuestion - 1].id
      );
      setSelectedOption(previousAnswer?.value || '');
    }
  };

  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100;
  const question = mbtiQuestions[currentQuestion];
  const dimensionIcons = {
    'E-I': Users,
    'S-N': Target,
    'T-F': Brain,
    'J-P': Zap
  };
  const DimensionIcon = dimensionIcons[question.dimension];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* 进度条 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-bold text-gray-800">MBTI 性格测试</h1>
            <span className="text-sm text-gray-600">
              {currentQuestion + 1} / {mbtiQuestions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 问题卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <DimensionIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">
                维度 {currentQuestion + 1} / 4
              </p>
              <h2 className="text-xl font-semibold text-gray-800">{question.question}</h2>
            </div>
          </div>

          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value, option.weight)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedOption === option.value
                    ? 'border-purple-500 bg-purple-50 text-purple-800'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === option.value
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedOption === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-700">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex justify-between">
          <button
            onClick={goBack}
            disabled={currentQuestion === 0}
            className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
              currentQuestion === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            上一题
          </button>

          {currentQuestion === mbtiQuestions.length - 1 ? (
            <button
              onClick={handleComplete}
              disabled={answers.length !== mbtiQuestions.length}
              className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                answers.length === mbtiQuestions.length
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              查看结果
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          ) : (
            <div className="px-6 py-3 text-gray-400">
              请选择一个答案
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MBTITest;