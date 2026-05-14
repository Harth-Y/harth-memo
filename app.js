const store = window.EXPERIENCE_STORE;
let posts = [];
let drafts = [];
let favorites = new Set();
let activeCategory = "全部";
let activeSection = "all";
let activeView = "posts";
let editingDraftId = null;
let localPostIds = new Set(store.readLocalPosts().map((post) => post.id));

const navList = document.querySelector(".nav-list");
const viewToggle = document.querySelector(".view-toggle");
const categoryRow = document.querySelector("#categoryRow");
const postList = document.querySelector("#postList");
const resultCount = document.querySelector("#resultCount");
const searchInput = document.querySelector("#searchInput");
const composeDialog = document.querySelector("#composeDialog");
const composeForm = composeDialog.querySelector("form");
const composeTitle = document.querySelector("#composeTitle");
const closeDialogBtn = document.querySelector("#closeDialogBtn");
const cancelDialogBtn = document.querySelector("#cancelDialogBtn");
const saveDraftBtn = document.querySelector("#saveDraftBtn");
const newPostBtn = document.querySelector("#newPostBtn");
const sectionTitle = document.querySelector(".section-heading h2");
const sidebarToggle = document.querySelector("#sidebarToggle");
const userProfile = document.querySelector("#userProfile");
const userAvatar = document.querySelector("#userAvatar");
const userName = document.querySelector("#userName");
const loginBtn = document.querySelector("#loginBtn");
const logoutBtn = document.querySelector("#logoutBtn");
const loginDialog = document.querySelector("#loginDialog");
const loginForm = loginDialog.querySelector("form");
const closeLoginBtn = document.querySelector("#closeLoginBtn");
const cancelLoginBtn = document.querySelector("#cancelLoginBtn");
const loginError = document.querySelector("#loginError");

postList.innerHTML = `<article class="post-card empty-state"><h3>正在加载</h3><p>正在连接 CloudBase 并读取资料。</p></article>`;

function applySidebarState(collapsed) {
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
  sidebarToggle.setAttribute("aria-label", collapsed ? "展开侧栏" : "收起侧栏");
  sidebarToggle.textContent = collapsed ? "›" : "‹";
}

function getCategories() {
  return ["全部", ...new Set(posts.map((post) => post.category))];
}

function getTags() {
  return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b, "zh-CN"));
}

async function refreshData() {
  posts = await store.getPosts();
  drafts = await store.readDrafts();
  favorites = await store.readFavorites();
  localPostIds = new Set(store.readLocalPosts().map((post) => post.id));
}

function getAvatarLetter(name) {
  const trimmed = String(name || "Harth").trim();
  return trimmed ? [...trimmed][0].toUpperCase() : "H";
}

function updateAuthUI() {
  const isAdmin = store.isAdmin();
  const profile = store.getUserProfile();
  userProfile?.classList.toggle("hidden", !isAdmin);
  if (userName) userName.textContent = profile.name;
  if (userAvatar) {
    userAvatar.textContent = getAvatarLetter(profile.name);
    userAvatar.style.backgroundImage = profile.avatar ? `url("${profile.avatar}")` : "";
    userAvatar.classList.toggle("has-image", Boolean(profile.avatar));
  }
  loginBtn?.classList.toggle("hidden", isAdmin);
  logoutBtn?.classList.toggle("hidden", !isAdmin);
  newPostBtn?.classList.toggle("hidden", !isAdmin);
}

function createCategoryButtons() {
  categoryRow.innerHTML = getCategories()
    .map(
      (category) => `
        <button class="${category === activeCategory ? "active" : ""}" type="button" data-category="${category}">
          ${category}
        </button>
      `,
    )
    .join("");
}

function updateCounts() {
  const counts = {
    allCount: posts.length,
    favoriteCount: favorites.size,
    draftCount: drafts.length,
    tagCount: getTags().length,
  };
  Object.entries(counts).forEach(([id, value]) => {
    const target = document.querySelector(`#${id}`);
    if (target) target.textContent = value;
  });
}

function getFilteredPosts() {
  const keyword = searchInput.value.trim().toLowerCase();
  return posts.filter((post) => {
    const matchesCategory = activeCategory === "全部" || post.category === activeCategory;
    const matchesSection = activeSection !== "favorites" || favorites.has(post.id);
    const haystack = [post.title, post.category, post.summary, ...post.tags, ...post.takeaways].join(" ").toLowerCase();
    return matchesCategory && matchesSection && (!keyword || haystack.includes(keyword));
  });
}

function createPostCard(post) {
  const isFavorite = favorites.has(post.id);
  const canManage = store.isAdmin();
  const canDelete = canManage && (post.cloud || localPostIds.has(post.id));
  return `
    <article class="post-card" data-href="post.html?id=${post.id}">
      ${
        canManage
          ? `<button class="favorite-button ${isFavorite ? "active" : ""}" type="button" data-favorite-id="${post.id}" aria-label="${isFavorite ? "取消收藏" : "收藏"} ${post.title}">
              ${isFavorite ? "★" : "☆"}
            </button>`
          : ""
      }
      <div class="post-card-main">
        <div class="post-meta">
          <span>${post.category}</span>
          <span>${post.date}</span>
          <span>${post.readTime}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.summary}</p>
        <div class="tag-row">
          ${post.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
        </div>
      </div>
      <div class="post-extra">
        <strong>展开预览</strong>
        <ul>
          ${post.takeaways.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <div class="post-extra-actions">
          <span class="open-hint">点击进入完整帖子</span>
          ${
            canDelete
              ? `<button class="text-danger-action" type="button" data-post-delete="${post.id}">删除帖子</button>`
              : ""
          }
        </div>
      </div>
    </article>
  `;
}

function navigateWithTransition(url, sourceElement) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.location.href = url;
    return;
  }

  if (document.body.classList.contains("page-leaving")) return;
  sourceElement?.classList.add("is-opening");
  document.body.classList.add("page-leaving");
  window.setTimeout(() => {
    window.location.href = url;
  }, 240);
}

function renderPostCards(filteredPosts) {
  sectionTitle.textContent = activeSection === "favorites" ? "我的收藏" : "最新经验";
  resultCount.textContent = `${filteredPosts.length} 篇`;

  if (!filteredPosts.length) {
    postList.innerHTML = `<article class="post-card empty-state"><h3>没有找到匹配内容</h3><p>换一个关键词，或者减少分类筛选条件。</p></article>`;
    return;
  }

  postList.className = "post-list";
  postList.innerHTML = filteredPosts.map(createPostCard).join("");
}

function renderTimeline(filteredPosts) {
  sectionTitle.textContent = activeSection === "favorites" ? "收藏时间线" : "经验时间线";
  resultCount.textContent = `${filteredPosts.length} 篇`;
  postList.className = "timeline-list";

  if (!filteredPosts.length) {
    postList.innerHTML = `<article class="post-card empty-state"><h3>没有时间线内容</h3><p>当前筛选条件下还没有帖子。</p></article>`;
    return;
  }

  const groups = filteredPosts.reduce((result, post) => {
    const month = post.date.slice(0, 7);
    result[month] = result[month] || [];
    result[month].push(post);
    return result;
  }, {});

  postList.innerHTML = Object.entries(groups)
    .map(
      ([month, groupPosts]) => `
        <section class="timeline-group">
          <h3>${month}</h3>
          <div class="timeline-items">
            ${groupPosts
              .map(
                (post) => `
                  <article class="timeline-item" data-href="post.html?id=${post.id}">
                    <span>${post.date.slice(5)}</span>
                    <div>
                      <strong>${post.title}</strong>
                      <p>${post.summary}</p>
                    </div>
                    <button class="favorite-button ${favorites.has(post.id) ? "active" : ""}" type="button" data-favorite-id="${post.id}" aria-label="收藏 ${post.title}">
                      ${favorites.has(post.id) ? "★" : "☆"}
                    </button>
                  </article>
                `,
              )
              .join("")}
          </div>
        </section>
      `,
    )
    .join("");
}

function renderTagsManager() {
  activeView = "posts";
  sectionTitle.textContent = "标签管理";
  resultCount.textContent = `${getTags().length} 个标签`;
  categoryRow.innerHTML = "";
  postList.className = "tag-manager";
  postList.innerHTML = getTags()
    .map((tag) => {
      const count = posts.filter((post) => post.tags.includes(tag)).length;
      return `<button class="tag-card" type="button" data-tag="${tag}"><strong>${tag}</strong><span>${count} 篇</span></button>`;
    })
    .join("");
}

function renderDrafts() {
  sectionTitle.textContent = "草稿";
  resultCount.textContent = `${drafts.length} 篇`;
  categoryRow.innerHTML = "";
  postList.className = "post-list";

  if (!store.isAdmin()) {
    postList.innerHTML = `<article class="post-card empty-state"><h3>草稿需要登录</h3><p>同事访问时只显示已发布资料。管理员登录后可以查看和编辑草稿。</p></article>`;
    return;
  }

  if (!drafts.length) {
    postList.innerHTML = `<article class="post-card empty-state"><h3>暂无草稿</h3><p>点击“新建帖子”，选择“保存草稿”后会出现在这里。</p></article>`;
    return;
  }

  postList.innerHTML = drafts
    .map(
      (draft) => `
        <article class="post-card draft-card">
          <div class="post-card-main">
            <div class="post-meta">
              <span>${draft.category}</span>
              <span>${draft.updatedAt || draft.date}</span>
              <span>草稿</span>
            </div>
            <h3>${draft.title || "未命名草稿"}</h3>
            <p>${draft.summary || "还没有内容摘要。"}</p>
            <div class="tag-row">
              ${draft.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}
            </div>
          </div>
          <div class="draft-actions">
            <button class="ghost-action" type="button" data-draft-edit="${draft.id}">编辑</button>
            <button class="primary-action" type="button" data-draft-publish="${draft.id}">发布</button>
            <button class="danger-action" type="button" data-draft-delete="${draft.id}">删除</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function render() {
  updateAuthUI();
  updateCounts();
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.section === activeSection));
  document.querySelectorAll(".view-toggle button").forEach((item) => item.classList.toggle("active", item.dataset.view === activeView));

  if (activeSection === "tags") {
    renderTagsManager();
    return;
  }

  if (activeSection === "drafts") {
    renderDrafts();
    return;
  }

  createCategoryButtons();
  const filteredPosts = getFilteredPosts();
  if (activeView === "timeline") {
    renderTimeline(filteredPosts);
  } else {
    renderPostCards(filteredPosts);
  }
}

function createId(title) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "memo"}-${Date.now()}`;
}

function estimateReadTime(text) {
  const minutes = Math.max(1, Math.ceil(text.length / 450));
  return `${minutes} 分钟`;
}

function parseTags() {
  return document
    .querySelector("#postTagsInput")
    .value.split(/[,，\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseTakeaways() {
  return document
    .querySelector("#postTakeawaysInput")
    .value.split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildPostFromForm({ allowEmpty = false, existingId = null } = {}) {
  const title = document.querySelector("#postTitleInput").value.trim();
  const category = document.querySelector("#postCategoryInput").value;
  const summary = document.querySelector("#postSummaryInput").value.trim();
  const tags = parseTags();
  const takeaways = parseTakeaways();

  if (!allowEmpty && (!title || !summary)) return null;

  return {
    id: existingId || createId(title || "draft"),
    title: title || "未命名草稿",
    category,
    date: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    readTime: estimateReadTime(summary || title),
    summary,
    tags: tags.length ? tags : [category],
    takeaways: takeaways.length ? takeaways : ["补充背景、现象、解决方法和适用范围"],
    content: [
      {
        heading: "完整记录",
        body: summary || "草稿尚未填写正文。",
      },
    ],
  };
}

function resetCompose() {
  editingDraftId = null;
  composeTitle.textContent = "新建帖子";
  saveDraftBtn.textContent = "保存草稿";
  composeForm.reset();
}

function openDraftEditor(draft) {
  editingDraftId = draft.id;
  composeTitle.textContent = "编辑草稿";
  saveDraftBtn.textContent = "更新草稿";
  document.querySelector("#postTitleInput").value = draft.title === "未命名草稿" ? "" : draft.title;
  document.querySelector("#postCategoryInput").value = draft.category;
  document.querySelector("#postTagsInput").value = draft.tags.join(", ");
  document.querySelector("#postSummaryInput").value = draft.summary;
  document.querySelector("#postTakeawaysInput").value = draft.takeaways.join("\n");
  composeDialog.showModal();
}

async function handlePostPublish(event) {
  event.preventDefault();
  if (!store.isAdmin()) return;
  const post = buildPostFromForm();
  if (!post) return;

  await store.addPost(post);
  if (editingDraftId) await store.removeDraft(editingDraftId);
  await refreshData();
  activeSection = "all";
  activeCategory = "全部";
  resetCompose();
  composeDialog.close();
  render();
}

async function handleDraftSave() {
  if (!store.isAdmin()) return;
  const draft = buildPostFromForm({ allowEmpty: true, existingId: editingDraftId });
  if (editingDraftId) {
    await store.updateDraft(editingDraftId, draft);
  } else {
    await store.addDraft(draft);
  }
  await refreshData();
  activeSection = "drafts";
  activeCategory = "全部";
  resetCompose();
  composeDialog.close();
  render();
}

navList.addEventListener("click", (event) => {
  const button = event.target.closest(".nav-item");
  if (!button) return;
  activeSection = button.dataset.section;
  if (activeSection === "tags" || activeSection === "drafts") activeView = "posts";
  activeCategory = "全部";
  render();
});

viewToggle.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-view]");
  if (!button) return;
  activeView = button.dataset.view;
  if (activeSection === "tags" || activeSection === "drafts") activeSection = "all";
  render();
});

categoryRow.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  activeCategory = button.dataset.category;
  render();
});

postList.addEventListener("click", async (event) => {
  const favoriteButton = event.target.closest("[data-favorite-id]");
  if (favoriteButton) {
    event.preventDefault();
    event.stopPropagation();
    if (!store.isAdmin()) return;
    const id = favoriteButton.dataset.favoriteId;
    await store.saveFavorite(id, !favorites.has(id));
    favorites = await store.readFavorites();
    render();
    return;
  }

  const tagCard = event.target.closest("[data-tag]");
  if (tagCard) {
    activeSection = "all";
    activeCategory = "全部";
    searchInput.value = tagCard.dataset.tag;
    render();
    return;
  }

  const draftEditButton = event.target.closest("[data-draft-edit]");
  if (draftEditButton) {
    const draft = drafts.find((item) => item.id === draftEditButton.dataset.draftEdit);
    if (draft) openDraftEditor(draft);
    return;
  }

  const draftPublishButton = event.target.closest("[data-draft-publish]");
  if (draftPublishButton) {
    const draft = drafts.find((item) => item.id === draftPublishButton.dataset.draftPublish);
    if (!draft) return;
    if (!draft.summary || !draft.title || draft.title === "未命名草稿") {
      openDraftEditor(draft);
      return;
    }
    await store.addPost({ ...draft, date: new Date().toISOString().slice(0, 10), updatedAt: undefined });
    await store.removeDraft(draft.id);
    await refreshData();
    activeSection = "all";
    render();
    return;
  }

  const draftDeleteButton = event.target.closest("[data-draft-delete]");
  if (draftDeleteButton) {
    await store.removeDraft(draftDeleteButton.dataset.draftDelete);
    await refreshData();
    render();
    return;
  }

  const postDeleteButton = event.target.closest("[data-post-delete]");
  if (postDeleteButton) {
    event.preventDefault();
    event.stopPropagation();
    const id = postDeleteButton.dataset.postDelete;
    if (!store.isAdmin()) return;
    if (!posts.find((item) => item.id === id)?.cloud && !localPostIds.has(id)) return;
    const post = posts.find((item) => item.id === id);
    if (!window.confirm(`确定删除《${post?.title || "这篇帖子"}》吗？`)) return;
    await store.removePost(id);
    if (favorites.has(id)) await store.saveFavorite(id, false);
    await refreshData();
    render();
    return;
  }

  const item = event.target.closest("[data-href]");
  if (item) navigateWithTransition(item.dataset.href, item);
});

searchInput.addEventListener("input", () => {
  if (activeSection === "tags" || activeSection === "drafts") activeSection = "all";
  render();
});

composeForm.addEventListener("submit", handlePostPublish);

newPostBtn.addEventListener("click", () => {
  if (!store.isAdmin()) return;
  if (typeof composeDialog.showModal === "function") {
    resetCompose();
    composeDialog.showModal();
  }
});

saveDraftBtn.addEventListener("click", handleDraftSave);
closeDialogBtn.addEventListener("click", () => {
  resetCompose();
  composeDialog.close();
});
cancelDialogBtn.addEventListener("click", () => {
  resetCompose();
  composeDialog.close();
});

sidebarToggle.addEventListener("click", () => {
  if (window.matchMedia("(max-width: 980px)").matches) return;
  const collapsed = !document.body.classList.contains("sidebar-collapsed");
  localStorage.setItem("harth-memo-sidebar-collapsed", collapsed ? "1" : "0");
  applySidebarState(collapsed);
});

loginBtn.addEventListener("click", () => {
  loginError.classList.add("hidden");
  loginForm.reset();
  loginDialog.showModal();
});

closeLoginBtn.addEventListener("click", () => loginDialog.close());
cancelLoginBtn.addEventListener("click", () => loginDialog.close());

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.classList.add("hidden");
  const username = document.querySelector("#loginUsernameInput").value.trim();
  const password = document.querySelector("#loginPasswordInput").value;

  try {
    await store.login(username, password);
    await refreshData();
    loginDialog.close();
    render();
  } catch (error) {
    loginError.textContent = error?.message || "登录失败，请检查账号和密码。";
    loginError.classList.remove("hidden");
  }
});

logoutBtn.addEventListener("click", async () => {
  await store.logout();
  await refreshData();
  activeSection = "all";
  render();
});

async function boot() {
  applySidebarState(!window.matchMedia("(max-width: 980px)").matches && localStorage.getItem("harth-memo-sidebar-collapsed") === "1");
  await store.init();
  await refreshData();
  render();
}

boot().catch((error) => {
  postList.innerHTML = `<article class="post-card empty-state"><h3>加载失败</h3><p>${error?.message || "请稍后刷新重试。"}</p></article>`;
});
