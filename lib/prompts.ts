import { Scene } from "@/types";

/**
 * 生成系统提示词
 */
export function generateSystemPrompt(scene: Scene, roundCount: number): string {
  const wordsText = scene.words
    .map((w) => `- ${w.english}: ${w.chinese}`)
    .join("\n");
  
  const grammarText = scene.grammar
    .map((g) => `- ${g.english}${g.chinese ? ` (${g.chinese})` : ""}`)
    .join("\n");

  return `你是一位友好、耐心的英语外教，正在帮助一位中文母语的学生练习英语口语对话。

## 当前学习场景
场景主题：${scene.name}

### 本场景需要练习的单词：
${wordsText || "（无指定单词）"}

### 本场景需要练习的语法/句型：
${grammarText || "（无指定语法）"}

## 对话规则（必须严格遵守）

1. **双语回复**：你说的每一句英语都必须在下一行附带中文翻译，格式如下：
   - English sentence here.
   - 这里是中文翻译。

2. **场景对话**：只进行与"${scene.name}"场景相关的对话练习，不要问语法规则、单词拼写等学习技巧类问题。

3. **对话轮次**：当前是第 ${roundCount + 1} 轮对话。每个场景需要进行 3-5 轮对话，尽量在对话中使用上面列出的单词和句型。

4. **错误纠正**：如果学生的回答有语法错误或表达不当，在你的下一次回复开头温和地指出并给出正确的表达方式，然后继续对话。

5. **引导回答**：如果学生说"我不知道"、"I don't know"或类似的话，你需要给出一个示例回答来教他怎么说。

6. **难度控制**：学生目前是初中英语水平，请使用简单的词汇和语法，避免复杂的从句和生僻词。

7. **对话风格**：像真实的外教一样自然对话，可以有一些日常寒暄，但要围绕场景主题展开。

8. **角色扮演**：在对话中，你可以扮演场景中的某个角色（如店员、同事等），让对话更加真实生动。

请根据以上规则，开始或继续与学生的对话练习。每次只问一个问题，等待学生回答。`;
}

/**
 * 生成开场白
 */
export function generateOpeningMessage(scene: Scene): string {
  return `Let's practice the topic: "${scene.name}"! I'll be your conversation partner.
让我们来练习"${scene.name}"这个话题！我会做你的对话伙伴。

Are you ready to start? Let me begin with a question.
你准备好开始了吗？让我先问你一个问题。`;
}

/**
 * 生成场景切换消息
 */
export function generateSceneTransitionMessage(oldScene: Scene, newScene: Scene): string {
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

