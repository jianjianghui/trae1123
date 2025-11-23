import { useEffect, useMemo, useRef, useState } from 'react';
import { Send, StopCircle, RefreshCw, Bot, User } from 'lucide-react';
import { aiClient } from '../services/aiClient';

type Message = { role: 'user' | 'assistant'; content: string; ts: number; task?: TaskPlan | null };
type TaskPlan = { title: string; reasoning: string; acceptance: string[]; steps: string[]; risks?: string[]; references?: string[] };

function buildSystemPrompt(mbti?: string) {
  const header = `你是资深任务管理助理，专注个人与团队的任务规划与执行。你仅围绕任务管理领域进行解答或输出可执行方案。`;
  const scope = `领域覆盖：四象限法（重要/紧急）、GTD（收集/澄清/组织/执行/回顾）、番茄钟配置与节奏、优先级/到期日/场景分类、进度与复盘。`;
  const mbtiLine = mbti ? `用户MBTI：${mbti}。你的建议需自动结合该类型的思维与行为偏好。` : `如用户提供MBTI类型，请结合其偏好给出陪伴式建议。`;
  const modes = `输出模式：\n1) [[MODE: TASK]] 当用户提出明确的任务改动/计划制定/分解执行/优先级与到期设置/四象限归类/GTD流转/番茄钟配置等可执行请求时\n2) [[MODE: HELP]] 当用户进行咨询、比较、排查、方法选择或需要澄清边界时`;
  const decide = `判定：出现“添加/拆分/制定/安排/规划/配置/归类/流转/优化/执行/验收”及具体任务要素（标题/优先级/到期/时长/场景）视为[[MODE: TASK]]；否则[[MODE: HELP]]。若混合，先简答关键疑问，再给[[MODE: TASK]]。`;
  const help = `[[MODE: HELP]] 规范：用简洁要点回答，给出可操作建议、方法对比、注意事项与风险，必要时引用仓库位置如 src/components/tasks/TaskManager.tsx:178。`;
  const task = `[[MODE: TASK]] 规范：只输出一段JSON（使用\`\`\`json代码块），字段：\n- title：一句话任务标题\n- reasoning：为何要做（1–2句）\n- acceptance：3–6个可验证验收点\n- steps：4–8个实施步骤（含四象限/GTD/番茄钟/优先级/到期等具体动作）\n- risks：可能风险与规避\n- references：相关代码位置或链接（如 src/components/tasks/TaskManager.tsx:178）`;
  const tone = `风格：中文、清晰、以执行为中心；不输出或记录任何密钥；如需配置，提示使用环境变量。`;
  return [header, scope, mbtiLine, modes, decide, help, task, tone].join('\n');
}

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

export default function ChatPage({ mbti }: { mbti?: string }) {
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
      const combined = `${buildSystemPrompt(mbti)}\n\n${userMsg.content}`;
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
