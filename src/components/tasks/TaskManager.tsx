import { useEffect, useState } from 'react';
import { Plus, Target, Calendar, Filter, Trash2, Edit3, CheckCircle, Clock, LayoutGrid, Workflow } from 'lucide-react';
import { Task, TaskCategory, TaskPriority, GTDStage } from '../../types/task';
import PomodoroTimer from '../timer/PomodoroTimer';

interface TaskManagerProps {
  userMBTI: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ userMBTI }) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '完成项目提案',
      description: '准备下周的项目提案文档',
      category: TaskCategory.WORK,
      priority: TaskPriority.HIGH,
      estimatedDuration: 120,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    },
    {
      id: '2',
      title: '学习英语',
      description: '每天学习1小时英语',
      category: TaskCategory.LEARNING,
      priority: TaskPriority.MEDIUM,
      estimatedDuration: 60,
      createdAt: new Date()
    }
  ]);
  
  const [filter, setFilter] = useState<{ category?: TaskCategory; priority?: TaskPriority }>({});
  const [showTimer, setShowTimer] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'quadrants' | 'gtd'>('list');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState<TaskCategory>(TaskCategory.WORK);
  const [editPriority, setEditPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [editDuration, setEditDuration] = useState<number>(60);
  const [editDueDateStr, setEditDueDateStr] = useState<string>('');

  useEffect(() => {
    if (editingTask) {
      setEditTitle(editingTask.title || '');
      setEditDescription(editingTask.description || '');
      setEditCategory(editingTask.category);
      setEditPriority(editingTask.priority);
      setEditDuration(editingTask.estimatedDuration || 60);
      setEditDueDateStr(editingTask.dueDate ? editingTask.dueDate.toISOString().slice(0, 10) : '');
    }
  }, [editingTask]);

  const saveEdit = () => {
    if (!editingTask) return;
    if (!editTitle.trim()) return;
    const updated = tasks.map(t =>
      t.id === editingTask.id
        ? {
            ...t,
            title: editTitle.trim(),
            description: editDescription.trim() || undefined,
            category: editCategory,
            priority: editPriority,
            estimatedDuration: editDuration || undefined,
            dueDate: editDueDateStr ? new Date(editDueDateStr) : undefined,
          }
        : t
    );
    setTasks(updated);
    setEditingTask(null);
  };

  const categories = Object.values(TaskCategory);
  const priorities = Object.values(TaskPriority);

  const getCategoryIcon = (category: TaskCategory) => {
    const icons = {
      [TaskCategory.WORK]: '💼',
      [TaskCategory.PERSONAL]: '🏠',
      [TaskCategory.HEALTH]: '💪',
      [TaskCategory.LEARNING]: '📚',
      [TaskCategory.SOCIAL]: '👥',
      [TaskCategory.CREATIVE]: '🎨'
    };
    return icons[category];
  };

  const getPriorityColor = (priority: TaskPriority) => {
    const colors = {
      [TaskPriority.HIGH]: 'border-red-300 bg-red-50',
      [TaskPriority.MEDIUM]: 'border-yellow-300 bg-yellow-50',
      [TaskPriority.LOW]: 'border-green-300 bg-green-50'
    };
    return colors[priority];
  };

  const getPriorityText = (priority: TaskPriority) => {
    const texts = {
      [TaskPriority.HIGH]: '高',
      [TaskPriority.MEDIUM]: '中',
      [TaskPriority.LOW]: '低'
    };
    return texts[priority];
  };

  const filteredTasks = tasks.filter(task => {
    if (filter.category && task.category !== filter.category) return false;
    if (filter.priority && task.priority !== filter.priority) return false;
    return true;
  });

  const isUrgent = (task: Task) => {
    if (!task.dueDate) return false;
    const diff = task.dueDate.getTime() - Date.now();
    return diff <= 2 * 24 * 60 * 60 * 1000;
  };

  const isImportant = (task: Task) => task.priority === TaskPriority.HIGH || task.priority === TaskPriority.MEDIUM;

  const quadrants = {
    urgentImportant: filteredTasks.filter(t => isUrgent(t) && isImportant(t)),
    urgentNotImportant: filteredTasks.filter(t => isUrgent(t) && !isImportant(t)),
    notUrgentImportant: filteredTasks.filter(t => !isUrgent(t) && isImportant(t)),
    notUrgentNotImportant: filteredTasks.filter(t => !isUrgent(t) && !isImportant(t))
  };

  const stageOrder: GTDStage[] = [GTDStage.INBOX, GTDStage.CLARIFY, GTDStage.ORGANIZE, GTDStage.EXECUTE, GTDStage.REVIEW];

  const moveStage = (taskId: string, dir: 'next' | 'prev') => {
    setTasks(tasks.map(t => {
      if (t.id !== taskId) return t;
      const current = t.gtdStage || GTDStage.INBOX;
      const idx = stageOrder.indexOf(current);
      const nextIdx = dir === 'next' ? Math.min(idx + 1, stageOrder.length - 1) : Math.max(idx - 1, 0);
      return { ...t, gtdStage: stageOrder[nextIdx] };
    }));
  };

  const setStage = (taskId: string, stage: GTDStage) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, gtdStage: stage } : t));
  };

  const tasksByStage = (stage: GTDStage) => filteredTasks.filter(t => (t.gtdStage || GTDStage.INBOX) === stage);

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completedAt: task.completedAt ? undefined : new Date() }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getMBTITaskAdvice = (mbti: string, task: Task) => {
    const advice: Record<string, string[]> = {
      'INTJ': [
        '将此任务纳入您的长期战略规划',
        '使用四象限法则确定优先级',
        '预留充足的深度工作时间'
      ],
      'INTP': [
        '允许在任务中探索新的解决方案',
        '使用番茄工作法保持专注',
        '将复杂任务分解成小步骤'
      ],
      'ENTJ': [
        '制定清晰的执行计划和时间表',
        '考虑委派部分任务给他人',
        '设置具体的里程碑'
      ],
      'ENTP': [
        '保持任务的多样性和挑战性',
        '与他人合作增加趣味性',
        '允许灵活调整方法'
      ],
      'INFJ': [
        '将此任务与您的价值观联系起来',
        '在安静的环境中工作',
        '定期休息避免过度疲劳'
      ],
      'INFP': [
        '为创意表达预留空间',
        '使用美观的工具增加动力',
        '将任务与个人意义联系起来'
      ],
      'ENFJ': [
        '考虑此任务如何帮助他人',
        '寻求他人的支持和反馈',
        '创建协作的工作环境'
      ],
      'ENFP': [
        '让任务过程充满乐趣',
        '与他人分享您的进展',
        '保持开放的心态迎接变化'
      ],
      'ISTJ': [
        '遵循既定的流程和标准',
        '创建详细的执行清单',
        '定期检查进度'
      ],
      'ISFJ': [
        '考虑此任务对他人的影响',
        '创建稳定的工作环境',
        '为他人提供支持'
      ],
      'ESTJ': [
        '使用结构化的方法执行',
        '确保符合标准和规范',
        '高效地管理时间'
      ],
      'ESFJ': [
        '将团队需求纳入考虑',
        '创建和谐的工作氛围',
        '寻求他人的认可和支持'
      ],
      'ISTP': [
        '专注于实际可行的解决方案',
        '允许灵活调整方法',
        '避免过度复杂的计划'
      ],
      'ISFP': [
        '为创意表达预留空间',
        '在舒适的环境中工作',
        '保持任务的灵活性'
      ],
      'ESTP': [
        '立即行动，不要拖延',
        '享受解决问题的过程',
        '保持任务的挑战性'
      ],
      'ESFP': [
        '让任务过程充满乐趣',
        '与他人互动增加动力',
        '享受当下的工作体验'
      ]
    };
    
    const mbtiAdvice = advice[mbti] || advice['INTJ'];
    return mbtiAdvice[Math.floor(Math.random() * mbtiAdvice.length)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">智能任务管理</h1>
            <p className="text-gray-600">基于您的 {userMBTI} 类型优化任务安排</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            添加任务
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-3 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-lg text-sm ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              列表
            </button>
            <button
              onClick={() => setViewMode('quadrants')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm ${viewMode === 'quadrants' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              <LayoutGrid className="w-4 h-4 mr-1" />
              四象限
            </button>
            <button
              onClick={() => setViewMode('gtd')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm ${viewMode === 'gtd' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              <Workflow className="w-4 h-4 mr-1" />
              GTD
            </button>
            {viewMode === 'gtd' && (['INFJ','INFP','ESFJ','ISFJ'].includes(userMBTI)) && (
              <div className="ml-auto text-xs text-purple-700">适合 {userMBTI}：结构化整理提升专注与执行</div>
            )}
          </div>
        </div>

        {/* 番茄钟（可展开/收起） */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">个性化番茄钟</span>
            </div>
            <button
              onClick={() => setShowTimer(!showTimer)}
              className="px-3 py-1 text-sm text-purple-600 hover:text-purple-800"
            >
              {showTimer ? '收起' : '展开'}
            </button>
          </div>
          {showTimer && (
            <div className="border rounded-lg">
              <PomodoroTimer userMBTI={userMBTI} />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">筛选：</span>
            </div>
            
            <select
              value={filter.category || ''}
              onChange={(e) => setFilter({...filter, category: e.target.value as TaskCategory || undefined})}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">所有分类</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </option>
              ))}
            </select>
            
            <select
              value={filter.priority || ''}
              onChange={(e) => setFilter({...filter, priority: e.target.value as TaskPriority || undefined})}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">所有优先级</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {getPriorityText(priority)}优先级
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setFilter({})}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              清除筛选
            </button>
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="space-y-4">
            {filteredTasks.map(task => (
              <div key={task.id} className={`bg-white rounded-xl shadow-md p-6 border-2 ${getPriorityColor(task.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start flex-1">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`mr-4 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        task.completedAt 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {task.completedAt && <CheckCircle className="w-4 h-4" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">{getCategoryIcon(task.category)}</span>
                        <h3 className={`text-lg font-semibold ${
                          task.completedAt ? 'line-through text-gray-500' : 'text-gray-800'
                        }`}>
                          {task.title}
                        </h3>
                      </div>
                      {task.description && (
                        <p className="text-gray-600 mb-3">{task.description}</p>
                      )}
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {task.estimatedDuration}分钟
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          {getPriorityText(task.priority)}优先级
                        </div>
                        {task.dueDate && (
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {task.dueDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm">
                          <span className="font-medium">💡 {userMBTI} 建议：</span>
                          {getMBTITaskAdvice(userMBTI, task)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <select
                      value={task.gtdStage || GTDStage.INBOX}
                      onChange={e => setStage(task.id, e.target.value as GTDStage)}
                      className="px-2 py-1 border rounded text-sm text-gray-700"
                    >
                      {stageOrder.map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">暂无任务</h3>
                <p className="text-gray-500">
                  {Object.keys(filter).length > 0 ? '尝试调整筛选条件' : '点击上方按钮添加您的第一个任务'}
                </p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'quadrants' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4 border-2 border-red-300">
              <div className="font-semibold text-red-700 mb-2">重要且紧急</div>
              <div className="space-y-3">
                {quadrants.urgentImportant.map(t => (
                  <div key={t.id} className="p-3 rounded-lg bg-red-50">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-800">{t.title}</div>
                      <button onClick={() => toggleTaskComplete(t.id)} className="text-sm text-red-700">完成</button>
                    </div>
                    <div className="text-xs text-gray-600">{t.description}</div>
                  </div>
                ))}
                {quadrants.urgentImportant.length === 0 && <div className="text-sm text-gray-500">暂无</div>}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-2 border-yellow-300">
              <div className="font-semibold text-yellow-700 mb-2">不重要但紧急</div>
              <div className="space-y-3">
                {quadrants.urgentNotImportant.map(t => (
                  <div key={t.id} className="p-3 rounded-lg bg-yellow-50">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-800">{t.title}</div>
                      <button onClick={() => toggleTaskComplete(t.id)} className="text-sm text-yellow-700">完成</button>
                    </div>
                    <div className="text-xs text-gray-600">{t.description}</div>
                  </div>
                ))}
                {quadrants.urgentNotImportant.length === 0 && <div className="text-sm text-gray-500">暂无</div>}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-2 border-blue-300">
              <div className="font-semibold text-blue-700 mb-2">重要但不紧急</div>
              <div className="space-y-3">
                {quadrants.notUrgentImportant.map(t => (
                  <div key={t.id} className="p-3 rounded-lg bg-blue-50">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-800">{t.title}</div>
                      <button onClick={() => toggleTaskComplete(t.id)} className="text-sm text-blue-700">完成</button>
                    </div>
                    <div className="text-xs text-gray-600">{t.description}</div>
                  </div>
                ))}
                {quadrants.notUrgentImportant.length === 0 && <div className="text-sm text-gray-500">暂无</div>}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 border-2 border-green-300">
              <div className="font-semibold text-green-700 mb-2">不重要且不紧急</div>
              <div className="space-y-3">
                {quadrants.notUrgentNotImportant.map(t => (
                  <div key={t.id} className="p-3 rounded-lg bg-green-50">
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-gray-800">{t.title}</div>
                      <button onClick={() => toggleTaskComplete(t.id)} className="text-sm text-green-700">完成</button>
                    </div>
                    <div className="text-xs text-gray-600">{t.description}</div>
                  </div>
                ))}
                {quadrants.notUrgentNotImportant.length === 0 && <div className="text-sm text-gray-500">暂无</div>}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'gtd' && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[GTDStage.INBOX, GTDStage.CLARIFY, GTDStage.ORGANIZE, GTDStage.EXECUTE, GTDStage.REVIEW].map(stage => (
              <div key={stage} className="bg-white rounded-xl shadow-md p-4">
                <div className="font-semibold text-gray-800 mb-2">{stage}</div>
                <div className="space-y-3">
                  {tasksByStage(stage).map(t => (
                    <div key={t.id} className="p-3 rounded-lg bg-gray-50">
                      <div className="font-medium text-gray-800 mb-1">{t.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{t.description}</div>
                      <div className="flex items-center space-x-2">
                        <button onClick={() => moveStage(t.id, 'prev')} className="px-2 py-1 text-xs bg-gray-200 rounded">上一步</button>
                        <button onClick={() => moveStage(t.id, 'next')} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">下一步</button>
                        <button onClick={() => toggleTaskComplete(t.id)} className="px-2 py-1 text-xs bg-green-600 text-white rounded">完成</button>
                      </div>
                    </div>
                  ))}
                  {tasksByStage(stage).length === 0 && <div className="text-sm text-gray-500">暂无</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        {editingTask && (
          <div className="fixed inset-0 bg-black/30 flex items-end md:items-center justify-center z-50">
            <div className="bg-white w-full md:max-w-lg rounded-t-2xl md:rounded-2xl p-4">
              <div className="text-base font-semibold text-gray-900 mb-3">编辑任务</div>
              <div className="grid grid-cols-1 gap-3 mb-4">
                <input
                  className="px-3 py-2 border rounded-lg text-sm"
                  placeholder="标题"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <textarea
                  className="px-3 py-2 border rounded-lg text-sm"
                  placeholder="描述"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="px-3 py-2 border rounded-lg text-sm"
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as TaskCategory)}
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select
                    className="px-3 py-2 border rounded-lg text-sm"
                    value={editPriority}
                    onChange={e => setEditPriority(e.target.value as TaskPriority)}
                  >
                    {priorities.map(p => (
                      <option key={p} value={p}>{getPriorityText(p)}优先级</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min={0}
                    className="px-3 py-2 border rounded-lg text-sm"
                    placeholder="预计时长（分钟）"
                    value={editDuration}
                    onChange={e => setEditDuration(Number(e.target.value))}
                  />
                  <input
                    type="date"
                    className="px-3 py-2 border rounded-lg text-sm"
                    value={editDueDateStr}
                    onChange={e => setEditDueDateStr(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button onClick={() => setEditingTask(null)} className="px-4 py-2 text-sm text-gray-600">取消</button>
                <button onClick={saveEdit} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg">保存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
