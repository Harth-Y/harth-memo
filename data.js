window.EXPERIENCE_POSTS = [
  {
    id: "keil-build-troubleshooting",
    title: "Keil 编译失败时的快速排查顺序",
    category: "开发调试",
    date: "2026-05-10",
    readTime: "6 分钟",
    summary: "从 include 路径、宏定义、输出目录权限到增量编译缓存，整理一套优先级明确的检查路径。",
    tags: ["Keil", "编译", "嵌入式"],
    takeaways: ["先看首个 error，不被后续级联错误带偏", "清理 .d 文件常能解决路径残留", "把可复现命令写进帖子底部"],
    content: [
      {
        heading: "适用场景",
        body: "适用于工程突然无法编译、迁移目录后报错、多人协作时 include 路径不一致等情况。优先按首个 error 定位，不要被后续级联错误带偏。",
      },
      {
        heading: "排查流程",
        body: "先确认 include 路径和宏定义，再检查输出目录权限。如果错误发生在增量编译后，优先清理中间文件，尤其是路径缓存相关的 .d 文件。",
      },
      {
        heading: "沉淀建议",
        body: "把可复现命令、错误原文、工程路径变化和最终处理步骤都贴到帖子底部，后续遇到同类问题时可以直接对照。",
      },
    ],
  },
  {
    id: "customer-issue-retrospective",
    title: "把一次客户问题整理成可复用经验帖",
    category: "项目复盘",
    date: "2026-05-08",
    readTime: "4 分钟",
    summary: "把背景、现象、临时解决、根因、长期方案拆开写，避免下次只记得结论忘了条件。",
    tags: ["复盘", "写作", "流程"],
    takeaways: ["标题写清楚触发场景", "保留失败尝试，后续排查很有价值", "结尾补充适用范围"],
    content: [
      {
        heading: "为什么要拆开写",
        body: "很多经验只记录最终结论，时间久了就不知道当时为什么这么做。把背景、现象、临时解决和根因分开，可以避免后续误用。",
      },
      {
        heading: "推荐结构",
        body: "标题写触发场景，正文先放现象和环境，再写排查过程，最后写长期方案和不适用条件。",
      },
      {
        heading: "复用方式",
        body: "同类客户问题可以挂同一组标签，并在帖子之间互相引用，形成可追踪的问题链路。",
      },
    ],
  },
  {
    id: "windows-serial-tool-setup",
    title: "Windows 下串口工具配置记录",
    category: "工具配置",
    date: "2026-05-05",
    readTime: "5 分钟",
    summary: "记录波特率、换行方式、日志保存和常见乱码处理，适合作为新电脑初始化清单。",
    tags: ["Windows", "串口", "工具链"],
    takeaways: ["把截图和配置文件放在同一篇", "标记工具版本，避免界面变化影响复现", "常用参数做成表格"],
    content: [
      {
        heading: "基础配置",
        body: "先记录工具版本、串口号、波特率、数据位、停止位、校验位和换行方式。不同工具默认换行处理不同，最好在帖子里明确说明。",
      },
      {
        heading: "日志保存",
        body: "调试时建议打开自动保存日志，并按日期和设备型号命名。遇到乱码时先确认编码和波特率，再看硬件连接。",
      },
      {
        heading: "迁移新电脑",
        body: "把截图、配置文件和常用参数放在同一篇帖子里，新电脑初始化时可以直接照着配置。",
      },
    ],
  },
  {
    id: "document-tags-guideline",
    title: "资料命名和标签规范草案",
    category: "资料整理",
    date: "2026-05-01",
    readTime: "3 分钟",
    summary: "为芯片资料、demo、客户反馈和内部笔记制定统一命名，让搜索不依赖记忆力。",
    tags: ["标签", "归档", "规范"],
    takeaways: ["标签控制在 2 到 4 个", "文件名包含对象、主题和日期", "废弃资料不要删除，改为 archived"],
    content: [
      {
        heading: "命名规则",
        body: "文件名建议包含对象、主题和日期，例如 chip-demo-rf-20260501。标题不追求短，而是追求以后能搜到。",
      },
      {
        heading: "标签数量",
        body: "每篇帖子控制在 2 到 4 个标签。标签太多会失去筛选价值，太少又无法表达场景。",
      },
      {
        heading: "归档策略",
        body: "废弃资料不要直接删除，移动到 archived 或标记过期原因。这样后续追溯历史时不会丢上下文。",
      },
    ],
  },
];

window.EXPERIENCE_STORE = {
  postsKey: "harth-memo-posts",
  draftsKey: "harth-memo-drafts",
  favoritesKey: "harth-memo-favorites",

  readLocalPosts() {
    try {
      return JSON.parse(localStorage.getItem(this.postsKey) || "[]");
    } catch {
      return [];
    }
  },

  saveLocalPosts(posts) {
    localStorage.setItem(this.postsKey, JSON.stringify(posts));
  },

  getPosts() {
    return [...window.EXPERIENCE_POSTS, ...this.readLocalPosts()].sort((a, b) => b.date.localeCompare(a.date));
  },

  addPost(post) {
    const localPosts = this.readLocalPosts();
    localPosts.unshift(post);
    this.saveLocalPosts(localPosts);
  },

  removePost(id) {
    this.saveLocalPosts(this.readLocalPosts().filter((post) => post.id !== id));
  },

  readDrafts() {
    try {
      return JSON.parse(localStorage.getItem(this.draftsKey) || "[]");
    } catch {
      return [];
    }
  },

  saveDrafts(drafts) {
    localStorage.setItem(this.draftsKey, JSON.stringify(drafts));
  },

  addDraft(draft) {
    const drafts = this.readDrafts();
    drafts.unshift(draft);
    this.saveDrafts(drafts);
  },

  updateDraft(id, draft) {
    const drafts = this.readDrafts().map((item) => (item.id === id ? draft : item));
    this.saveDrafts(drafts);
  },

  removeDraft(id) {
    this.saveDrafts(this.readDrafts().filter((draft) => draft.id !== id));
  },

  readFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(this.favoritesKey) || "[]"));
    } catch {
      return new Set();
    }
  },

  saveFavorites(favorites) {
    localStorage.setItem(this.favoritesKey, JSON.stringify([...favorites]));
  },
};
