import { ParsedTask, TaskInput } from '../types/task';

// 模拟AI任务解析功能
export class AIService {
  static async parseTask(input: TaskInput): Promise<ParsedTask> {
    // 这里模拟AI解析过程
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { description, userMBTI } = input;
    
    // 基于MBTI类型的个性化建议
    const mbtiSuggestions = this.getMBTISuggestions(userMBTI, description);
    
    // 解析任务描述
    const parsedData = this.parseDescription(description);
    
    return {
      title: parsedData.title,
      subtasks: parsedData.subtasks,
      estimatedDuration: parsedData.estimatedDuration,
      priority: parsedData.priority,
      category: parsedData.category,
      mbtiSuggestions
    };
  }
  
  private static getMBTISuggestions(mbtiType: string, description: string): string[] {
    const suggestions: Record<string, string[]> = {
      'INTJ': [
        '将任务分解为逻辑步骤，制定详细计划',
        '设置明确的里程碑和检查点',
        '预留深度工作时间，避免干扰',
        '使用四象限法则确定优先级'
      ],
      'INTP': [
        '为探索和研究预留充足时间',
        '使用番茄工作法保持专注',
        '允许灵活性，适应新的发现',
        '将复杂任务分解成小步骤'
      ],
      'ENTJ': [
        '制定清晰的优先级和时间表',
        '委派可以分配的任务给他人',
        '设置具体的截止日期',
        '使用甘特图跟踪进度'
      ],
      'ENTP': [
        '保持任务的多样性和趣味性',
        '设置短期目标和奖励机制',
        '与他人合作增加动力',
        '允许灵活调整计划'
      ],
      'INFJ': [
        '将任务与个人价值观联系起来',
        '为有意义的工作预留最佳时间',
        '创建安静的工作环境',
        '定期休息，避免过度疲劳'
      ],
      'INFP': [
        '使用可视化工具规划任务',
        '为创意工作预留连续时间',
        '将任务与个人意义联系起来',
        '设置温和但坚定的截止日期'
      ],
      'ENFJ': [
        '将帮助他人纳入计划',
        '安排团队活动和协作时间',
        '使用社交工具保持联系',
        '定期检查和调整优先级'
      ],
      'ENFP': [
        '使用有趣的时间管理工具',
        '将社交元素融入工作',
        '保持任务的多样性',
        '与他人分享目标和进展'
      ],
      'ISTJ': [
        '创建详细的待办事项清单',
        '遵循既定的工作流程',
        '设置清晰的优先级',
        '定期回顾和更新系统'
      ],
      'ISFJ': [
        '为他人需求预留时间',
        '创建稳定的工作环境',
        '使用传统的计划工具',
        '安排规律的休息时间'
      ],
      'ESTJ': [
        '使用结构化的时间管理系统',
        '制定明确的政策和程序',
        '设置具体的里程碑',
        '高效地委派任务'
      ],
      'ESFJ': [
        '将帮助他人纳入日程',
        '安排团队建设活动',
        '使用社交工具保持联系',
        '创建支持性的工作环境'
      ],
      'ISTP': [
        '使用灵活的时间安排',
        '为解决问题预留时间',
        '创建实用的工具系统',
        '避免过度安排'
      ],
      'ISFP': [
        '为创意活动预留时间',
        '使用美观的计划工具',
        '保持灵活的时间安排',
        '创建舒适的工作环境'
      ],
      'ESTP': [
        '使用快节奏的工作方法',
        '将社交融入工作',
        '设置短期可实现的目标',
        '保持工作环境的活力'
      ],
      'ESFP': [
        '使用有趣的时间管理工具',
        '将娱乐元素融入工作',
        '安排社交活动时间',
        '使用视觉化计划工具'
      ]
    };
    
    return suggestions[mbtiType] || suggestions['INTJ'];
  }
  
  private static parseDescription(description: string) {
    // 简单的任务解析逻辑
    const lowerDesc = description.toLowerCase();
    
    // 提取任务标题
    let title = description.split('，')[0].split('。')[0];
    if (title.length > 50) {
      title = title.substring(0, 50) + '...';
    }
    
    // 识别任务类型
    let category = 'work';
    if (lowerDesc.includes('学习') || lowerDesc.includes('课程') || lowerDesc.includes('阅读')) {
      category = 'learning';
    } else if (lowerDesc.includes('运动') || lowerDesc.includes('健身') || lowerDesc.includes('健康')) {
      category = 'health';
    } else if (lowerDesc.includes('朋友') || lowerDesc.includes('聚会') || lowerDesc.includes('社交')) {
      category = 'social';
    } else if (lowerDesc.includes('个人') || lowerDesc.includes('生活') || lowerDesc.includes('家庭')) {
      category = 'personal';
    } else if (lowerDesc.includes('创意') || lowerDesc.includes('设计') || lowerDesc.includes('艺术')) {
      category = 'creative';
    }
    
    // 估算时间
    let estimatedDuration = 60;
    if (lowerDesc.includes('小时')) {
      const match = lowerDesc.match(/(\d+)小时/);
      if (match) {
        estimatedDuration = parseInt(match[1]) * 60;
      }
    } else if (lowerDesc.includes('分钟')) {
      const match = lowerDesc.match(/(\d+)分钟/);
      if (match) {
        estimatedDuration = parseInt(match[1]);
      }
    } else if (lowerDesc.includes('天') || lowerDesc.includes('日')) {
      const match = lowerDesc.match(/(\d+)[天日]/);
      if (match) {
        estimatedDuration = parseInt(match[1]) * 8 * 60; // 假设每天8小时
      }
    }
    
    // 生成子任务
    const subtasks = this.generateSubtasks(title, category, estimatedDuration);
    
    // 确定优先级
    let priority = 'medium';
    if (lowerDesc.includes('重要') || lowerDesc.includes('紧急') || lowerDesc.includes('必须')) {
      priority = 'high';
    } else if (lowerDesc.includes('轻松') || lowerDesc.includes('简单') || lowerDesc.includes('有空')) {
      priority = 'low';
    }
    
    return {
      title,
      subtasks,
      estimatedDuration,
      priority,
      category
    };
  }
  
  private static generateSubtasks(title: string, category: string, duration: number): string[] {
    const subtasks: string[] = [];
    
    if (duration > 240) { // 超过4小时的任务
      subtasks.push('任务准备和规划');
      subtasks.push('主要执行阶段');
      subtasks.push('检查和收尾工作');
    } else if (duration > 120) { // 超过2小时的任务
      subtasks.push('准备工作');
      subtasks.push('执行任务');
      subtasks.push('总结和整理');
    } else {
      subtasks.push('开始任务');
      subtasks.push('完成任务');
    }
    
    // 根据类别添加特定子任务
    if (category === 'learning') {
      subtasks.unshift('收集学习资料');
      subtasks.push('复习和巩固');
    } else if (category === 'health') {
      subtasks.unshift('热身和准备');
      subtasks.push('放松和恢复');
    } else if (category === 'work') {
      subtasks.unshift('明确目标和要求');
      subtasks.push('质量检查');
    }
    
    return subtasks;
  }
}