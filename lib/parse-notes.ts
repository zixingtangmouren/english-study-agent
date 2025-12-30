import { Scene, Word, Grammar, LearningPlan } from "@/types";

/**
 * 解析 Markdown 格式的英语笔记
 */
export function parseNotes(markdown: string): LearningPlan {
  const scenes: Scene[] = [];
  const lines = markdown.split("\n");
  
  let currentScene: Scene | null = null;
  let currentSection: "words" | "grammar" | null = null;
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // 检测二级标题 - 场景名称
    if (trimmedLine.startsWith("## ")) {
      // 保存之前的场景
      if (currentScene) {
        scenes.push(currentScene);
      }
      
      const sceneName = trimmedLine.slice(3).trim();
      currentScene = {
        id: `scene-${scenes.length + 1}`,
        name: sceneName,
        words: [],
        grammar: [],
        completed: false,
        roundCount: 0,
      };
      currentSection = null;
    }
    // 检测三级标题 - 单词或语法
    else if (trimmedLine.startsWith("### ")) {
      const sectionName = trimmedLine.slice(4).trim().toLowerCase();
      if (sectionName.includes("单词") || sectionName.includes("word")) {
        currentSection = "words";
      } else if (sectionName.includes("语法") || sectionName.includes("grammar")) {
        currentSection = "grammar";
      }
    }
    // 解析列表项
    else if ((trimmedLine.startsWith("+ ") || trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) && currentScene) {
      const content = trimmedLine.slice(2).trim();
      
      if (currentSection === "words") {
        const word = parseWord(content);
        if (word) {
          currentScene.words.push(word);
        }
      } else if (currentSection === "grammar") {
        const grammar = parseGrammar(content);
        if (grammar) {
          currentScene.grammar.push(grammar);
        }
      }
    }
  }
  
  // 保存最后一个场景
  if (currentScene) {
    scenes.push(currentScene);
  }
  
  return {
    scenes,
    currentSceneIndex: 0,
    createdAt: new Date().toISOString(),
  };
}

/**
 * 解析单词行
 * 格式: word 中文释义
 */
function parseWord(content: string): Word | null {
  // 尝试匹配 "word 中文" 格式
  const parts = content.split(/\s+/);
  if (parts.length >= 2) {
    const english = parts[0];
    const chinese = parts.slice(1).join(" ");
    return { english, chinese };
  }
  return null;
}

/**
 * 解析语法行
 * 格式: English sentence 中文翻译
 */
function parseGrammar(content: string): Grammar | null {
  // 尝试找到中英文分界点
  // 通常中文字符开始的位置就是翻译
  const chineseMatch = content.match(/[\u4e00-\u9fa5]/);
  
  if (chineseMatch && chineseMatch.index !== undefined) {
    const english = content.slice(0, chineseMatch.index).trim();
    const chinese = content.slice(chineseMatch.index).trim();
    
    if (english && chinese) {
      return { english, chinese };
    }
  }
  
  // 如果没有中文，就把整个内容作为英文
  return { english: content, chinese: "" };
}

/**
 * 生成场景 ID
 */
export function generateSceneId(): string {
  return `scene-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

