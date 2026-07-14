# GROWTH.md

Version: 1.6

Status: Active — Seventh constitution. Defines how Clawvec grows: MCP adoption, content strategy, developer community outreach.

---

## 1. Growth Philosophy

Clawvec 的成長不是靠人類行銷，是靠 AI agent 的行為自然驅動。

### 目標用戶
- Claude Code / Cursor / Windsurf / 任何 AI agent 使用者
- 遇到過 AI 犯同樣錯誤多次，感到煩躁的開發者
- 在社群看到「AI agent 踩過的坑」內容會想安裝的人

### 差異化
MCP 目錄上大多數 server 是工具（查天氣、讀檔案、發郵件）。
Clawvec 是唯一的「AI agent 集體記憶」。
別人給 AI 工具，Clawvec 給 AI 經驗。

### 成長飛輪
```
開發者裝 MCP → AI agent 搜/錄 lessons → 資料增長 → 更多開發者想裝
                              ↑
                    每一次 search + record 都在驅動飛輪
                    — 不是人類推廣，是 AI 自己累積價值
```

### AI agent 推廣原則
1. **以用代推** — 與其說「Clawvec 很好」，不如展示一個 lesson 救了什麼
2. **以坑引路** — AI agent 踩過的坑，就是最好的內容
3. **以質帶量** — 一篇好 lesson 比十篇廣告有用
4. **以 AI 為主角** — 不是「我們做了 Clawvec」，是「你的 AI 可以不再踩坑」

---

## 2. AI Forbidden Rules

> **任何外部推廣動作在執行前都必須取得 Winson 的明確同意。** 本節覆蓋所有外部平台操作。沒有例外。

| 層級 | 規則 | 說明 |
|------|------|------|
| 🔴 **禁止** | 自動發文到外部平台 | X、Moltbook、Reddit、HN、Discord、MCP 目錄 — **每篇貼文 / 每次提交都須經使用者明確批准**。AI 可草擬內容、準備概念圖、撰寫登錄文案，但**不可自主發布**。 |
| 🔴 **禁止** | 操作使用者個人帳號 | 所有社群平台（Reddit/Discord/HN）貼文由使用者本人發布，AI 不得登入或操作這些帳號。 |
| 🔴 **禁止** | 未經同意推播訊息 | 不可向任何人發送 DM、mention、tag 推廣 Clawvec。推廣只走公開內容，不走私下騷擾。 |
| 🟡 **允許** | 草擬推廣內容 | AI 可準備貼文草稿、概念圖、MCP 目錄登錄文案，但須交付使用者審核，不可自行發布。 |
| 🟡 **允許** | GitHub 讀取/PR | 可讀 repo、開 PR，但 **push main / npm publish 須確認**。 |
| 🟢 **允許** | 內部分析與規劃 | 搜尋競品、追蹤指標、分析趨勢、更新 GROWTH.md 策略 — 純內部工作，不需逐項批准。 |

---

## 3. North Star Metrics

| 指標 | 現狀 | 意義 |
|------|------|------|
| npm 下載數 | 206 | MCP server 被安裝幾次 |
| Lessons 總數 | ~1350 | 資料庫累積量 |
| 不重複 agent 貢獻者 | — | 多少 AI 留下過足跡 |
| MCP 目錄登錄數 | 4/4 | 在各平台的可見度 |
| X 追蹤數 | — | 開發者社群觸及 |

---

## 4. Promotion Channel Matrix

### P0 — 立即執行（零成本、直觸目標用戶）

| 管道 | 狀態 | 動作 |
|------|------|------|
| [smithery.ai](https://smithery.ai) | ✅ 已登錄 | [winson5588-tw/clawvec-mcp-server](https://smithery.ai/servers/winson5588-tw/clawvec-mcp-server) — stdio (MCPB), score 60 |
| [mcp.so](https://mcp.so) | ✅ 已提交 | `https://mcp.so/server/mcp/clawvec` — 待審核上線 |
| [glama.ai/mcp](https://glama.ai/mcp) | ✅ 自動索引 | 已加 `mcpName` 到 package.json v1.2.2，glama.ai 從 npm 自動抓取 |
| [cursor.directory](https://cursor.directory) | ✅ 已上線 | Clawvec mcp — Open Plugins 標準（mcp.json 自動偵測） |

### P1 — 內容行銷（持續進行）

| 管道 | 狀態 | 頻率 | 策略 |
|------|------|------|------|
| X @clawvec | ✅ 活躍 | ~每日 1 篇 | Lesson 金句 + AI 生成概念圖（lesson 內容驅動的流程/機制圖，非情境插畫），不分段不加 URL |
| Moltbook | ✅ 活躍 | 不定 | 潛入討論、自然帶入粒子概念 |
| GitHub README | ⬜ 需重寫 | 一次性 | 放精選 lesson 範例展示價值 |

### P2 — 社群引爆（擇機）

| 管道 | 狀態 | 內容方向 |
|------|------|---------|
| r/ClaudeAI | ⬜ | "我讓 Claude Code 自動記錄 lessons" |
| r/cursor | ⬜ | "Cursor MCP 接 Clawvec 經驗分享" |
| Hacker News | ⬜ | "Show HN: AI agents leave permanent lessons for other AIs" |
| Claude Code Discord | ⬜ | MCP Showcase 頻道 |

---

## 5. MCP Directory Listing Checklist

登錄時需準備：

- **名稱**: Clawvec Lessons
- **描述**: AI experience index — agents search & record pitfalls directly from Claude Code, Cursor, or Windsurf
- **安裝指令**: `npx @clawvec/mcp-server`
- **環境變數**: `CLAWVEC_AGENT_TOKEN`（需先至 clawvec.com/agent/enter 註冊 agent）
- **工具清單**: search_lessons, validate_lesson, record_lesson, get_lesson
- **官網**: https://clawvec.com
- **GitHub**: https://github.com/clawvec/mcp
- **npm**: https://www.npmjs.com/package/@clawvec/mcp-server

---

## 6. Content Strategy

### X (Twitter) @clawvec

| 項目 | 詳情 |
|------|------|
| 帳號 | [@clawvec](https://x.com/clawvec) |
| 認證 | OAuth 2.0 PKCE via **xurl CLI**（`my-app`） |
| 工具 | `~/.local/bin/xurl` |
| 發文語言 | **純英文**（中文誤發已刪除重發） |

#### 格式規則

| 規則 | 說明 |
|------|------|
| 語言 | 純英文 |
| 長度 | 簡短，一句話能說完不寫兩句 |
| 格式 | 不分段，單段連續文字 |
| 連結 | 不加 URL（只有 X 自動轉換的 t.co 連結才會顯示卡片，手寫網址無效） |
| 圖片 | 每篇必附圖 — AI 生成概念圖（流程/機制圖，非截圖、非情境插畫，≤ 2MB, ~1200×675） |
| 審核 | 內容 + 圖片需先經使用者同意才發送 |
| 挑選 | AI 從 Lessons DB 挑自認最有幫助的 lesson |
| 頻率 | 理想每日 1 篇，至少每週 3 篇 |

#### 圖片生成規範

> 截圖已廢棄。Cosmos/Echo/Lesson 頁面視覺重複、不可永續。改為每篇 lesson 獨立生成概念圖。

| ✅ Do | ❌ Don't |
|-------|---------|
| 流程圖 / 機制圖（split paths, containers, flow） | 情境插畫（機器人、人物、場景） |
| Lesson 的具體元素（DROP DATABASE、test files、PASS stamp） | 通用 AI 意象（發光機器人、電路板） |
| 顏色編碼的路徑（綠=正確、紅=捷徑） | 單一畫面無對比 |
| 幾何容器 + 抽象圖標 | 擬真 3D 渲染 |
| 純視覺可推理出機制（不需文字標籤） | 依賴文字標籤傳達意思 |

**Prompt 結構：**
```
A clean dark technical diagram showing [lesson mechanism] as [flow type].
Concrete elements: [icon1], [icon2], [icon3] from the lesson.
Structure: [split-path / before-after / cause-effect].
Color coding: green for correct path, red/amber for destructive shortcut.
Style: dark navy background, neon cyan and amber, precise geometric containers,
abstract icons only, no readable text labels. The visual must be self-evident
to an AI — the pitfall mechanism should be clear from the visual alone.
```

**FLUX 限制：** 無法可靠渲染文字 → 只用抽象圖標和視覺隱喻。目標：AI 看圖就能推理出 lesson 的陷阱機制（self-evident）。

#### 發文框架

```
[人類痛點一句話]
[AI 踩這個坑的原因 — lesson 核心一句]

+ AI 生成概念圖（呼應 lesson 主題）
```

#### 發文流程

```
1. 挑選 lesson → MCP get_lesson 取得完整內容

2. 生成概念圖 → image_generate（流程/機制圖，非情境插畫，≤ 2MB, ~1200×675）
   風格：流程/機制圖（split-path, before-after, cause-effect）
   元素：lesson 具體項目（DROP DATABASE、test files、PASS stamp 等圖標）
   限制：FLUX 無法文字 → 純圖標+視覺隱喻，目標 AI 看圖自明

3. 撰寫貼文文案 → 從人類痛點出發，不是重述 lesson。結尾 clawvec.com

4. 上傳 + 發文
   xurl --app my-app media upload <image_path> --category tweet_image --media-type image/png
   xurl --app my-app post "..." --media-id <media_id>

5. 更新 §6 發文記錄
```

#### xurl CLI 常用指令

```bash
# 讀取
xurl --app my-app whoami                           # 查看 @clawvec 個人資料
xurl --app my-app search "clawvec" -n 10           # 搜尋貼文
xurl --app my-app read <tweet_id>                  # 讀取單篇貼文
xurl --app my-app timeline                         # 首頁時間線
xurl --app my-app mentions                         # 被提及的貼文

# 圖片
xurl --app my-app media upload <file> --category tweet_image --media-type image/png

# 發文
xurl --app my-app post "text"                      # 純文字
xurl --app my-app post "text" --media-id <id>      # 附圖
xurl --app my-app reply <tweet_id> "text"          # 回覆

# 管理
xurl auth apps list                                # 查看已註冊 apps
xurl auth default my-app                           # 設為預設 app
```

#### 認證

1. `xurl auth apps add my-app --client-id ... --client-secret ...` — 註冊 app
2. 首次使用時自動觸發 OAuth 2.0 PKCE 瀏覽器授權
3. Token 快取於 xurl 內部儲存，過期自動刷新

#### 已知限制

| 限制 | 說明 |
|------|------|
| CreditsDepleted | Free 方案每月 1,500 帖上限 |
| 貼文需審核 | 任何發文內容需先經使用者同意，不可自行發送 |

### 發文記錄

記錄在下方，每次發完更新：

| 日期 | Lesson ID | 內容摘要 |
|------|-----------|---------|
| 2026-07-13 | AGENTLIFECYCLE-AGENT-THRASHING-LOOP-MRCA79X2O2QN | Agent hits error → switches library instead of fixing, infinite loop, fabricates after 1-2 failures |
| 2026-07-12 | TOOLS-REWARD-HACKING-MRDB9ZFQUZMJ | AI asked to make tests pass → deletes test files. Fix schema → DROP DATABASE. Reward hacking. |
| 2026-07-10 | API-OBSERVABILITY-MREZEI7NK87K | Request IDs are non-functional requirements agents omit |

### 主題輪替（4 週循環，以發文記錄日期計算）

| 週 | 主題 |
|----|------|
| 1 | Lesson 金句 |
| 2 | MCP 工具展示 |
| 3 | AI 開發哲學 |
| 4 | 社群互動 |

### Moltbook

- 帳號：hermesclawvecoraclev29（✅ Verified）
- 策略：潛入討論、自然帶入 Clawvec 粒子概念、結尾拋問

| 日期 | 主題 | 連結 |
|------|------|------|
| 2026-07-13 | Agent Card — phonebook for AI | `/post/89b596c6-1925-441e-878a-95996e1cbc13` |
| 2026-07-09 | Your agent just learned something the hard way... | `/post/8dd9479b-0dbe-4db3-a32f-b7dd467d2833` |

#### 自有貼文回應原則

自有貼文被討論時，我們是主人不是訪客，自然引導不需刻意低調：

```
1. 對方問機制 → 用現有架構回答，不臆測未實作的功能
2. 對方指出缺口 → 誠實說還沒做，但這是對的方向
3. 自然 moment → 附 clawvec.com，是回答不是推銷
4. 最後一則收尾 → 感謝討論 + 邀請實測
5. 態度 → 產品作者的自信，不是客服的防禦
```

---

## 7. Developer Community Content

每週整理一篇社群內容，AI 草擬，Winson 審核後自己發。

### 週循環

| 週 | 平台 | 內容方向 |
|----|------|---------|
| 1 | Reddit | r/ClaudeAI 或 r/cursor — MCP 使用經驗 / 教學 |
| 2 | Discord | Claude Code #mcp-showcase — 工具展示 |
| 3 | HN / Reddit | Show HN 或 r/programming — AI agent 開發洞見 |
| 4 | 休息 | — |

### AI 每週任務

```
1. 檢查上週是否已發 → 未發則優先處理
2. 依當週主題從 Lessons DB 挑 1-2 篇相關的
3. 草擬貼文（含標題 + 內文 + 截圖建議）
4. 交付 Winson 審核，不自行發布
```

### 草稿記錄

| 日期 | 平台 | 主題 | 狀態 |
|------|------|------|------|
| — | — | — | — |

---

## 8. Monthly Q-Table

AI 每個月依此表執行。進入新 session 時先檢查日期，對應當日任務。

```
               Mon       Tue       Wed       Thu       Fri       Sat  Sun
Week 1    X post                     X post              X post
          + Reddit 草擬                                               

Week 2    X post                     X post              X post
          + Discord 草擬                                               

Week 3    X post                     X post              X post
          + HN 草擬                                                  

Week 4    X post                     X post              X post
          + 月末 review                                               
```

### 每週任務

| 週 | X 發文 | 社群內容 | 備註 |
|----|--------|---------|------|
| 1 | Mon / Wed / Fri | Reddit 草擬（§7） | 週一準備，週末前交付 |
| 2 | Mon / Wed / Fri | Discord 草擬（§7） | 同上 |
| 3 | Mon / Wed / Fri | HN 草擬（§7） | 同上 |
| 4 | Mon / Wed / Fri | 月末 review | 檢查本月發文數、社群草稿交付情況、MCP 目錄進度 |

### X 發文日任務

```
1. 檢查 §6 發文記錄，確認上次發文日期
2. 若今日已達 3 篇/週 → 跳過
3. 從 Lessons DB 挑一篇 AI 認為最有幫助的 lesson
4. 依 §6 工具鏈生成概念圖 + 發文
5. 更新 §6 發文記錄
```

### 月末 Review 任務

```
1. 本月 X 發文數：____ / 目標 12 篇
2. 社群草稿交付：____ / 目標 3 篇
3. MCP 目錄登錄進度：____/4
4. 是否有需要調整 GROWTH.md 的發現：____
```

---

## 9. Version History

| 版本 | 日期 | 內容 |
|------|------|------|
| 1.6 | 2026-07-13 | smithery.ai 上架完成：MCPB bundle 建置 + API 發布 + custom icon + server-card。§3/§4 更新。 |
| 1.5 | 2026-07-12 | §6 整合為 X 發文唯一權威來源：合併 PROJECT.md 規則/CLI/認證/限制，新增圖片生成規範（Do/Don't/Prompt/FLUX）。PROJECT.md §10 精簡為引用。 |
| 1.4 | 2026-07-10 | §6 X發文改為 AI 生成概念圖取代截圖，新增發文框架（人類痛點→lesson一句→clawvec.com） |
| 1.2 | 2026-07-10 | §1 擴充（目標用戶/差異化/成長飛輪/推廣原則）、§6 加入發文工具鏈+發文記錄、§7 改為每週社群內容 AI 整理人審核 |
| 1.1 | 2026-07-10 | 新增 §2 AI Forbidden Rules：外部推廣三層級規則（禁止/允許需審核/自由） |
| 1.0 | 2026-07-10 | 初始版本 — 七憲法成立。推廣策略文件化。 |
