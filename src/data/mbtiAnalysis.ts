import { MBTIType, MBTIAnalysis } from '../types/mbti';

export const mbtiAnalysis: Record<MBTIType, MBTIAnalysis> = {
  [MBTIType.INTJ]: {
    type: MBTIType.INTJ,
    title: '建筑师 - 战略型思考者',
    description: '富有想象力和战略性的思想家，一切皆在计划之中。',
    strengths: ['战略思维', '独立性强', '有远见', '果断', '知识渊博'],
    weaknesses: ['过于理性', '不善于表达情感', '容易厌倦', '对人要求过高', '固执'],
    career_suggestions: ['科学家', '工程师', '战略规划师', '系统分析师', '建筑师'],
    time_management_tips: [
      '使用四象限法则进行任务优先级排序',
      '制定长期目标和详细计划',
      '预留深度工作时间，避免频繁打断',
      '设置明确的截止日期和里程碑',
      '定期回顾和调整计划'
    ]
  },
  [MBTIType.INTP]: {
    type: MBTIType.INTP,
    title: '逻辑学家 - 创新分析师',
    description: '具有创新精神的发明家，对知识有着止不住的渴望。',
    strengths: ['逻辑思维', '创新能力强', '好奇心重', '客观分析', '适应性强'],
    weaknesses: ['容易分心', '不善于社交', '拖延症', '忽视细节', '过于理想化'],
    career_suggestions: ['研究员', '数据分析师', '哲学家', '软件开发者', '学者'],
    time_management_tips: [
      '使用番茄工作法保持专注',
      '为研究和探索预留充足时间',
      '创建灵活的时间块安排',
      '设置提醒避免过度沉浸',
      '将大任务分解成小步骤'
    ]
  },
  [MBTIType.ENTJ]: {
    type: MBTIType.ENTJ,
    title: '指挥官 - 魅力领导者',
    description: '大胆、富有想象力且意志坚强的领导者，总能找到或创造解决办法。',
    strengths: ['领导能力', '组织能力强', '有远见', '决断力强', '目标导向'],
    weaknesses: ['过于强势', '缺乏耐心', '不善于倾听', '对人要求严格', '容易忽视情感'],
    career_suggestions: ['CEO', '项目经理', '企业家', '管理顾问', '律师'],
    time_management_tips: [
      '制定清晰的优先级和截止日期',
      '委派任务给团队成员',
      '使用甘特图跟踪项目进度',
      '安排高效的会议时间',
      '保持工作区域的整洁有序'
    ]
  },
  [MBTIType.ENTP]: {
    type: MBTIType.ENTP,
    title: '辩论家 - 机智创新者',
    description: '聪明好奇的思想家，不会放弃任何智力上的挑战。',
    strengths: ['创新思维', '适应性强', '善于辩论', '多才多艺', '热情'],
    weaknesses: ['容易厌倦', '缺乏专注', '容易拖延', '不善于执行', '争论过多'],
    career_suggestions: ['创业者', '营销专家', '记者', '发明家', '咨询师'],
    time_management_tips: [
      '多样化任务保持兴趣',
      '设置短期目标和奖励',
      '使用创意工具和方法',
      '与他人合作增加动力',
      '定期切换不同类型的任务'
    ]
  },
  [MBTIType.INFJ]: {
    type: MBTIType.INFJ,
    title: '提倡者 - 神秘理想主义者',
    description: '安静而神秘，同时鼓舞人心且不知疲倦的理想主义者。',
    strengths: ['有洞察力', '有理想', '有同情心', '有决心', '有创意'],
    weaknesses: ['对批评敏感', '容易疲惫', '过于完美主义', '难以说"不"', '容易沮丧'],
    career_suggestions: ['心理咨询师', '作家', '教师', '社会工作者', '艺术家'],
    time_management_tips: [
      '为有意义的工作预留最佳时间',
      '设置合理的期望值',
      '安排充足的休息时间',
      '创建安静的工作环境',
      '将个人价值观融入计划中'
    ]
  },
  [MBTIType.INFP]: {
    type: MBTIType.INFP,
    title: '调停者 - 诗意理想主义者',
    description: '诗意、善良的利他主义者，总是热情地为正义事业而奋斗。',
    strengths: ['理想主义', '有同情心', '有创意', '开放的心态', '灵活'],
    weaknesses: ['过于敏感', '不切实际', '容易拖延', '自我批评', '难以做决定'],
    career_suggestions: ['作家', '艺术家', '心理学家', '社会工作者', '教师'],
    time_management_tips: [
      '使用可视化工具规划任务',
      '为创意工作预留连续时间',
      '设置温和但坚定的截止日期',
      '创建美观的工作空间',
      '将任务与个人意义联系起来'
    ]
  },
  [MBTIType.ENFJ]: {
    type: MBTIType.ENFJ,
    title: '主人公 - 魅力主人公',
    description: '富有魅力和鼓舞人心的领导者，能够让听众着迷。',
    strengths: ['有魅力', '有同情心', '善于沟通', '有远见', '有组织能力'],
    weaknesses: ['过于理想化', '容易过度投入', '对批评敏感', '难以做决定', '忽视自己的需求'],
    career_suggestions: ['教师', '顾问', '人力资源', '政治家', '活动策划'],
    time_management_tips: [
      '将帮助他人纳入计划',
      '安排团队活动和会议',
      '为个人需求预留时间',
      '使用协作工具',
      '定期检查和调整优先级'
    ]
  },
  [MBTIType.ENFP]: {
    type: MBTIType.ENFP,
    title: '竞选者 - 热情自由者',
    description: '热情、有创造力且善于社交的自由精神，总能找到微笑的理由。',
    strengths: ['热情洋溢', '有创意', '善于社交', '观察力强', '沟通能力强'],
    weaknesses: ['容易分心', '过于乐观', '缺乏专注', '容易过度承诺', '不喜欢例行公事'],
    career_suggestions: ['记者', '演员', '顾问', '营销专家', '创业者'],
    time_management_tips: [
      '使用有趣的工具和应用',
      '将社交元素融入工作',
      '设置灵活的截止日期',
      '多样化任务保持兴奋',
      '与他人分享目标和进展'
    ]
  },
  [MBTIType.ISTJ]: {
    type: MBTIType.ISTJ,
    title: '物流师 - 可靠务实者',
    description: '实际和注重事实的个人，可靠性是不容置疑的。',
    strengths: ['有责任感', '实用主义', '有组织能力', '忠诚', '工作努力'],
    weaknesses: ['固执', '不灵活', '对变化抗拒', '过于严肃', '不善于表达情感'],
    career_suggestions: ['会计师', '审计师', '银行家', '管理员', '军官'],
    time_management_tips: [
      '创建详细的待办事项清单',
      '遵循既定的工作流程',
      '设置清晰的优先级',
      '预留缓冲时间应对变化',
      '定期回顾和更新系统'
    ]
  },
  [MBTIType.ISFJ]: {
    type: MBTIType.ISFJ,
    title: '守卫者 - 温暖保护者',
    description: '非常专注和热心的保护者，时刻准备着保护他们所爱的人。',
    strengths: ['可靠', '有同情心', '有责任感', '善于观察', '支持他人'],
    weaknesses: ['过于谦虚', '避免冲突', '容易过度投入', '对变化抗拒', '难以设定界限'],
    career_suggestions: ['护士', '教师', '社工', '图书管理员', '客户服务'],
    time_management_tips: [
      '为他人需求预留时间',
      '创建稳定的工作环境',
      '使用传统的计划工具',
      '设置健康的界限',
      '安排规律的休息时间'
    ]
  },
  [MBTIType.ESTJ]: {
    type: MBTIType.ESTJ,
    title: '总经理 - 高效组织者',
    description: '出色的管理者，在管理事务或人员方面无与伦比。',
    strengths: ['组织能力强', '实用主义', '有决心', '忠诚', '工作努力'],
    weaknesses: ['不灵活', '固执', '难以表达情感', '过于直接', '对变化抗拒'],
    career_suggestions: ['经理', '银行家', '审计师', '军官', '项目经理'],
    time_management_tips: [
      '使用结构化的时间管理系统',
      '制定明确的政策和程序',
      '设置具体的里程碑',
      '高效地委派任务',
      '保持工作空间的秩序'
    ]
  },
  [MBTIType.ESFJ]: {
    type: MBTIType.ESFJ,
    title: '执政官 - 热心助人者',
    description: '极其关心他人、善于社交和受欢迎的人，总是热心提供帮助。',
    strengths: ['有同情心', '善于社交', '有责任感', '忠诚', '支持他人'],
    weaknesses: ['需要认可', '对批评敏感', '难以设定界限', '过度投入', '对变化抗拒'],
    career_suggestions: ['教师', '护士', '社工', '销售', '活动策划'],
    time_management_tips: [
      '将帮助他人纳入日程',
      '安排团队建设活动',
      '使用社交工具保持联系',
      '为个人需求预留时间',
      '创建支持性的工作环境'
    ]
  },
  [MBTIType.ISTP]: {
    type: MBTIType.ISTP,
    title: '鉴赏家 - 灵巧工匠',
    description: '大胆而实际的实验者，擅长使用各种工具。',
    strengths: ['实用主义', '善于解决问题', '独立', '理性', '适应性强'],
    weaknesses: ['难以承诺', '不善于表达情感', '容易厌倦', '不喜欢例行公事', '难以设定长期目标'],
    career_suggestions: ['工程师', '机械师', '飞行员', '侦探', '外科医生'],
    time_management_tips: [
      '使用灵活的时间安排',
      '为解决问题预留时间',
      '创建实用的工具系统',
      '避免过度安排',
      '定期评估和调整计划'
    ]
  },
  [MBTIType.ISFP]: {
    type: MBTIType.ISFP,
    title: '探险家 - 温和艺术家',
    description: '灵活且有魅力的艺术家，时刻准备着探索和体验新鲜事物。',
    strengths: ['有创意', '敏感', '温和', '实际', '灵活'],
    weaknesses: ['过于敏感', '缺乏长远规划', '容易拖延', '难以表达需求', '不喜欢例行公事'],
    career_suggestions: ['艺术家', '设计师', '音乐家', '社工', '教师'],
    time_management_tips: [
      '为创意活动预留时间',
      '使用美观的计划工具',
      '保持灵活的时间安排',
      '创建舒适的工作环境',
      '将任务与价值观联系起来'
    ]
  },
  [MBTIType.ESTP]: {
    type: MBTIType.ESTP,
    title: '企业家 - 活力行动者',
    description: '聪明、精力充沛且善于感知的人，真心享受生活在边缘。',
    strengths: ['实际', '有说服力', '善于社交', '观察力强', '适应性强'],
    weaknesses: ['冲动', '缺乏耐心', '容易厌倦', '不喜欢长期承诺', '难以设定界限'],
    career_suggestions: ['销售', '创业者', '警察', '运动员', '顾问'],
    time_management_tips: [
      '使用快节奏的工作方法',
      '将社交融入工作',
      '设置短期可实现的目标',
      '避免冗长的会议',
      '保持工作环境的活力'
    ]
  },
  [MBTIType.ESFP]: {
    type: MBTIType.ESFP,
    title: '表演者 - 自发娱乐者',
    description: '自发、精力充沛且热情的人，生活在他们周围永远不会无聊。',
    strengths: ['热情', '善于社交', '有同情心', '观察力强', '实用'],
    weaknesses: ['容易分心', '缺乏长远规划', '容易过度投入', '对批评敏感', '难以设定界限'],
    career_suggestions: ['演员', '活动策划', '销售', '教师', '导游'],
    time_management_tips: [
      '使用有趣的时间管理工具',
      '将娱乐元素融入工作',
      '安排社交活动时间',
      '使用视觉化计划工具',
      '保持工作环境的趣味性'
    ]
  }
};