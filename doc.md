这个是一个新项目。我的需求是，需要你帮我使用 NextJS 实现一个前后端一体的英语学习智能体的项目。

## 需求文档

只需要一个聊天界面，可以参考 cursor、gpt 的对话界面。在进行对话前， 需要用户输入一份英语笔记文档，它格式大致如下：

- 二级标题对应的是具体的对话场景
- 三级标题是这个场景学习到的单词和语法

```makrdown
## 介绍自己的职业
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
+ What color shirt  do you like? 你喜欢什么颜色的衬衫
+ I like blue shirts.
+ But something inexpensive. I don`t want to owe you  too much. 但是不要太贵，我不想欠你太多。
+ happy to help 乐意帮助
+ That can`t be right 这不可能吧
+ How much is this shirt?
+ This black wallet is nice
```

在用输入完文档以后，AI 将扮演一位英语外教，跟用户进行对话。对话要求如下：

1. 外教说的话，必须有带有中文翻译，例如：

- Hello，I am your teacher
- 你好，我是你的老师

2. 如果发现用户回答的不是很好，或者错误的地方，需要再下一次对话前提示用户。

3. 每个场景，需要进行 3 ~ 5 轮次的对话。提问需要尽可能包含场景中的单词和语法。如果某一个场景已经达到了 5 次，就可以切换到下一个场景了。每一次提问，需要等到用户回答后才可以进行下一次对话。

4. 如果用户回答了 “我不知道”，你需要教他怎么回答。

5. 注意 AI 的核心任务是模拟场景对话，只能提问关于场景对话的内容，不要问一些关于什么语法、单词技巧的问题。

6. 用户目前的英语水平是初中级别的，所以尽快不要出现太复杂的语法和单词。

## 技术方案

技术选型：NextJS 一把梭哈

Agent 设计模式：Plan 模式。需要先根据用户输入的笔记，生成一份学习的 TODO 计划。放置在对话界面的顶部，完成一个场景勾选一个。

模型使用的是 deepseek.
