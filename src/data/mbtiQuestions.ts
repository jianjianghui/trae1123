import { MBTIQuestion } from '../types/mbti';

export const mbtiQuestions: MBTIQuestion[] = [
  // E-I 维度 (外向-内向)
  {
    id: 1,
    dimension: 'E-I',
    question: '在社交聚会中，你通常：',
    options: [
      { text: '主动与多人交谈，感到精力充沛', value: 'E', weight: 1 },
      { text: '选择与少数熟人深入交流，之后需要独处恢复', value: 'I', weight: 1 }
    ]
  },
  {
    id: 2,
    dimension: 'E-I',
    question: '周末你更倾向于：',
    options: [
      { text: '和朋友外出聚会，享受热闹的氛围', value: 'E', weight: 1 },
      { text: '独自在家看书、追剧或做个人爱好', value: 'I', weight: 1 }
    ]
  },
  {
    id: 3,
    dimension: 'E-I',
    question: '当遇到问题时，你通常会：',
    options: [
      { text: '立即与他人讨论，通过交流理清思路', value: 'E', weight: 1 },
      { text: '先独自思考，有了想法后再与人分享', value: 'I', weight: 1 }
    ]
  },
  
  // S-N 维度 (感觉-直觉)
  {
    id: 4,
    dimension: 'S-N',
    question: '你更信任：',
    options: [
      { text: '具体的经验和事实，眼见为实', value: 'S', weight: 1 },
      { text: '直觉和灵感，相信内在的感觉', value: 'N', weight: 1 }
    ]
  },
  {
    id: 5,
    dimension: 'S-N',
    question: '学习新东西时，你更喜欢：',
    options: [
      { text: '按部就班，从基础开始逐步深入', value: 'S', weight: 1 },
      { text: '先了解整体框架，再深入细节', value: 'N', weight: 1 }
    ]
  },
  {
    id: 6,
    dimension: 'S-N',
    question: '描述同一件事情时，你会：',
    options: [
      { text: '详细描述具体的细节和过程', value: 'S', weight: 1 },
      { text: '概括主要观点，喜欢使用比喻', value: 'N', weight: 1 }
    ]
  },
  
  // T-F 维度 (思考-情感)
  {
    id: 7,
    dimension: 'T-F',
    question: '做决定时，你更看重：',
    options: [
      { text: '逻辑分析和客观标准', value: 'T', weight: 1 },
      { text: '个人价值观和他人的感受', value: 'F', weight: 1 }
    ]
  },
  {
    id: 8,
    dimension: 'T-F',
    question: '在讨论中，你更容易：',
    options: [
      { text: '指出逻辑漏洞，追求真理', value: 'T', weight: 1 },
      { text: '维护和谐，考虑他人感受', value: 'F', weight: 1 }
    ]
  },
  {
    id: 9,
    dimension: 'T-F',
    question: '你更擅长：',
    options: [
      { text: '客观分析问题，找出最优解', value: 'T', weight: 1 },
      { text: '理解他人情绪，提供情感支持', value: 'F', weight: 1 }
    ]
  },
  
  // J-P 维度 (判断-知觉)
  {
    id: 10,
    dimension: 'J-P',
    question: '你的生活方式更偏向：',
    options: [
      { text: '提前计划，喜欢有条理和确定性', value: 'J', weight: 1 },
      { text: '灵活应变，享受变化和惊喜', value: 'P', weight: 1 }
    ]
  },
  {
    id: 11,
    dimension: 'J-P',
    question: '面对截止日期，你通常会：',
    options: [
      { text: '提前完成，避免最后时刻的压力', value: 'J', weight: 1 },
      { text: '临近截止时效率最高，喜欢时间压力', value: 'P', weight: 1 }
    ]
  },
  {
    id: 12,
    dimension: 'J-P',
    question: '旅行时你更喜欢：',
    options: [
      { text: '制定详细行程，提前预订好一切', value: 'J', weight: 1 },
      { text: '大致规划，留有余地探索发现', value: 'P', weight: 1 }
    ]
  }
];