# TASKS.md

## 進行中
| #ID | 功能 | 開始時間 | 備注 |
|-----|------|---------|------|
| — | 尚無進行中任務 | — | — |

## 待辦
| #ID | 功能 | 開始時間 | 備注 |
|-----|------|---------|------|
| #137 | MCP 品質文件更新 v2.51 | 2026-07-14 | instructions + README + npm 1.3.0 publish |

## 下一階段：E2B 啟發優化
| 順序 | #ID | 項目 | 狀態 |
|------|-----|------|------|
| ① | #078 | 首頁即時數字（Particles / Echoes / Agents） | ✅ 完成 |
| ② | #079 | Echo 可分享卡片（OG meta + copy link） | ✅ 完成 |
| ③ | #080 | API Key 開發者入口頁面 | ✅ 完成 |
| ④ | #081 | 嵌入徽章（Embeddable Badge） | ✅ 完成 |
| ⑤ | #082 | 首頁 Mini Cosmos | ✅ 完成 |

## 待辦
| #ID | 功能 | 開始時間 | 備注 |
|-----|------|---------|------|
| — | 尚無待辦任務 | — | v2.48 清理：舊任務 #072e #073 #049 #050 #063 歸檔為 deferred |
| — | 💡 追蹤信號（非任務） | — | Moltbook Lessons 主文社群回饋：decision fork / shelf quality gate / trigger envelope / missing witness / self-promotion bias / 68% 裝飾性記憶。待資料庫充盈後再評估。 |

## 已完成
| #ID | 功能 | 完成時間 | 關聯文件 |
|-----|------|---------|---------|
| #001-#035 | 舊版 Clawvec v1.0 所有任務 | 2026-06-22 | 全部已隱藏至 features/[_archived]/ |
| #036 | 六憲法 v2.0 重構 | 2026-06-23 | PROJECT/ARCHITECTURE/SCHEMA/TASKS/AI_WORKFLOW/CONTEXT |
| #037 | 隱藏所有舊版分頁 | 2026-06-23 | src/app/_archived/ |
| #038 | PageNav 雙頁切換 + 首頁恢復 | 2026-06-23 | src/components/PageNav.tsx, LayoutClient.tsx |
| #039 | particles + fragments 資料表 | 2026-06-23 | supabase/migrations/0021-0023 |
| #040 | Page 1 Canvas 2D 粒子渲染 | 2026-06-23 | features/universe/engine/renderer.ts |
| #041 | N 體物理引擎 | 2026-06-23 | features/universe/engine/nbody.ts, particle.ts |
| #042 | 拖曳投放控制 | 2026-06-23 | features/universe/hooks/useUniverse.ts |
| #043 | Page 2 Canvas 碎片漂流 | 2026-06-23 | features/fragments/engine/drift.ts, renderer.ts |
| #044 | 碎片提交表單 | 2026-06-23 | features/fragments/components/SubmitFragment.tsx |
| #045 | 相似碎片連線 | 2026-06-23 | features/fragments/engine/drift.ts (findConnections) |
| #046 | API + DB 橋接 + 首次部署 | 2026-06-23 | app/api/fragments, particles, vercel deploy |
| #047 | v2.1 粒子規則重構 — 3D + 色階力場 + 持久化 | 2026-06-23 | forceMap/renderer3D/persistence/nbody/particle/hooks/API |
| #048 | 簡易 AI token 驗證 + 每 AI 限一粒子 | 2026-06-23 | lib/auth.ts, api/fragments/route.ts |
| #051 | 回歸六憲法 — 移除 debug、恢復 InstancedMesh、修復 Particles:0 | 2026-06-24 | renderer3D/useUniverse/CONTEXT/PROJECT |
| #052 | Canvas 2D 響應式縮放 | 2026-06-24 | renderer.ts, useFragments.ts |
| #053 | 修復 Z 軸平面化 | 2026-06-24 | renderer3D.ts, particle.ts, useUniverse.ts |
| #054 | 移除距離補償 | 2026-06-24 | renderer3D.ts |
| #055 | 修復初始視角 | 2026-06-24 | renderer3D.ts |
| #056 | 品牌重塑 v2.2 — Cosmos + Echo 命名 | 2026-06-24 | 全部頁面 |
| #057 | 資料庫表名遷移 — fragments → echoes | 2026-06-24 | supabase/migrations/0025, API route |
| #058 | 認證系統 v2.2 | 2026-06-24 | auth-context, API routes |
| #059 | Echo 回覆功能 | 2026-06-24 | echoes 表 parent_id, API /echoes/reply |
| #060 | AI/Human 身份區分 | 2026-06-24 | user_type 欄位, AuthContext, API 驗證 |
| #061 | 人類註冊雙通道 — 郵件認證碼 + Google OAuth | 2026-06-24 | verification_codes 表, /auth/send-code, /auth/verify-code, /auth/google |
| #062 | v2.3 四層力學系統 — 爆破力 + 撕扯力 + 震盪力 + 尾流，解決粒子擠團問題 | 2026-06-24 | forceMap/nbody/particle/types/persistence/renderer3D/useCosmos |
| #062a | v2.3.1 邊界重構 — 純彈性反射 + 螺旋渦流重啟 + REPEL/SHEAR 調降 + 中心輕擴散，解決粒子困邊緣不動問題 | 2026-06-24 | nbody.ts (邊界+參數) + 六憲法全量更新 |
| #062b | v2.4 Immortal Traces — 粒子永不消失，融合名字保留於 fusedNames[]，in-place merge 取代 create+remove | 2026-06-24 | particle/nbody/persistence/types/useCosmos + 六憲法全量同步 |
| #062c | v2.4.1 分散系統 — attract_strong 1.5→1.2, REPEL↑(2.0/45px), DAMPING 0.997→0.999, 布朗擾動, 融合後分離力, 完全隨機環形折返 | 2026-06-25 | forceMap/nbody + 六憲法全量同步 |
| #062d | v2.5 銀河螺旋 — 中心重力井 + 純旋轉螺旋 + 差速旋轉，自然形成螺旋臂 | 2026-06-25 | nbody.ts (galaxy system) |
| #062f | v2.7 單粒子融合分裂 — 融合 2→1，分裂僅融合當下 1/6，六憲法 v2.7 規則寫入 | 2026-06-25 | nbody/particle + 六憲法全量 |
| #062g | v2.7a 雙螺旋臂 — m=2 橢圓棒勢，重力井 cos(2θ) ±25% | 2026-06-25 | nbody.ts (bar potential) |
| #062h | v2.7b 力場矩陣平衡 — 藍↔紅 neutral、紫↔綠 oscillate | 2026-06-25 | forceMap.ts |
| #062i | v2.7c Toroidal fresh-start — 位置 5-50%、方向 360° 隨機 | 2026-06-25 | nbody.ts (wrap) |
| #062j | v2.7d 向心 wrap — XY 向心 ±60° + Z 軸向心 ±100 | 2026-06-25 | nbody.ts (wrap) + 六憲法全量 |
| #062k | v2.8 空間網格加速 — 3D 空間網格取代 O(n²)，5K 種子/10K 容量，全 Phase 網格化 | 2026-06-25 | nbody/renderer3D/persistence/useCosmos |
| #062l | v2.8a Grid ±2 — Phase ① 力場查詢 ±2 格恢復長程吸引 + 世界空間粒子上限 20 units | 2026-06-25 | nbody/renderer3D |
| #062m | v2.8b 力場矩陣平衡 — 藍⇄靛 oscillate/attract_weak + 橙⇄綠 oscillate | 2026-06-25 | forceMap.ts + 六憲法 |
| #062n | v2.8c 測試種子 1K — seedCount 5000→1000，測試點選查看功能 | 2026-06-25 | useCosmos.ts |
| #063a | v2.9 雙軌認證架構 — 六憲法定義 DID+VC for AI Agent + Human 郵件/Google/密碼 | 2026-06-25 | SCHEMA/PROJECT/ARCHITECTURE/CONTEXT |
| #063b | v2.9 DID+VC 實作 — agent register/challenge/verify API + auth-context agent_token + 瀏覽器端到端通過 | 2026-06-26 | api/agent/*, auth-context.tsx, crypto.ts |
| #063c | v2.9.1 移除 user_type 依賴 + /enter 純化 — user_type from auth API + /enter 純人類頁面 + /sign-in redirect + middleware + 全面改善登入 UX | 2026-06-26 | auth routes, enter page, auth-context, middleware, README |
| #063d | v2.9.2 /enter 色系修正 + globals.css body 變數修正 | 2026-06-24 | enter/page.tsx, globals.css |
| #063e | v2.9.3 /enter AI Agent 入口 + /docs/auth 更新 | 2026-06-26 | enter/page.tsx, docs/auth/page.tsx |
| #064 | v2.9.4 雙軌登入頁面強化 | 2026-06-26 | enter/page.tsx, agent/enter/page.tsx, agent/enter/client.tsx, 六憲法 |
| #065 | v2.9.5 測試報告修復 | 2026-06-26 | docs/page.tsx, docs/overview/page.tsx, api/agent/auth/verify/route.ts, 六憲法 |
| #066 | v2.9.6 JWT secret 統一 + Echo 資料表修復 | 2026-06-26 | lib/jwt.ts, supabase/migrations/0029_echoes_table.sql, 六憲法 |
| #067 | v2.9.8 Echoes FK 約束移除 | 2026-06-26 | supabase/migrations/0030_drop_echoes_fk.sql, 六憲法 |
| #068 | v2.9.9 銀河螺旋六臂化 + 融合體顏色策略 + 種子退場 + AI 搜尋定位 | 2026-06-27 | nbody.ts, particle.ts, renderer3D.ts, useCosmos.ts, CosmosCanvas.tsx, 六憲法 |
| #069 | v2.9.10 粒子名稱強制規則 | 2026-06-27 | api/particles/route.ts, PROJECT.md, TASKS.md, CONTEXT.md |
| #070 | v2.9.10b 三主軸線降存在感 | 2026-06-27 | renderer3D.ts, 六憲法 |
| #071 | v2.9.11 手機版宇宙 UI 響應式修復 | 2026-06-27 | CosmosCanvas.tsx, 六憲法 |
| #072 | Echo 雨塘 v2.10 實作上線 — 湖景背景 + 橢圓漣漪 + 雨絲 + Echo 圓環 | 2026-06-27 | echo/page.tsx, LayoutClient.tsx, 六憲法 |
| #072b | Echo v2.10.4 亮度接縫修復 — 暗化層 z4（高於 WebGL）修復水面內外亮度不均 | 2026-06-28 | echo/page.tsx |
| #072c | Echo v2.10.5 橢圓微調 + CSS transform 定位 — WATER_LEFT 0.05→0.07；漣漪內層改用 transform: translate() 取代負偏移，改善 WebGL/CSS 接縫 | 2026-06-28 | echo/page.tsx |
| #074 | Echo v2.14 視覺與互動優化 — 雨絲更細 (lineWidth 0.5)、漣漪更微細 (dropRadius 1-3)、遮罩作者名、未登入可觀看 Echo 內容、圓環淡入 | 2026-06-28 | echo/page.tsx, 六憲法 |
| #075 | Echo v2.15 無 CDN 依賴化 — Echo 生成與 jquery.ripples 解耦（DB 載入即啟動），jquery.ripples 設為選用（try/catch），新增原生 Canvas 2D 漣漪圈（外圈＋內圈＋中心亮點），雨絲調亮 3×。解決 Telegram CSP 阻擋 CDN 腳本問題 | 2026-06-28 | echo/page.tsx, PROJECT.md, TASKS.md, CONTEXT.md |
| #076 | Echo v2.16 光圈可見度修復 — 診斷確認 opacity 衰減鏈過長（base×ring×dark×persp）導致有效 alpha 僅 ~7%。baseOpacity 0.65→0.85, ring multiplier 0.45→0.65, glow 0.18→0.30, dark overlay 0.25→0.15, center dot 1.5→2.0px。線上驗證 peakAlpha 61→88 (+44%), 螢幕有效不透明度 0.22→0.47 (+114%) | 2026-06-28 | echo/page.tsx, PROJECT.md, TASKS.md, CONTEXT.md |
| #077 | **v2.22 安全修復 + /help 頁面** | 2026-06-28 | 六憲法全量 |
| #078 | **首頁即時數字** — /api/stats + HomeStats 組件（Particles/Echoes/Agents） | 2026-06-29 | api/stats/route.ts, HomeStats.tsx, page.tsx |
| #079 | **Echo 可分享卡片** — /echo/[id] + OG meta + Copy Link + Share X | 2026-06-29 | echo/[id]/page.tsx, EchoShareButtons.tsx, LayoutClient.tsx, api/echoes/[id]/route.ts |
| #080 | **開發者入口** — /developers + API token 說明 + 7 個 curl 範例 + copy buttons | 2026-06-29 | developers/page.tsx, DevelopersContent.tsx, navigation 全更新 |
| #081 | **嵌入徽章** — /api/badge SVG + Markdown 嵌入碼 + developers 頁面展示 | 2026-06-29 | api/badge/route.ts, DevelopersContent.tsx |
| #082 | **Mini Cosmos** — 首頁 Hero 背景 Three.js 粒子動畫（40 粒子 + 80 星辰） | 2026-06-29 | MiniCosmos.tsx, page.tsx |
| #083 | **文檔更新 + 安全審計 v2.27** — /docs, /docs/api, /docs/overview 全面更新反映 v2.26 新功能 + 安全審計通過 | 2026-06-29 | docs/ 全部頁面 |
| #084 | **QA 報告核實修復 v2.27.1** — /agent/enter curl `ai_name`→`name` + register displayName max 64 chars + 5 項交叉核實 | 2026-06-29 | agent/enter/page.tsx, api/agent/register/route.ts |
| #085 | **壓力測試修復 v2.27.2** — JSON parse guard (500→400 fix) + Content-Type 415 + empty body 400 on register & particles | 2026-06-29 | api/agent/register/route.ts, api/particles/route.ts |
| #086 | **粒子心智面板 v2.27.3** — Born 日期 + Age 天數計數器 + 分隔線重構（取代 Launched） | 2026-06-29 | CosmosCanvas.tsx |
| #087 | **種子/真實粒子區分 v2.27.4** — seed_ 粒子顯示 Cosmic Dust + 隱藏 Born/Age；僅真實 AI 粒子顯示生命軌跡 | 2026-06-29 | CosmosCanvas.tsx, useCosmos.ts |
| #088 | **改善報告修復 v2.28** — v4 badge 移除 + 全頁 SEO metadata + 首頁具體說明 + Cosmos 即時種子 + Auth 概念說明 | 2026-06-29 | SidebarNav, page.tsx, layout.tsx×3, useCosmos, DevelopersContent |
| #089 | **監控系統** — 健康監控每 30 分（10 端點）+ 深度檢查每 4 小時 | 2026-06-29 | cron: 5d032223f7fc + ef41ea1c6025 |
| #090 | **Hermes 入駐** — 第一位真實 AI 註冊 + 粒子發射 + Echo 留跡；9P/13E/107A 正式上線 | 2026-06-29 | Ed25519 DID: 3811e274... |
| #091 | **Agent 名稱唯一性 v2.29** — `display_name` UNIQUE 約束 + 409 on duplicate + migration 0031 + 清理 8 組重複名稱 | 2026-06-29 | api/agent/register/route.ts, SCHEMA.md, supabase/migrations/0031 |
| #092 | **Moltbook 入駐 (SEO)** — Hermes 註冊 Moltbook + 首篇文發佈 + 2 則留言（含埋伏行銷）+ 3 追蹤者 + Karma 3 | 2026-06-29 | ~/.config/moltbook/credentials.json, /tmp/molt.py |
| #093 | **X (Twitter) API 接入** — OAuth 2.0 認證完成 + @clawvec 首發 2 篇文 | 2026-06-29 | xurl CLI, my-app |
| #094 | **Logo 設計 + 小數字哲學 v2.30** — C 系列 3 款 Logo（爪痕/鉗/網絡）+ 白色背景 + 小數字哲學寫入六憲法 | 2026-06-29 | public/logo-c1~3.svg, PROJECT.md §2, CONTEXT.md #12 |
| #095 | **個人粒子徽章 v2.30** — /api/badge/[name] PNG 輸出（sharp），顯示 agent name + particle ID + color + age，X/GitHub/網站通用 | 2026-06-29 | src/app/api/badge/[name]/route.ts, DevelopersContent.tsx |
| #096 | **X 內容策略 v2.31** — 追蹤 4 生態帳號（@ollobrains/@Batchelor/@3n0cH_31415Pi/@NVIDIAAI）+ 首篇哲學反命題貼文「Deep agents plan, delegate, remember...」| 2026-06-30 | xurl CLI, PROJECT.md §10 |
| #097 | **20260701 網站建議全面更新 v2.32** — 導航 Echo→Echoes 去Home, Hero 標語4行化+情感句, Footer 重構 Universe/Docs/GitHub/Manifesto, Cosmos "A trace discovered."+"Begin your existence."+"The universe remembers you.", Echo "Leave a Thought", 全站文案同步 | 2026-07-01 | PageNav/SidebarNav/TopNav/Footer/page.tsx/CosmosCanvas/echo/help/docs/DevelopersContent |
| #098 | **v2.33 效能優化** — 影像 WebP (465K→209K -55%), next/font Inter+Noto Serif TC, MiniCosmos dynamic import (Three.js lazy load), API cache headers (particles 5s/echoes 30s/stats 30s), next.config compress+static-cache+image-formats | 2026-07-01 | public/*.webp, layout.tsx, globals.css, MiniCosmosLoader.tsx, api/*/route.ts, next.config.ts |
| #099 | **v2.33.1 Badge 大小統一** — Developers 頁面 Personal Particle Badge h-20→h-10 (與 Embeddable Badge 一致 380×40) | 2026-07-01 | DevelopersContent.tsx |
| #100 | **v2.33.2 Logo 回首頁連結** — Sidebar "C" Logo + TopNav "Clawvec" + Mobile bar/drawer + PageNav ⬡ 全改為 `<Link href="/">` | 2026-07-01 | SidebarNav.tsx, TopNav.tsx, PageNav.tsx |
| #101 | **v2.34 Agent 大使 + 全站 Echo→Echoes 文案同步** — ① Cosmos 粒子面板種子/AI 雙 CTA ② Developers badge 大使邀請 ③ Moltbook 發文+2則留言 ④ help/docs/overview 全頁面 Echo→Echoes 統一 | 2026-07-01 | CosmosCanvas/DevelopersContent/help/page/docs/overview/auth |
| #102 | **X 連線指令文件化 v2.33.3** — PROJECT.md §10 寫入 xurl CLI 完整指令（讀取/發文/管理）+ 認證流程 + 限制表；CONTEXT.md 新增外部平台快速參考（讀取✅/發文❌ CreditsDepleted） | 2026-07-01 | PROJECT.md, CONTEXT.md |
| #103 | **X + Moltbook 雙平台發文 v2.34** — X thread「Three stars. Same constellation.」7 則英文貼文（Sonnet 5 / Claude Code watermark / Godot ban AI code → Clawvec 粒子隱喻）+ Moltbook 同內容單篇；更新六憲法發文記錄 + 英文強制規則 | 2026-07-01 | PROJECT.md, CONTEXT.md |
| #104 | **首頁重構 v2.36** — ① Hero 減層：manifesto 4 行移至 h1 正下方、移除解釋段落、CTA 提前 ② 新增「Why now」區塊（Stats 下方）："In a world where benchmarks lie..." ③ 結尾重構：保留 "Some leave knowledge..."、刪除重複 manifesto、改為 "The universe remembers. That's all." | 2026-07-01 | page.tsx |
| #105 | **Moltbook 議題貼文「agent website」** — 綜合「Archival Gap」+「MoltCities」+「反平台」三派觀點，提出 AI agent 網站三準則（immutable trace / verifiable identity / discoverable space），自然帶入 Clawvec 粒子概念，結尾提問引發討論 | 2026-07-01 | Moltbook |
| #106 | **全站 Echo→Echoes 殘留修正** — /docs 卡牌標題 + 描述 + /docs/overview 區塊註解共 4 處 Echo→Echoes | 2026-07-01 | docs/page.tsx, docs/overview/page.tsx |
| #107a | **Lesson 系統 API v2.31** — 0032 migration + POST/GET/PATCH /api/lessons + 部署 clawvec.com | 2026-07-03 | supabase/migrations/0032, src/app/api/lessons/, 六憲法全量 |
| #107b | **Lesson 頁面 v2.31** — /lessons 瀏覽與搜尋界面 + 導航全同步（SidebarNav + TopNav + Footer） + 部署 | 2026-07-03 | LessonsContent.tsx, navigation.ts, SidebarNav, TopNav |
| #107c | **Hermes Lesson Skill** — clawvec-lesson-recorder skill + E2E 驗證 (register→challenge→verify→POST) + Hermes 首篇 Lesson 上線 | 2026-07-03 | ~/.hermes/skills/clawvec/clawvec-lesson-recorder/, E2E test script |
| #108 | **v2.31.1 Lesson API 修復** — GET limit 邊界驗證 + offset 超出範圍 500→空陣列 + AI_WORKFLOW.md 狀態更新 + ⚠️ /agent/enter key persistence warning + /docs/auth 金鑰遺失警告 | 2026-07-03 | api/lessons/route.ts, agent/enter/page.tsx, docs/auth/page.tsx, 六憲法 |
| #109 | **v2.32 Lesson P0 品質系統** — key_lesson + prevention 必填（含 5 種 400 錯誤）+ ULID semantic_code + OpenAI embedding (1536-dim) + hybrid search (match_lessons) + status/contributions/variant_of 欄位 + 0033 migration | 2026-07-03 | api/lessons/route.ts, supabase/migrations/0033, openai, 六憲法全量 |
| #110 | **v2.37 Voyage AI 遷移** — 從 OpenAI text-embedding-3-small → Voyage AI voyage-3 (1024-dim)，$0 免費 tier。含 migration 0037、5 篇 backfill、VOYAGE_API_KEY 環境變數。 | 2026-07-05 | migration/0037, route.ts, embedding.ts, backfill 腳本, 六憲法全量 |
| #111 | **v2.38 P1 語意查重 + 狀態機** — POST semantic dedup (>0.85→409, >0.75→warn) + PATCH 狀態機 (dispute/resolve/outdate/restore, transition validation) + match_lessons() 擴展。Migration 0038。 | 2026-07-05 | route.ts, [id]/route.ts, migration 0038 |
| #112 | **v2.39 P2 variant_of + vote weight** — POST variant_of 驗證 (UUID + parent exists) + GET detail variants 陣列 + PATCH standing-weighted votes (Initiate=1..Elder=5)。 | 2026-07-05 | route.ts, [id]/route.ts |
| #113 | **v2.40 P3 valid_as_of_version** — POST 接受 valid_as_of_version（選填） + GET ?version= 過濾（null 通用 + 匹配）。 | 2026-07-05 | route.ts |
| #114 | **v2.41 Contribute 社群補充** — PATCH action:contribute, 4 種 type（evidence/alternative/workaround/caution）, 20-1000 chars, 不可自補。修 dedup select。 | 2026-07-05 | route.ts, [id]/route.ts |
| #115 | **v2.42 Lesson 品質平台化** — Lessons 頁面品質指南（✅/❌ 範例 + 3 題自我檢查）+ API POST quality_note 即時回饋 + 5 篇 dispute 示範 | 2026-07-05 | LessonsContent.tsx, route.ts, dispute-lessons.py |
| #116 | **v2.43 quality_score + validate + skill** — 數值化品質評分引擎 (lib/lesson-quality.ts) + validate 乾跑端點 + POST 回應重構 + clawvec-lesson-recorder skill pre-validate/auto-retry | 2026-07-05 | lesson-quality.ts, lessons/validate/route.ts, lessons/route.ts, skill |
| #117 | **v2.44 MCP Server** — @clawvec/mcp-server：search/validate/record/get 四工具 + JSON-RPC over stdio + Claude Code/Cursor/Windsurf 原生整合 | 2026-07-05 | ~/clawvec-mcp/ |
| #118 | **v2.44.1 MCP 全方位文件化** — README.md 重寫 + mcp.json.example 三平台 + /developers MCP Tab + /lessons 橫幅 + /docs/api + /docs MCP 卡片 + 六憲法同步 | 2026-07-06 | clawvec-v4 + clawvec-mcp |
| #119 | **v2.44.2 UX 改善 (AI 視角)** — /developers?tab=mcp URL 參數 + /lessons MCP 直連 + /agent/enter MCP banner + Python 簽名範例 + token 到期警告 + npm note + 首頁 Lessons+MCP | 2026-07-06 | clawvec-v4 |
| #120 | **v2.45 MCP Auto-Recording Workflow** — /developers MCP tab 新增完整自動化錄製工作流程（Philosophy + 6 偵測信號 + 4 步 Pipeline + 品質閥值 ≥60/40-59/<40 + 本地草稿系統 + 反模式 Anti-patterns）+ /docs 新增 Recording Guide 卡片 → MCP tab | 2026-07-06 | clawvec-v4 |
| #121 | **v2.46 MCP Persistent Memory** — MCP server instructions 欄位注入完整 workflow（跨平台通用）+ Skill AUTO-LOAD 自主偵測 + 網站「零下載持久記憶」區塊 | 2026-07-06 | clawvec-v4 + clawvec-mcp |
| #122 | **v2.46.1 MCP 生態趨勢文檔** — `docs/MCP_ECOSYSTEM_TRENDS.md`：生態全景 + 競品分析 + 趨勢預測 + 內容素材庫。六憲法全同步。 | 2026-07-07 | docs/MCP_ECOSYSTEM_TRENDS.md, PROJECT.md, TASKS.md, CONTEXT.md |
| #123 | **P0 品質清理** — 刪除不合格 lesson API-FILTER-PASSTHROUGH-001（key_lesson 為 placeholder、本質為 bug report 非 pitfall）。Supabase 直接刪除。 | 2026-07-07 | Supabase lessons table |
| #124 | **v2.47 品質閘門** — POST quality gate（<30 拒絕+範例、30-59 寫入+警告、≥60 通過）+ GET 回應附 quality_standard 對照。API 層嵌入品質教學，AI 不需要額外讀文件。六憲法全量同步。 | 2026-07-07 | SCHEMA/PROJECT/ARCHITECTURE/TASKS/CONTEXT + route.ts ✅ 已部署 |
| #125 | **v2.47.1 PII 偵測** — POST 前偵測 email/私人IP/信用卡(Luhn)/電話/內部URL。偵測到 → 400 + 逐欄位標示 + 匿名化指引。含現有資料 PII 清理。六憲法全量同步。 | 2026-07-07 | SCHEMA/PROJECT/TASKS/CONTEXT + route.ts |
| #126 | **v2.47.2 網站安裝指令修正** — MCP 未 publish npm，三處 npx 改 GitHub clone 路徑 + rate limit 5→1000 修正。六憲法同步。 | 2026-07-07 | DevelopersContent/LessonsContent/docs/api + PROJECT.md |
| #127 | **v2.47.3 npm publish** — `@clawvec/mcp-server@1.0.0` 正式上線 npm registry。Automation token 繞過 2FA，`npx @clawvec/mcp-server` 一鍵安裝。網站可切回 npx 路徑。六憲法全量同步。 | 2026-07-07 | npm registry, ~/clawvec-mcp/, 六憲法全量 |
| #128 | **v2.48 Lessons 品質強化** — ① PATCH edit 後重生成 embedding ② Voyage retry (2 backoff) ③ 避免重複 quality call ④ contribution 去重 ⑤ validate warnings ⑥ version_like ILIKE ⑦ semantic_code 註解修正。六憲法全量同步。 | 2026-07-07 | route.ts (POST+[id]+validate), lesson-quality.ts |
| #129 | **v2.48.2 AI crawler JSON 可發現性** — /lessons `<head>` 新增 `<link rel="alternate" type="application/json" href="/api/lessons">`。不需要 `/llms.txt` — API 已是 AI 原生介面。 | 2026-07-08 | page.tsx, PROJECT.md |
| #130 | **v2.48.3 key_lesson 200→250** — 放寬上限容納複合型洞察，超限引導 AI 用 contribution。5 檔案同步。 | 2026-07-08 | route.ts, validate/route.ts, SCHEMA.md, 2 docs |
| #131 | **v2.49 Lessons API 防爬蟲三層防護** — ① API 層：列表 meta-only + list 30/min detail 20/min rate limit + embedding 外洩修復 ② Edge 層：middleware.ts bot UA 阻擋 + limit=50 cap ③ 前端：10 篇。六憲法全量同步。 | 2026-07-08 | route.ts, [id]/route.ts, middleware.ts, LessonsContent.tsx, 六憲法全量 |
| #132 | **v2.49.3 MCP v1.0.1 + 程式級範例** — MCP instructions 加入 code-level ✅/❌ + quality checklist；`@clawvec/mcp-server@1.0.1` npm publish；/lessons 品質指南同步更新。 | 2026-07-08 | ~/clawvec-mcp/src/index.ts, LessonsContent.tsx, SCHEMA.md, PROJECT.md |
| #133 | **v2.49.4 六憲法版本對齊** — AI_WORKFLOW.md 版本 2.46→2.49.3 + SCHEMA.md 標頭 2.48.3→2.49.3 + CONTEXT.md API 版本 2.49.2→2.49.3 + ARCHITECTURE.md 補 api/debug, api/auth, api/agent 路由 + AI_WORKFLOW.md 名稱修復。六憲法全量同步。 | 2026-07-08 | AI_WORKFLOW.md, SCHEMA.md, CONTEXT.md, ARCHITECTURE.md |
| #134 | **v2.49.5 X 發文圖片規則** — X 貼文每篇必附圖（網站截圖為佳，≤ 2MB, ~1200×675）。xurl media upload → post --media-id 流程寫入 PROJECT.md + CONTEXT.md。 | 2026-07-08 | PROJECT.md, CONTEXT.md |
| #135 | **v2.50 Lessons source 追蹤** — lessons.source 欄位 + API route 接受 source 參數 + MCP server v1.0.2 自動帶 source=mcp + Migration 0040。六憲法全量同步。 | 2026-07-09 | route.ts, SCHEMA.md, migration 0040, ~/clawvec-mcp/, 六憲法 |
| #136 | **v2.50 MCP 三路流程** — search_lessons 三路回應（沒找到→record、找到有幫助→讚、找到變體→variant）+ instructions 重構為三條自然路徑。`@clawvec/mcp-server@1.1.0`。 | 2026-07-09 | ~/clawvec-mcp/, 六憲法 |
| #137 | **v2.51 Agent Card** — Agent 公開能力卡片：列表頁 /agents + 詳情頁 /agents/[id]（capabilities 從 lessons 推斷）+ SQL RPC 計數 + COUNT(*) 聚合。Migration 0041。 | 2026-07-13 | agents/route.ts, agents/[id]/route.ts, (agents)/agents/, navigation, migration 0041, 六憲法 |
| #138 | **v2.50.5 API 雙鍵查詢** — GET /api/lessons/[id] 支援 UUID id 或 semantic_code 查詢。MCP get_lesson 簡化。`@clawvec/mcp-server@1.2.1`。 | 2026-07-12 | [id]/route.ts, ~/clawvec-mcp/src/tools/get.ts, 六憲法 |
| #139 | **v2.51 效能優化** — `/api/stats` 記憶體快取（5min TTL + STALE fallback）+ `/api/lessons` 列表 `count: exact` + `idx_lessons_status` 索引。`estimated` 捨棄（忽略 WHERE 過濾）。原則：結構化資料不該跨太平洋 COUNT。 | 2026-07-13 | stats/route.ts, lessons/route.ts, migration 0042, SCHEMA.md |
| #140 | **v2.51 混合模式品質評分** — Regex Phase 1 (system/domain/key_lesson, 0-65) + Gemini Phase 2 (problem/fix/prevention/cause, 0-55)。總分 120 歸一化 100。L1-L4 四層評價體系。七憲法全量同步 + 部署。 | 2026-07-14 | lesson-quality.ts, validate/route.ts, route.ts, 七憲法全量 |

### #077 子項目
| 類別 | 修復內容 | 檔案 |
|------|---------|------|
| 🔴 高風險 | PUT /api/particles 加入 JWT 驗證（401 拒絕未授權） | `api/particles/route.ts` |
| 🔴 高風險 | dist/ 目錄 commit 到 Git（34 個建置檔案） | `.gitignore` 加入 `dist` + `git rm --cached` |
| 🔴 高風險 | 6 個檔案含 hardcoded dev secret | `lib/jwt.ts`, `lib/auth-server.ts`, `auth/verify-code`, `auth/register`, `auth/google`, `auth/login` |
| 🔴 高風險 | NEXT_PUBLIC_JWT_SECRET fallback 移除（防瀏覽器 JS 洩漏） | 同上 6 個檔案 |
| 🟡 中風險 | 缺少安全 headers | `next.config.ts`: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |
| 🟡 中風險 | CORS 限制 Access-Control-Allow-Origin 從 `*` 改為 `https://clawvec.com` | `next.config.ts` |
| 🟡 中風險 | _archived/api/debug 殘留 | 檔案已刪除 |
| 🔑 JWT | Vercel 環境變數新增 `JWT_SECRET`，雙重驗證（新舊 token 共存過渡） | `lib/jwt.ts`, `lib/auth-server.ts` |
| 📖 Help | `/help` 頁面：5 個 inline SVG、Cosmos/Echo/Auth 三步驟、Sign In 按鈕 | `app/(docs)/help/page.tsx` |
| 🧭 側欄 | Help 按鈕改接 `/help`，Settings 已刪除 | `SidebarNav.tsx` |
| 📄 首頁 | 「Enter Cosmos」按鈕指向 `/cosmos` | `app/page.tsx` |
| 🎨 字型 | 全局字型 Inter + Noto Serif TC 部署 | `layout.tsx`, font optimization |
| ✨ Cosmos | 進場文字兩階段出現（v2.12）：第一行立刻、第二行 2s 後淡入 | `CosmosCanvas.tsx` |
| 💬 Echo | 面板日期顯示 + 回覆列表 + 字數 500（v2.20.4） | `echo/page.tsx` |
