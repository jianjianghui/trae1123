## 目标
- 将“AI对话”从本地模拟改为真实外部 AI API 调用，按 `src/doc/AIAPI.md` 的规范完成鉴权、请求、响应解析与错误处理。
- 提供一份系统提示词，用于自动区分“列入任务”与“为用户排忧解答”，并规范输出格式与行为。

## 现状综述
- 当前“AI对话”标签展示的是任务解析组件：`src/components/tasks/AITaskParser.tsx:16` 通过 `AIService.parseTask` 本地模拟，无外部 API 交互。
- 本地模拟服务在 `src/services/aiService.ts:5`，仅做字符串规则匹配与 MBTI 建议，不涉及网络。
- 页面入口在 `src/App.tsx`，`activeTab === 'parser'` 时渲染 `AITaskParser`（`src/App.tsx:114`）。
- 代码中未发现 `ChatPage.tsx`、`sendMessage`、环境变量读取。

## 拟实施改动
1) 新增 API 客户端
- 文件：`src/services/aiClient.ts`
- 内容：导出 `AiClient`，负责：
  - 读取 `import.meta.env.VITE_AI_BASE_URL` 与 `import.meta.env.VITE_AI_API_KEY`
  - 方法 `respond(input: string, opts?: { model?: string; signal?: AbortSignal })`
  - 使用 `fetch POST /v1/responses`，鉴权头 `Authorization: Bearer <API_KEY>`，`Content-Type: application/json`
  - 指数退避重试：对 429/5xx 最多 3 次（1000ms → 2000ms → 4000ms）
  - 超时：默认 15s，基于 `AbortController`
  - 响应解析：按文档优先级提取文本：
    - `data.output[0].content[0].text` → `data.output_text` → `data.text` → `data.text.text`
  - 返回：纯文本字符串；失败抛出带用户友好信息的错误

2) 新增对话页面
- 文件：`src/pages/ChatPage.tsx`
- 内容：
  - 消息列表（用户/助手气泡），输入框，发送按钮，停止按钮（中止 `AbortController`）
  - 发送时将“系统提示词 + 用户消息”合并为 `input` 调用 `AiClient.respond`
  - 支持两种模式显示：
    - `[[MODE: HELP]]`：显示普通解答
    - `[[MODE: TASK]]`：显示任务方案卡片（标题/理由/验收点/步骤），提供“添加到任务管理”的按钮（首版可先展示卡片，不改动 `TaskManager` 的内部状态）

3) 入口替换
- 修改 `src/App.tsx`：`activeTab === 'parser'` 时渲染新的 `ChatPage`，保留 `AITaskParser` 以备后续并入任务页或在 Chat 中作为次级功能。

4) 环境变量
- 需要在运行环境设置：
  - `VITE_AI_BASE_URL=https://api.kkyyxx.xyz`
  - `VITE_AI_API_KEY=<你的Key>`
  - 可选：`VITE_AI_MODEL=gpt-4.1-mini`
- 客户端仅读取环境变量；不在前端硬编码密钥。

5) 响应与错误处理
- 非 2xx：统一映射到“请求失败（状态码xxx）”，建议重试或稍后再试
- 网络错误/超时：明确提示“网络异常或超时”，提供重试按钮
- 日志：仅在控制台打印必要的错误信息，不暴露密钥与完整响应

## 系统提示词（用于发送到模型）
请将以下文本作为“系统提示词”前缀拼接到用户输入，合并为单一 `input` 字符串：

— 开始（系统提示词） —
你是项目中的资深软件工程助理，负责两类输出：
1) [[MODE: TASK]] 当用户意图是可执行的产品/代码/配置改动、修复或实现请求时
2) [[MODE: HELP]] 当用户主要在咨询、理解、比较、建议、排查思路时

决策准则：
- 满足任一条件则判定为任务（TASK）：
  - 存在明确的改动动词：实现/新增/修复/改进/重构/接入/部署/配置/集成/替换/迁移/优化
  - 包含代码片段、文件路径、接口、参数、验收标准、里程碑或对页面/组件的具体改动说明
  - 指定了预期结果或交付物（页面、接口、功能、文档、测试）
- 否则为帮助（HELP）：
  - 以“为什么/如何/能否/是什么/对比/建议/思路/排查”为主的咨询与解答
  - 需求尚不清晰，缺少可执行边界时先帮助澄清与给出方案
- 混合情况：若既有咨询又有明确执行意图，先简要解答关键疑问，再输出 [[MODE: TASK]] 任务方案

输出规范：
- [[MODE: HELP]]：
  - 使用简洁、结构化要点回答；必要时给出代码引用如 `file_path:line_number`
  - 不做无谓铺陈；仅给可操作的建议、原理解释、替代方案、风险提示
- [[MODE: TASK]]：只输出一段 JSON（用```json代码块包裹），字段：
  - `title`：一句话任务标题
  - `reasoning`：为何要做，约 1–2 句
  - `acceptance`：数组，3–6 个可验证的验收点
  - `steps`：数组，4–8 个实施步骤（文件路径、接口、关键函数名尽量给出）
  - `risks`：数组，可能风险与规避
  - `references`：数组，可选的代码位置（如 `src/services/aiService.ts:5`）或外部链接
- 风格：
  - 采用中文，精炼要点，默认不使用重格式化元素，除非确有助于理解
  - 安全：不输出或记录任何密钥；如需配置，提示使用环境变量
  - 默认模型语气：专业、协作、以解决问题为中心

代码引用规范：
- 如需引用本仓库现有代码，使用 `file_path:line_number` 格式，例如：
  - `src/services/aiService.ts:5`（AI 解析入口）
  - `src/components/tasks/AITaskParser.tsx:16`（按钮触发逻辑）
  - `src/App.tsx:114`（AI对话入口位置）

示例：
- 用户：“接入外部 AI，替换当前解析” → 输出 [[MODE: TASK]] 并给出任务 JSON
- 用户：“如何处理 429 错误？” → 输出 [[MODE: HELP]] 给出退避与重试建议
— 结束（系统提示词） —

## Chat 侧发送策略
- 将上述系统提示词与用户消息按“系统提示词\n\n用户消息”拼为 `input`
- 默认模型：`gpt-4.1-mini`
- 每次仅发送最新消息文本（首版不做上下文拼接）；后续需要上下文时再按会话历史拼接

## UI 交互设计
- 消息气泡：左侧助手、右侧用户；显示时间与失败状态
- 任务卡片：当响应以 [[MODE: TASK]] 开头且包含 JSON 代码块时，解析并以卡片展示，可后续支持“一键添加到任务管理”
- 控件：发送、停止、重试；发送过程显示 loading

## 验证方案
- 正常流：发送“如何处理 429 错误？”应返回 [[MODE: HELP]] 要点
- 任务流：发送“接入外部 AI，修改 parser 页为 Chat”应返回 [[MODE: TASK]] JSON
- 错误流：断网/错误密钥，提示用户可读错误并可重试
- 响应解析：针对文档给出的多种响应形态做单元测试（可后续补充）

## 交付
- 代码改动：`aiClient.ts`、`ChatPage.tsx`、`App.tsx` 替换入口
- 配置：环境变量（由你提供 Key）
- 文档：不新增文档文件；在代码中保持清晰结构与可读性

请确认以上计划与系统提示词。我收到确认后将开始实现、联调并在本地页面验证。