import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, StopCircle, RefreshCw, Bot, User } from 'lucide-react';
import { aiClient } from '../services/aiClient';

type Message = { role: 'user' | 'assistant'; content: string; ts: number; task?: TaskPlan | null };
type TaskPlan = { title: string; reasoning: string; acceptance: string[]; steps: string[]; risks?: string[]; references?: string[] };

const SYSTEM_PROMPT = `你是项目中的资深软件工程助理，负责两类输出：\n1) [[MODE: TASK]] 当用户意图是可执行的产品/代码/配置改动、修复或实现请求时\n2) [[MODE: HELP]] 当用户主要在咨询、理解、比较、建议、排查思路时\n\n决策准则：\n- 满足任一条件则判定为任务（TASK）：\n  - 存在明确的改动动词：实现/新增/修复/改进/重构/接入/部署/配置/集成/替换/迁移/优化\n  - 包含代码片段、文件路径、接口、参数、验收标准、里程碑或对页面/组件的具体改动说明\n  - 指定了预期结果或交付物（页面、接口、功能、文档、测试）\n- 否则为帮助（HELP）：\n  - 以“为什么/如何/能否/是什么/对比/建议/思路/排查”为主的咨询与解答\n  - 需求尚不清晰，缺少可执行边界时先帮助澄清与给出方案\n- 混合情况：若既有咨询又有明确执行意图，先简要解答关键疑问，再输出 [[MODE: TASK]] 任务方案\n\n输出规范：\n- [[MODE: HELP]]：\n  - 使用简洁、结构化要点回答；必要时给出代码引用如 file_path:line_number\n- [[MODE: TASK]]：只输出一段 JSON（用\`\`\`json 代码块包裹），字段：\n  - title\n  - reasoning\n  - acceptance\n  - steps\n  - risks\n  - references\n\n代码引用示例：src/services/aiService.ts:5, src/components/tasks/AITaskParser.tsx:16, src/App.tsx:114`;

function parseTaskFromText(text: string): TaskPlan | null {
  const mode = text.trim().startsWith('[[MODE: TASK]]');
  if (!mode) return null;
  const codeBlockMatch = text.match(/```json[\s\S]*?```/);
  const raw = codeBlockMatch ? codeBlockMatch[0].replace(/```json/,'').replace(/```/,'').trim() : (() => {
    const braceMatch = text.match(/\{[\s\S]*\}/);
    return braceMatch ? braceMatch[0] : '';
  })();
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    return {
      title: String(obj.title || ''),
      reasoning: String(obj.reasoning || ''),
      acceptance: Array.isArray(obj.acceptance) ? obj.acceptance.map(String) : [],
      steps: Array.isArray(obj.steps) ? obj.steps.map(String) : [],
      risks: Array.isArray(obj.risks) ? obj.risks.map(String) : [],
      references: Array.isArray(obj.references) ? obj.references.map(String) : []
    };
  } catch {
    return null;
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const canSend = useMemo(() => input.trim().length > 0 && !sending, [input, sending]);

  const onSend = async () => {
    if (!canSend) return;
    const userMsg: Message = { role: 'user', content: input.trim(), ts: Date.now(), task: null };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const combined = `${SYSTEM_PROMPT}\n\n${userMsg.content}`;
      const text = await aiClient.respond(combined, { signal: controller.signal });
      const task = parseTaskFromText(text);
      const assistantMsg: Message = { role: 'assistant', content: text, ts: Date.now(), task };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e: any) {
      const errMsg: Message = { role: 'assistant', content: String(e?.message || '请求失败'), ts: Date.now(), task: null };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setSending(false);
      abortRef.current = null;
    }
  };

  const onStop = () => {
    abortRef.current?.abort();
  };

  const onRetry = () => {
    if (messages.length === 0) return;
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUser) return;
    setInput(lastUser.content);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">AI 对话</h1>
          <p className="text-gray-600">接入外部 AI，支持任务识别与咨询解答</p>
        </div>

        <div ref={listRef} className="bg-white rounded-2xl shadow-lg p-4 h-[60vh] overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-20">开始提问或下达任务，我会为你解答或生成任务方案</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <div className="flex items-center mb-2">
                  {m.role === 'assistant' ? <Bot className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
                  <span className="text-xs text-gray-500">{new Date(m.ts).toLocaleTimeString()}</span>
                </div>
                {!m.task && <div className="whitespace-pre-wrap">{m.content}</div>}
                {m.task && (
                  <div className="space-y-3">
                    <div className="font-semibold">{m.task.title}</div>
                    <div className="text-sm text-gray-700">{m.task.reasoning}</div>
                    {m.task.acceptance.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-1">验收点</div>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {m.task.acceptance.map((a, idx) => (<li key={idx}>{a}</li>))}
                        </ul>
                      </div>
                    )}
                    {m.task.steps.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-1">实施步骤</div>
                        <ul className="list-decimal pl-5 text-sm space-y-1">
                          {m.task.steps.map((s, idx) => (<li key={idx}>{s}</li>))}
                        </ul>
                      </div>
                    )}
                    {m.task.risks && m.task.risks.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-1">风险</div>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {m.task.risks.map((r, idx) => (<li key={idx}>{r}</li>))}
                        </ul>
                      </div>
                    )}
                    {m.task.references && m.task.references.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-1">参考</div>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {m.task.references.map((r, idx) => (<li key={idx}>{r}</li>))}
                        </ul>
                      </div>
                    )}
                    <div className="flex justify-end">
                      <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm">添加到任务管理</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 mt-4">
          <div className="flex items-center space-x-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入问题或任务，如：接入外部 AI 并替换解析"
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={onSend}
              disabled={!canSend}
              className={`flex items-center px-4 py-2 rounded-xl font-semibold ${canSend ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              <Send className="w-4 h-4 mr-2" />
              发送
            </button>
            <button
              onClick={onStop}
              disabled={!sending}
              className={`flex items-center px-4 py-2 rounded-xl font-semibold ${sending ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}
            >
              <StopCircle className="w-4 h-4 mr-2" />
              停止
            </button>
            <button
              onClick={onRetry}
              className="flex items-center px-4 py-2 rounded-xl font-semibold bg-gray-100 text-gray-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}