## 问题定位
- 根因：右侧文案硬编码为 `4`，导致始终显示 `/ 4`。
- 位置：`src/components/mbti/MBTITest.tsx:149` 显示 `维度 {currentQuestion + 1} / 4`。
- 正确数据源：总题数为 `mbtiQuestions.length`（当前为 12），已在组件中用于进度与索引（如 `src/components/mbti/MBTITest.tsx:112-114`）。

## 修复方案
- 将硬编码 `4` 改为动态的题目总数：
  - 从 `维度 {currentQuestion + 1} / 4`
  - 改为 `维度 {currentQuestion + 1} / {mbtiQuestions.length}`。
- 说明：用户希望显示 12，因此以“题目总数”作为右侧计数更符合期望；同时避免硬编码，随数据变化自动正确。
- 可选（若未来确实需要“维度进度”）：使用唯一维度数 `new Set(mbtiQuestions.map(q => q.dimension)).size`（当前为 4）。本次按用户要求不修改文案，只修正数字来源。

## 验证步骤
- 启动开发环境并打开 MBTI 测试页。
- 检查右侧显示为 `维度 1 / 12`，翻题后应按 `currentQuestion + 1` 变化，始终以 `/ 12` 为总数。
- 回归：确认其它进度显示（如 `题目 {currentQuestion + 1} / {mbtiQuestions.length}`）保持一致，无样式或状态副作用。

## 影响范围
- 仅改动 `src/components/mbti/MBTITest.tsx` 的一个文本插值；不影响题目逻辑、评分或维度计算。