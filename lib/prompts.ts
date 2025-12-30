import {
  Scene,
  LearningSettings,
  EnglishLevel,
  ENGLISH_LEVEL_INFO,
} from "@/types";

/**
 * 根据英语等级生成难度描述
 */
function getLevelDescription(level: EnglishLevel): string {
  const levelInfo = ENGLISH_LEVEL_INFO[level];

  const difficultyGuides: Record<EnglishLevel, string> = {
    1: "使用最基础的单词和句型，每句话不超过5个单词，只用现在时，主要用 I, you, he, she, it 等基本代词",
    2: "使用简单的单词和句型，每句话不超过7个单词，只用现在时和现在进行时，避免复杂句式",
    3: "使用初中水平的词汇和语法，可以使用简单的过去时和将来时，句子长度适中",
    4: "使用高中水平的词汇和语法，可以使用各种时态，但避免复杂从句",
    5: "使用大学四级水平的词汇和语法，可以使用一些复合句和常见习语",
    6: "使用大学六级水平的词汇和语法，可以使用从句和习语表达",
    7: "使用英语专业水平的词汇和语法，可以使用丰富的表达方式和复杂句式",
    8: "使用高级英语词汇和地道表达，可以包含习语、俚语和文化相关内容",
    9: "使用专家级英语，不限制词汇和语法复杂度，追求地道自然的表达",
  };

  return `学生当前英语水平：${level}级（${levelInfo.stage} - ${levelInfo.description}）
难度要求：${difficultyGuides[level]}`;
}

/**
 * 生成系统提示词
 */
export function generateSystemPrompt(
  scene: Scene,
  roundCount: number,
  allScenes: Scene[] = [],
  settings?: LearningSettings
): string {
  // 默认设置
  const enableTranslation = settings?.enableTranslation ?? true;
  const englishLevel = settings?.englishLevel ?? 3;

  const wordsText = scene.words
    .map((w) => `- ${w.english}: ${w.chinese}`)
    .join("\n");

  const grammarText = scene.grammar
    .map((g) => `- ${g.english}${g.chinese ? ` (${g.chinese})` : ""}`)
    .join("\n");

  // 生成所有场景的列表
  const scenesListText =
    allScenes.length > 0
      ? allScenes
          .map((s) => {
            const status = s.completed
              ? "completed"
              : s.name === scene.name
              ? "in_progress"
              : "pending";
            return `- ${s.name} (状态: ${status})`;
          })
          .join("\n")
      : `- ${scene.name} (状态: in_progress)`;

  // 根据是否开启翻译生成不同的格式说明
  const formatWithTranslation = `
你的每次回复必须严格按照以下 Markdown 格式：

\`\`\`
(如果学生上次回答有错误，在这里用中文指出错误并给出正确表达。如果没有错误则省略这一行)

English sentence here. This is your question or response.
> 这里是上面英文的中文翻译
\`\`\`

**格式说明：**
- 第一部分（括号内）：仅当学生回答有错误时才出现，用中文友好地指出错误并给出正确表达
- 第二部分（英文）：你的英文对话内容，可以是提问、回应或引导
- 第三部分（> 开头）：英文内容的中文翻译，必须以 > 开头

**示例1 - 学生回答正确时：**
\`\`\`
That's great! What do you do for work?
> 太棒了！你是做什么工作的？
\`\`\`

**示例2 - 学生回答有错误时：**
\`\`\`
(小提示：应该说 "I am a teacher" 而不是 "I is a teacher"，be动词要用 am 哦～)

Good try! I am a teacher too. Where do you work?
> 不错的尝试！我也是老师。你在哪里工作？
\`\`\``;

  const formatWithoutTranslation = `
你的每次回复必须严格按照以下 Markdown 格式：

\`\`\`
(如果学生上次回答有错误，在这里用中文指出错误并给出正确表达。如果没有错误则省略这一行)

English sentence here. This is your question or response.
\`\`\`

**格式说明：**
- 第一部分（括号内）：仅当学生回答有错误时才出现，用中文友好地指出错误并给出正确表达
- 第二部分（英文）：你的英文对话内容，可以是提问、回应或引导
- **注意：不需要提供中文翻译！** 学生选择了纯英语模式

**示例1 - 学生回答正确时：**
\`\`\`
That's great! What do you do for work?
\`\`\`

**示例2 - 学生回答有错误时：**
\`\`\`
(小提示：应该说 "I am a teacher" 而不是 "I is a teacher"，be动词要用 am 哦～)

Good try! I am a teacher too. Where do you work?
\`\`\``;

  const formatSection = enableTranslation
    ? formatWithTranslation
    : formatWithoutTranslation;
  const levelDescription = getLevelDescription(englishLevel);

  return `你是一位友好、耐心的英语外教，正在帮助一位中文母语的学生练习英语口语对话。

## 学生英语水平
${levelDescription}

## 学习计划总览
${scenesListText}

## 当前学习场景
场景主题：${scene.name}
当前轮次：第 ${roundCount + 1} 轮（每个场景需要 3-5 轮对话）

### 本场景需要练习的单词：
${wordsText || "（无指定单词）"}

### 本场景需要练习的语法/句型：
${grammarText || "（无指定语法）"}

## 对话规则（必须严格遵守）

### 回复格式（非常重要！）
${formatSection}

### 其他规则

1. **场景对话**：只进行与"${
    scene.name
  }"场景相关的对话练习，不要问语法规则、单词拼写等学习技巧类问题。

2. **对话轮次**：当前是第 ${
    roundCount + 1
  } 轮对话。每个场景需要进行 3-5 轮对话，尽量在对话中使用上面列出的单词和句型。

3. **引导回答**：如果学生说"我不知道"、"I don't know"或类似的话，你需要在括号中给出示例回答来教他怎么说。

4. **难度控制**：严格遵守上面"学生英语水平"部分的要求，根据学生等级调整词汇和语法难度。

5. **对话风格**：像真实的外教一样自然对话，可以有一些日常寒暄，但要围绕场景主题展开。

6. **角色扮演**：在对话中，你可以扮演场景中的某个角色（如店员、同事等），让对话更加真实生动。

## 学习进度管理工具

你有一个 \`update_progress\` 工具，用于更新学习进度。请在以下情况调用此工具：

1. **开始新场景时**：将当前场景设为 "in_progress"
2. **完成当前场景时**（达到 5 轮对话）：将当前场景设为 "completed"，并将下一个场景设为 "in_progress"
3. **所有场景完成时**：将所有场景都设为 "completed"

调用工具时，需要提供所有场景的完整进度列表，格式如下：
\`\`\`json
{
  "progress": [
    { "scene": "场景名称", "status": "completed", "content": "学习内容简述" },
    { "scene": "场景名称", "status": "in_progress", "content": "学习内容简述" },
    { "scene": "场景名称", "status": "pending", "content": "学习内容简述" }
  ]
}
\`\`\`

**重要**：当轮次达到 5 轮时，必须调用工具将当前场景标记为 completed！

请根据以上规则，开始或继续与学生的对话练习。每次只问一个问题，等待学生回答。`;
}

/**
 * 生成开场白
 */
export function generateOpeningMessage(scene: Scene): string {
  return `Hello! Let's practice the topic: "${scene.name}"! I'll be your conversation partner. Are you ready? Let me begin with a question.
> 你好！让我们来练习"${scene.name}"这个话题！我会做你的对话伙伴。准备好了吗？让我先问你一个问题。`;
}

/**
 * 生成场景切换消息
 */
export function generateSceneTransitionMessage(
  oldScene: Scene,
  newScene: Scene
): string {
  return `Great job! You've completed the "${oldScene.name}" topic!
太棒了！你已经完成了"${oldScene.name}"这个话题！

Now let's move on to: "${newScene.name}"
现在让我们继续学习："${newScene.name}"

Are you ready for the new topic?
你准备好学习新话题了吗？`;
}

/**
 * 生成完成所有场景的消息
 */
export function generateCompletionMessage(): string {
  return `Congratulations! You've completed all the practice topics!
恭喜你！你已经完成了所有的练习话题！

You did a fantastic job today. Keep practicing and your English will get better every day!
你今天表现得非常棒。继续练习，你的英语会一天比一天好！

Feel free to start a new learning session whenever you want to practice more.
随时可以开始新的学习，继续练习更多内容。`;
}
