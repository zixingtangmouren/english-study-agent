"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowRight, Sparkles, Settings } from "lucide-react";
import { EnglishLevel, ENGLISH_LEVEL_INFO, LearningSettings } from "@/types";
import { getSettings, saveSettings } from "@/lib/storage";

const exampleNotes = `## 介绍自己的职业
### 单词
+ pen 笔
+ door 门
+ window 窗
+ apartment 公寓
+ bookstore 书店
+ during 工作日
+ studies 学习、学业、研究
+ homework 家庭作业
+ forget 忘记
+ mall 商场

### 语法
+ she works at xxx 她在 xx 工作
+ what do you do for work? 你做什么工作的
+ Are you a developer? 你是一个程序员吗？
+ Is your friend a taxi driver?
+ I need go to work

## 谈论衣物和价格
### 单词
+ jacket 夹克
+ hat 帽子
+ shoes 鞋
+ pants 裤子
+ dresss 裙子
+ dollars 美元
+ coat 外套
+ customers 顾客

### 语法
+ What color shirt do you like? 你喜欢什么颜色的衬衫
+ I like blue shirts.
+ But something inexpensive. I don\`t want to owe you too much. 但是不要太贵，我不想欠你太多。
+ happy to help 乐意帮助
+ That can\`t be right 这不可能吧
+ How much is this shirt?
+ This black wallet is nice`;

export default function Home() {
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<LearningSettings>({
    enableTranslation: true,
    englishLevel: 3,
  });
  const router = useRouter();

  // 加载保存的设置
  useEffect(() => {
    const savedSettings = getSettings();
    setSettings(savedSettings);
  }, []);

  const handleSettingsChange = (newSettings: Partial<LearningSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleSubmit = async () => {
    if (!notes.trim()) return;
    
    setIsLoading(true);
    
    // 保存笔记到 localStorage
    localStorage.setItem("english-notes", notes);
    // 确保设置已保存
    saveSettings(settings);
    
    // 跳转到对话页面
    router.push("/chat");
  };

  const loadExample = () => {
    setNotes(exampleNotes);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            英语学习智能体
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            输入您的英语笔记，AI 外教将根据场景与您进行对话练习
          </p>
        </div>

        {/* Settings Panel */}
        <div className="p-4 rounded-xl border border-border bg-card/50 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Settings className="w-4 h-4 text-muted-foreground" />
            学习设置
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 翻译开关 */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
              <div>
                <div className="text-sm font-medium">开启翻译</div>
                <div className="text-xs text-muted-foreground">AI 回复时提供中文翻译</div>
              </div>
              <button
                onClick={() => handleSettingsChange({ enableTranslation: !settings.enableTranslation })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.enableTranslation ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.enableTranslation ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </div>
            
            {/* 英语等级选择 */}
            <div className="p-3 rounded-lg bg-background border border-border">
              <div className="text-sm font-medium mb-2">英语水平</div>
              <select
                value={settings.englishLevel}
                onChange={(e) => handleSettingsChange({ englishLevel: Number(e.target.value) as EnglishLevel })}
                className="w-full px-3 py-2 rounded-md border border-border bg-card text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {([1, 2, 3, 4, 5, 6, 7, 8, 9] as EnglishLevel[]).map((level) => (
                  <option key={level} value={level}>
                    {level}级 - {ENGLISH_LEVEL_INFO[level].stage} ({ENGLISH_LEVEL_INFO[level].description})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notes Input */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="notes" className="text-sm font-medium">
              英语笔记
            </label>
            <button
              onClick={loadExample}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              加载示例
            </button>
          </div>
          
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={`请输入您的英语笔记，格式如下：

## 场景名称（二级标题）
### 单词
+ word 中文释义
+ word2 中文释义

### 语法
+ English sentence 中文翻译
+ Another sentence 翻译`}
            className="w-full h-80 p-4 rounded-xl border border-border bg-card text-card-foreground 
                       placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 
                       focus:ring-primary/20 focus:border-primary transition-all"
          />
          
          <p className="text-xs text-muted-foreground">
            提示：使用 Markdown 格式，二级标题 (##) 表示场景，三级标题 (###) 下的内容为单词或语法
          </p>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!notes.trim() || isLoading}
          className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground font-medium
                     flex items-center justify-center gap-2 hover:bg-primary/90 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              开始学习
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </main>
  );
}

