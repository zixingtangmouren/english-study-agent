# English Learning Agent 🎓

一个基于 AI 的英语口语练习智能体，通过场景对话的方式帮助你练习英语。

## 功能特点

- 📝 **自定义学习笔记** - 使用 Markdown 格式定义学习场景、单词和语法
- 🤖 **AI 外教对话** - 基于 DeepSeek 模型进行真实场景对话练习
- 📊 **学习进度管理** - 自动跟踪每个场景的学习进度
- 🌐 **翻译开关** - 可选择是否显示中文翻译
- 📈 **难度等级** - 支持 1-9 级英语水平调节
- 💾 **本地存储** - 学习进度自动保存到浏览器

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/english-agent.git
cd english-agent
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 API Key

在项目根目录创建 `.env.local` 文件：

```bash
DEEPSEEK_API_KEY=your_api_key_here
```

> 💡 你需要一个 [DeepSeek API Key](https://platform.deepseek.com/)

### 4. 启动项目

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 使用方法

### 1. 设置学习参数

在首页可以配置：
- **开启翻译** - AI 回复是否附带中文翻译
- **英语水平** - 选择 1-9 级，AI 会根据等级调整对话难度

### 2. 输入学习笔记

使用 Markdown 格式输入你的英语笔记：

```markdown
## 场景名称（二级标题）

### 单词
+ word 中文释义
+ another 另一个释义

### 语法
+ English sentence 中文翻译
+ Another pattern 另一个句型
```

### 3. 开始对话练习

点击"开始学习"后，AI 外教会根据你的笔记内容：
- 进行场景模拟对话
- 纠正你的语法错误
- 引导你使用新学的单词和句型

## 部署

### 构建生产版本

```bash
npm run build
npm run start
```

默认运行在 `http://localhost:3000/english-agent`

### Nginx 反向代理配置

如果你需要通过 Nginx 将 `/english-agent` 路径转发到此应用：

```nginx
location /english-agent {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### 修改子路径

如果需要更改子路径或使用根路径部署，修改 `next.config.mjs`：

```js
const nextConfig = {
  basePath: "/your-path",  // 修改为你需要的路径，删除此行则使用根路径
};
```

## 技术栈

- [Next.js 14](https://nextjs.org/) - React 全栈框架
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI 集成
- [DeepSeek API](https://platform.deepseek.com/) - 大语言模型
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

## License

MIT

