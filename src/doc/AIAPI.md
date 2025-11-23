# 文档目标
为其他项目提供一份可直接对接的 AI 接口文档，涵盖地址、鉴权、请求/响应格式、示例代码、错误与安全建议，以及跨项目接入指引。

## 当前实现概况
- 前端直接调用一个外部 AI HTTP 端点；未发现本仓库后端接口或 WebSocket/SSE 流式实现。
- 基本调用位于 `src/pages/ChatPage.tsx` 的 `sendMessage`，使用原生 `fetch`。

## 基础信息
- Base URL: `https://api.kkyyxx.xyz`
- 端点: `POST /v1/responses`
- 鉴权: `Authorization: Bearer <API_KEY>`（Bearer Token）
- Content-Type: `application/json`
- 模型字段: 示例 `gpt-4.1-mini`

## 请求规范
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer <API_KEY>`
- Body 参数:
  - `model`: 字符串，示例 `gpt-4.1-mini`
  - `input`: 字符串，用户输入内容
- 示例：
  - curl:
    ```bash
    curl -X POST \
      "https://api.kkyyxx.xyz/v1/responses" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <API_KEY>" \
      -d '{"model":"gpt-4.1-mini","input":"你好"}'
    ```
  - JavaScript (fetch):
    ```js
    fetch("https://api.kkyyxx.xyz/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.VITE_AI_API_KEY
      },
      body: JSON.stringify({ model: "gpt-4.1-mini", input: "你好" })
    })
    ```
  - Python (requests):
    ```py
    import requests
    r = requests.post(
      "https://api.kkyyxx.xyz/v1/responses",
      headers={
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
      },
      json={"model": "gpt-4.1-mini", "input": "你好"}
    )
    print(r.json())
    ```

## 响应规范
- 可能返回的字段形态（参考现有解析逻辑）：
  - `data.output` 为数组，元素形如：`{ type: 'message', content: [{ type: 'output_text', text: string }] }`
  - 或 `data.output_text` 为字符串
  - 或 `data.output[0].content[0].text` 为字符串
  - 或 `data.text` 为字符串
  - 或 `data.text.text` 为字符串
- 文本抽取建议：按上述优先级依次尝试，取首个存在的文本。
- 示例响应：
  ```json
  {
    "output": [
      {
        "type": "message",
        "content": [
          { "type": "output_text", "text": "你好！有什么可以帮你？" }
        ]
      }
    ]
  }
  ```

## 错误与重试
- 非 2xx：返回 HTTP 错误状态；建议统一映射为用户可读提示并记录日志。
- 重试：当前未内置；建议对 429/5xx 使用指数退避重试（最多 3 次）。
- 超时：建议客户端引入 `AbortController` 或请求库的超时设置（如 10–15s）。

## 流式/实时
- 现状：未启用流式（SSE/WebSocket）；直接 `response.json()`。
- 若需流式：建议采用 SSE（`text/event-stream`）或 WebSocket，并提供增量 delta 文本。

## 速率限制与配额
- 现状：未实现客户端限流。
- 建议：在调用侧加入简单令牌桶/队列防抖；对批量请求提供队列与并发上限。

## 安全与配置
- 切勿在前端硬编码 API Key；统一使用环境变量：
  - `VITE_AI_BASE_URL=https://api.kkyyxx.xyz`
  - `VITE_AI_API_KEY=<你的Key>`
- 前端读取：`import.meta.env.VITE_AI_BASE_URL` 与 `import.meta.env.VITE_AI_API_KEY`。
- 跨域：如需代理，建议在后端/Dev 服务器配置反向代理，避免暴露密钥。

## 跨项目集成指引
- 快速接入步骤：
  - 配置环境变量（或后端保管密钥并提供中转端点）。
  - 使用示例代码完成 `POST /v1/responses` 调用。
  - 按响应解析策略抽取文本并展示。
- 语言示例：提供 curl、JavaScript、TypeScript、Python 代码片段。
- 客户端封装建议：抽象一个 `AiClient`，注入 `baseUrl`、`apiKey`，统一错误与超时处理。

## 常见问题（FAQ）
- 模型选择：默认 `gpt-4.1-mini`，是否支持其他模型需以服务端文档为准。
- 长文本限制：根据服务端限制与计费模型决定；建议调用侧实现分段或摘要。
- 编码问题：统一使用 UTF-8；确保 `Content-Type` 设置正确。

## 版本与变更
- 文档版本：`v1.0`（首次对接）
- 变更策略：如端点或响应结构调整，更新版本号并添加“变更日志”。

## 交付方式
- 将输出一份 Markdown 文档（`ai-api.md`），包含以上内容与可复制示例代码。
- 可选增强：提供一个 TypeScript 轻量 SDK（仅在你确认后生成）。

请确认以上文档结构与内容范围；确认后我将生成完整 Markdown 文档并（如需要）提供可复用的最小 SDK 封装。