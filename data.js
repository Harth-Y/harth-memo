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
  envId: "harth-memo-d6gdb1w0mc5a4c12f",
  adminUid: "2054770578726895617",
  postsKey: "harth-memo-posts",
  draftsKey: "harth-memo-drafts",
  favoritesKey: "harth-memo-favorites",
  userNameKey: "harth-memo-user-name",
  app: null,
  auth: null,
  db: null,
  user: null,
  displayName: "",
  cloudReady: false,
  cloudError: "",

  async init() {
    if (!window.cloudbase) {
      this.cloudError = "CloudBase SDK 未加载，已使用本地模式。";
      return;
    }

    try {
      this.app = window.cloudbase.init({ env: this.envId });
      this.auth = this.app.auth();
      this.db = this.app.database();
      await this.refreshUser();
      if (!this.user) await this.loginAnonymously();
      this.displayName = localStorage.getItem(this.userNameKey) || "";
      this.cloudReady = true;
    } catch (error) {
      this.cloudReady = false;
      this.cloudError = error?.message || "CloudBase 初始化失败，已使用本地模式。";
    }
  },

  isAdmin() {
    return Boolean(this.user && String(this.user.uid) === this.adminUid);
  },

  async refreshUser() {
    const currentUser = await this.auth.getCurrentUser().catch(() => null);
    let detailUser = null;
    if (this.auth.getUser) {
      const result = await this.auth.getUser().catch(() => null);
      detailUser = result?.data?.user || result?.user || null;
    }
    this.user = currentUser || detailUser ? { ...(currentUser || {}), ...(detailUser || {}) } : null;
    return this.user;
  },

  isAnonymousUser() {
    return Boolean(this.user && (this.user.isAnonymous || this.user.loginType === "ANONYMOUS" || this.user.providerType === "anonymous"));
  },

  async loginAnonymously() {
    if (!this.auth) return null;
    if (this.auth.signInAnonymously) {
      await this.auth.signInAnonymously();
    } else if (this.auth.anonymousAuthProvider) {
      const provider = this.auth.anonymousAuthProvider();
      await provider.signIn();
    } else if (this.auth.signInWithAnonymous) {
      await this.auth.signInWithAnonymous();
    } else {
      return null;
    }
    return this.refreshUser();
  },

  getUserProfile() {
    const name =
      this.user?.nickName ||
      this.user?.nickname ||
      this.user?.displayName ||
      this.user?.name ||
      this.user?.username ||
      this.displayName ||
      "Harth";
    const avatar =
      this.user?.avatarUrl ||
      this.user?.avatar ||
      this.user?.picture ||
      this.user?.photoUrl ||
      this.user?.photoURL ||
      this.user?.metadata?.avatarUrl ||
      this.user?.customData?.avatarUrl ||
      "";
    return {
      name,
      avatar: typeof avatar === "string" && /^https?:\/\//.test(avatar) ? avatar : "",
    };
  },

  async login(username, password) {
    if (!this.auth) throw new Error("CloudBase 尚未初始化");
    if (this.isAnonymousUser() && this.auth.signOut) {
      await this.auth.signOut();
      this.user = null;
    }
    let loginState = null;
    if (this.auth.signInWithPassword) {
      loginState = await this.auth.signInWithPassword({ username, password });
    } else if (this.auth.signIn) {
      loginState = await this.auth.signIn({ username, password });
    } else if (this.auth.signInWithUsernameAndPassword) {
      loginState = await this.auth.signInWithUsernameAndPassword(username, password);
    } else {
      throw new Error("当前 CloudBase SDK 不支持账号密码登录接口。");
    }
    this.user = loginState?.user || null;
    await this.refreshUser();
    if (!this.isAdmin()) {
      await this.logout();
      throw new Error("当前账号不是管理员账号。");
    }
    this.displayName = this.getUserProfile().name || username;
    if (!this.user?.nickName && !this.user?.nickname && !this.user?.displayName && !this.user?.username) {
      this.displayName = username || this.displayName;
    }
    localStorage.setItem(this.userNameKey, this.displayName);
  },

  async logout() {
    if (this.auth?.signOut) await this.auth.signOut();
    this.user = null;
    this.displayName = "";
    localStorage.removeItem(this.userNameKey);
    await this.loginAnonymously();
  },

  normalizePost(doc) {
    const id = doc.id || doc._id;
    return {
      ...doc,
      id,
      date: doc.date || doc.created_at || new Date().toISOString().slice(0, 10),
      readTime: doc.readTime || doc.read_time || "1 分钟",
      tags: Array.isArray(doc.tags) ? doc.tags : [],
      takeaways: Array.isArray(doc.takeaways) ? doc.takeaways : [],
      content: Array.isArray(doc.content) ? doc.content : [],
      body: doc.body || doc.markdown || "",
      cloud: Boolean(doc.cloud),
    };
  },

  toCloudDoc(item) {
    return {
      id: item.id,
      title: item.title,
      category: item.category,
      summary: item.summary,
      body: item.body || "",
      tags: item.tags || [],
      takeaways: item.takeaways || [],
      content: item.content || [],
      read_time: item.readTime || item.read_time || "1 分钟",
      date: item.date || new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    };
  },

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

  async readCloudCollection(name) {
    if (!this.cloudReady || !this.db) return null;
    const result = await this.db.collection(name).orderBy("date", "desc").limit(1000).get();
    return (result.data || []).map((doc) => this.normalizePost({ ...doc, cloud: true }));
  },

  async getPosts() {
    try {
      const cloudPosts = await this.readCloudCollection("posts");
      if (cloudPosts) {
        return [...cloudPosts, ...window.EXPERIENCE_POSTS].sort((a, b) => b.date.localeCompare(a.date));
      }
    } catch (error) {
      this.cloudError = error?.message || "读取云端帖子失败，已使用本地模式。";
    }

    return [...window.EXPERIENCE_POSTS, ...this.readLocalPosts()].sort((a, b) => b.date.localeCompare(a.date));
  },

  async addPost(post) {
    if (this.cloudReady && this.isAdmin()) {
      await this.db.collection("posts").doc(post.id).set(this.toCloudDoc(post));
      return;
    }

    const localPosts = this.readLocalPosts();
    localPosts.unshift(post);
    this.saveLocalPosts(localPosts);
  },

  async removePost(id) {
    if (this.cloudReady && this.isAdmin()) {
      await this.db.collection("posts").doc(id).remove();
      return;
    }

    this.saveLocalPosts(this.readLocalPosts().filter((post) => post.id !== id));
  },

  readLocalDrafts() {
    try {
      return JSON.parse(localStorage.getItem(this.draftsKey) || "[]");
    } catch {
      return [];
    }
  },

  saveLocalDrafts(drafts) {
    localStorage.setItem(this.draftsKey, JSON.stringify(drafts));
  },

  async readDrafts() {
    if (!this.isAdmin()) return [];

    try {
      const cloudDrafts = await this.readCloudCollection("drafts");
      if (cloudDrafts) return cloudDrafts;
    } catch (error) {
      this.cloudError = error?.message || "读取草稿失败，已使用本地草稿。";
    }

    return this.readLocalDrafts();
  },

  async addDraft(draft) {
    if (this.cloudReady && this.isAdmin()) {
      await this.db.collection("drafts").doc(draft.id).set(this.toCloudDoc(draft));
      return;
    }

    const drafts = this.readLocalDrafts();
    drafts.unshift(draft);
    this.saveLocalDrafts(drafts);
  },

  async updateDraft(id, draft) {
    if (this.cloudReady && this.isAdmin()) {
      await this.db.collection("drafts").doc(id).set(this.toCloudDoc(draft));
      return;
    }

    this.saveLocalDrafts(this.readLocalDrafts().map((item) => (item.id === id ? draft : item)));
  },

  async removeDraft(id) {
    if (this.cloudReady && this.isAdmin()) {
      await this.db.collection("drafts").doc(id).remove();
      return;
    }

    this.saveLocalDrafts(this.readLocalDrafts().filter((draft) => draft.id !== id));
  },

  readLocalFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(this.favoritesKey) || "[]"));
    } catch {
      return new Set();
    }
  },

  saveLocalFavorites(favorites) {
    localStorage.setItem(this.favoritesKey, JSON.stringify([...favorites]));
  },

  async readFavorites() {
    if (!this.isAdmin()) return new Set();

    try {
      if (this.cloudReady && this.db) {
        const result = await this.db.collection("favorites").limit(1000).get();
        return new Set((result.data || []).map((item) => item.post_id || item.id || item._id));
      }
    } catch (error) {
      this.cloudError = error?.message || "读取收藏失败，已使用本地收藏。";
    }

    return this.readLocalFavorites();
  },

  async saveFavorite(id, enabled) {
    if (this.cloudReady && this.isAdmin()) {
      const ref = this.db.collection("favorites").doc(id);
      if (enabled) {
        await ref.set({ post_id: id, created_at: new Date().toISOString() });
      } else {
        await ref.remove();
      }
      return;
    }

    const favorites = this.readLocalFavorites();
    if (enabled) favorites.add(id);
    else favorites.delete(id);
    this.saveLocalFavorites(favorites);
  },
};
