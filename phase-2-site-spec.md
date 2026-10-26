# Artisanso Site Phase 2 Specification

**版本：** v1  
**來源：** [phase-2-spec.md](./phase-2-spec.md) §4 · 前置：`artisanso-site/spec.md`、[phase-2-frontend-spec.md](./phase-2-frontend-spec.md)（admin 端）  
**範圍：** 前台新增獨立「工程進度頁」`/progress`，客人憑 `access_code` 睇 milestone、工程相同留言

## 1. 目標同交付範圍

`artisanso-site` 現時係純展示網站（一頁式 + 公開作品 API）。Phase 2 加一個**獨立頁面**，同現有一頁式網站分開。完成後客人應可以：

1. 經 admin 派發嘅連結（`https://artisanso.com/progress#code=AS-...`）直接打開自己工程嘅進度頁。
2. 睇到工程摘要（名稱、地區、狀態、封面）。
3. 睇到 `visible_to_client=true` 嘅 milestone 時間線（狀態、預計／完成日期、`client_summary`）。
4. 睇到 `client_visible=true` 嘅工程相。
5. 睇到同匠方職員嘅留言時間線，並留言。
6. 連結失效（rotate、工程完結）時，得到清楚但**不洩漏原因**嘅提示。

Phase 2 site **不包括**：客人註冊／登入／cookie、留言編輯／刪除／附件、通知（email／WhatsApp）、即時推送、多工程切換、報價／PDF（Phase 3）、`access_code` 派發 UI（屬 admin portal，見 `phase-2-frontend-spec.md` §12.2）、現有一頁式網站內容改動（除 §10 列出者）。

## 2. 技術棧

沿用 site 現有棧，**唔新增 runtime 依賴**：

| 範疇       | 現況／選擇                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Build／SSG | Vite + `vite-react-ssg`（`pnpm build` 預渲染各 route 成靜態 HTML）                                     |
| UI         | React 19 + Tailwind CSS v4（沿用 `@theme` tokens：`brand`、`accent`、`surface`）                       |
| Routing    | `react-router-dom`（已隨 `vite-react-ssg` 使用）；`spec.md`「唔使 Router」已過時，新頁面正式使用 route |
| State      | React state + 自家 hook；**唔引入 state library**（承接 site 原則）                                    |
| Data       | 原生 `fetch`，沿用 `useProjects.ts` 風格                                                               |
| Test       | 新增 devDependency：Vitest + React Testing Library + MSW（同 portal，pin 精確版本；見 §13、§14.5）     |

代碼規範沿用 `spec.md` §7 同 `~/.claude` 全域規範（`import React` 第一行、`React.useXxx()`、`<React.Fragment>`、component `export const`、hook `export function useXxx`、元件內 arrow function 唔包 `useCallback`、元件外 `function xxx()`）。Prettier 按專案 `.prettierrc`（4 space、printWidth 200、tailwind plugin）；唔跑 ESLint／Type Check。

## 3. 專案結構（新增／修改）

```
src/
  main.tsx                         # 改：加 /progress route
  app.tsx                          # 不變（一頁式主站）
  api/
    clientApi.ts                   # 新：/client/* 請求（帶 X-Access-Code）、error 解析
  constants/
    api.ts                         # 新：API_ORIGIN（統一 base URL，見 §4）
  types/
    progress.ts                    # 新：ClientProject、ClientMilestone、ClientComment、ApiError
  utils/
    accessCode.ts                  # 新：normalize、storage 讀寫、fragment 讀取
    dates.ts                       # 新：date-only（YYYY-MM-DD）格式化
  hooks/
    useAccessCode.ts               # 新：fragment → storage → 清 URL；狀態機
    useClientProject.ts            # 新：GET /client/project
    useClientComments.ts           # 新：GET／POST /client/comments
  pages/
    ProgressPage.tsx               # 新：route element，組合各 section
  components/
    progress/
      ProgressLayout.tsx           # 獨立 layout：簡化 header + footer
      AccessGate.tsx               # 手動輸入 code／錯誤狀態
      ProjectSummary.tsx           # 工程摘要 + 封面
      MilestoneTimeline.tsx
      MilestoneItem.tsx
      ProgressPhotos.tsx           # 重用 Lightbox / useLightbox
      CommentThread.tsx
      CommentComposer.tsx
```

## 4. Route 同 SSG

| 路徑        | 頁面           | 說明                                                          |
| ----------- | -------------- | ------------------------------------------------------------- |
| `/`         | `App`          | 一頁式主站（不變）                                            |
| `/progress` | `ProgressPage` | 獨立進度頁；**唔使 path param**（code 只在 fragment／header） |
| `*`         | —              | 現狀沿用                                                      |

- `main.tsx` 的 `ViteReactSSG` routes 加入 `{ path: "/progress", element: <ProgressPage /> }`。SSG 預渲染出 `/progress` 靜態 HTML，內容為**載入中的殼**（見 §5.4），不含任何客人資料。
- `/progress` **不入** `sitemap.xml`，`robots.txt` 加 `Disallow: /progress`。頁面 `<head>`（用 `vite-react-ssg` 的 `Head`）設：
  - `<meta name="robots" content="noindex, nofollow, noarchive">`
  - `<meta name="referrer" content="no-referrer">`
  - `<title>工程進度｜匠方工程</title>`；不加 canonical／OG／JSON-LD（避免連結預覽帶出內容）。
- **API base URL 統一：** 現時 `.env.example` 為 `https://api.artisanso.com/api/v1`，但 `useProjects.ts` 又再加 `/api/v1`，兩者互相矛盾（`.env` 實際為 `https://api.artisanso.com`）。Phase 2 新增 `constants/api.ts`：`VITE_API_BASE_URL` 定義為 **API origin（不含 `/api/v1`）**，`API_ORIGIN` 由此取值，`clientApi.ts` 與 `useProjects.ts` 都用 `${API_ORIGIN}/api/v1/...`；同步修正 `.env.example`。
- 所有 `window`／`localStorage`／`location` 存取只准出現在 `useEffect` 或事件 handler 內，**唔可以喺 render 階段讀**，否則 SSG 預渲染會 throw 或 hydration mismatch。

## 5. 認證流程（無 session，只有 `X-Access-Code`）

承接後端 §4.1。前台**冇登入 API、冇 cookie**。

### 5.1 取得 code

優先次序：

1. **URL fragment**：`location.hash` 形如 `#code=AS-7K3Q-M9XD-4TRB-H2WV`，用 `URLSearchParams(hash.slice(1)).get("code")` 讀取。
2. **瀏覽器儲存**：`localStorage["artisanso.progress.code"]`（見 §5.3）。
3. **手動輸入**：以上皆無時顯示 `AccessGate`（§5.5）。

讀到 fragment 之後 **立即** `history.replaceState(null, "", location.pathname + location.search)` 清走 fragment（避免留喺網址列、書籤、截圖、之後分享），然後才 call API。若 fragment 與已儲存 code 不同，以 fragment 為準並覆蓋儲存。

### 5.2 請求

每個 `/client/*` 請求都帶 header：

```
X-Access-Code: <code>
```

- Code **只**放 header；唔放 path、query、body、`console`、error message、`document.title`。
- Code 以使用者輸入／連結原樣（trim 後）送出，**由後端 normalize**（大小寫、`-`、`O/0`、`I/L/1`）；前端唔做自家 normalize 來判斷有效性，只做 trim。
- 請求不設 `credentials`（預設 `same-origin`，跨域即不帶 cookie），符合後端「無 cookie」設計。
- 後端 response 帶 `Cache-Control: no-store`；前端 `fetch` 加 `cache: "no-store"`。

### 5.3 儲存

- Code 存 `localStorage`（key：`artisanso.progress.code`），令客人下次直接開 `https://artisanso.com/progress` 即可，不用保留原連結。
- 頁面提供「登出此裝置」（頁尾連結）：刪除 storage、清空記憶體 state、返回 `AccessGate`，用於共用電腦。
- 儲存只存 code 字串，不存任何 response 資料（工程資料每次實時 fetch）。
- 所有 `localStorage` 操作包 `try/catch`（私隱模式／儲存被禁用時降級為只存記憶體，頁面照常運作，但提示「下次需重新使用連結」）。
- 全站**不載入**第三方 script（analytics、chat widget）於 `/progress`，避免 code 外洩。

### 5.4 狀態機（`useAccessCode`）

```
init ──(effect: 讀 fragment/storage)──► checking ──(200)──► ready
  │                                        │
  └──(兩者皆無)──► needs_code ◄──(401)─────┘  （並清除已儲存 code）
                       │                    └─(429)──► rate_limited(retryAfter)
                       └──(使用者輸入並送出)──► checking
```

- `init`／SSG 預渲染階段只渲染骨架（`Skeleton` 灰塊 + 「載入中」文字，`aria-busy`），**不渲染 `AccessGate`**，避免一閃而過。
- 驗證 code 就係成功 call 一次 `GET /client/project`：`200` → `ready` 並存 code；`401` → 清除 storage，進 `needs_code` 並顯示錯誤；網絡／`5xx` → `error`（可重試，**不清** storage）。
- `ready` 之後任何 `/client/*` 請求回 `401`（例如 admin rotate 咗 code、工程已完結）：清除 storage，返回 `needs_code`，顯示 §5.6 提示。

### 5.5 `AccessGate`

- 單一輸入框「存取碼」（label 可見、`autoComplete="off"`、`autoCapitalize="characters"`、`spellCheck={false}`）+「查看進度」按鈕；placeholder `AS-XXXX-XXXX-XXXX-XXXX`。
- 前端只做最低限度檢查：trim 後不可為空。**格式是否正確交畀後端判斷**（`401` 不分原因）。
- 提交中 disabled，防重複送出。
- 下方說明：「存取碼由匠方工程提供。如遺失，請 WhatsApp 聯絡我們。」，附 `wa.me` 連結（沿用 `constants/contact.ts`，**不預填 code、不預填任何工程資料**）。

### 5.6 錯誤文案（不洩漏原因）

| 情況                          | 顯示                                                                                                     |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| `401`（任何原因，含手動輸入） | 「存取碼無效或已失效，請向匠方工程查詢。」                                                               |
| `429 rate_limited`            | 「嘗試次數過多，請 N 秒後再試。」（N 取自 `Retry-After`，倒數期間輸入框與按鈕 disabled；缺少時用 60 秒） |
| 網絡錯誤／`5xx`               | 「暫時未能載入，請稍後重試。」+ 重試按鈕                                                                 |

`401` 的文案必須與後端一樣刻意含糊；**唔好**寫成「工程已完結」「code 已更換」等可區分原因的字眼。

## 6. API 模組與型別

### 6.1 `clientApi.ts`

```ts
clientGet<T>(path, code, signal?)           // GET  ${API_ORIGIN}/api/v1/client${path}
clientPost<T>(path, code, body, signal?)    // POST，JSON body
```

- 統一解析成 `{ data, meta? }` 或 `ApiError`（`status`、`code`、`message`、`details?`、`requestId?`、`retryAfter?`），型別形狀同 portal 的 `ApiError` 一致。
- `Retry-After` header（秒）解析入 `retryAfter`；非數字或缺少時為 `undefined`。
- Network 失敗（`fetch` throw）轉成 `code: "network_error"`。
- `AbortSignal` 支援；component unmount 時取消進行中請求。
- **跨域 CORS：** 因為帶自訂 header `X-Access-Code`，瀏覽器會先發 preflight；後端需 allow origin（前台域名）及該 request header（後端 §9 已列明，部署前需驗證，見 §14.3）。
- 不做任何自動 retry（尤其 `POST`）。

### 6.2 型別（`types/progress.ts`）

```ts
export type ClientMilestoneStatus = "pending" | "in_progress" | "done";

export type ClientMilestone = {
  id: string;
  title: string;
  status: ClientMilestoneStatus;
  position: number;
  due_on: string | null; // YYYY-MM-DD
  completed_on: string | null; // YYYY-MM-DD
  client_summary: string | null;
};

export type ClientPhoto = {
  id: string;
  url: string;
  role: "cover" | "gallery";
  position: number;
};

export type ClientProject = {
  title: string;
  slug: string;
  category: "home" | "office" | "village" | "factory";
  district: string | null;
  status: "lead" | "active";
  cover_photo: { id: string; url: string } | null;
  milestones: ClientMilestone[];
  photos: ClientPhoto[];
};

export type ClientComment = {
  id: string;
  author_role: "client" | "staff";
  author_name: string;
  body: string;
  created_at: string; // ISO 8601 UTC
};
```

- Response 多出未知欄位直接忽略。前端**永不預期**也不處理 `access_code`、`client_name`、`internal_note`、`admin_user_id`；如意外出現亦不渲染、不 log。
- 前端不信任後端排序以外的假設：milestone 按 `position ASC` 後再按原順序（穩定排序）顯示；留言按 server 回傳順序。

## 7. 頁面佈局（`/progress`）

獨立 layout（`ProgressLayout`），**唔重用**主站 `Header`（含 hash 導航）、`FloatingWhatsApp`，避免主站導航連去 `/#about` 等造成混淆。

```
┌ 簡化 Header：logo + 匠方工程 ·「工程進度」        [回到主站] ┐
│
│  ProjectSummary   工程名稱 · 地區 · 類別 · 狀態 badge · 封面
│  ───────────────
│  進度 (MilestoneTimeline)
│  工程相片 (ProgressPhotos，如有)
│  留言 (CommentThread + CommentComposer)
│
└ Footer：聯絡我們（電話／WhatsApp）· 「登出此裝置」· Copyright ┘
```

- 單欄置中，`max-w-3xl`；Mobile First；沿用 `bg-surface`、`text-brand`、`accent` tokens。
- 頁內導航：頂部（Summary 下方）一排 anchor 連結「進度／相片／留言」，`scroll-mt-*` 避免被 sticky header 遮擋。**注意：** 因為 fragment 已被用作 code 傳遞（之後清走），頁內 anchor 用 `#progress-milestones` 等純 id，不會與 `#code=` 衝突；亦唔使 hash router。
- 「回到主站」連去 `/`。
- 載入中：各 section 用 skeleton；全部 section 共用同一個 `GET /client/project` 結果。

## 8. 工程摘要（`ProjectSummary`）

資料：`GET /client/project`。

- 顯示 `title`（`<h1>`）、`district`、類別（沿用 site 既有類別中文標籤；缺少則不顯示）、狀態 badge：`lead` = 「籌備中」、`active` = 「施工中」。
- 封面：`cover_photo` 有值才顯示，`aspect-[4/3]`（或 `16/9`）+ `object-cover`、`width`／`height` 防 layout shift；`null` 時完全不顯示（唔用佔位圖，避免暗示有未公開相片）。
- 進度摘要：「已完成 X / Y 項」，X = `status=done` 數，Y = `milestones.length`；`Y=0` 時不顯示。以可見 milestone 計算，文案標明「已公開進度」，避免客人誤解為整體百分比。
- 不顯示 `client_name`（後端亦不返回）。

## 9. 進度時間線（`MilestoneTimeline`）

資料：`ClientProject.milestones`（已由後端過濾為 `visible_to_client=true`）。

- 垂直時間線，每項：狀態標記（圓點／icon）、`title`、狀態文字、日期、`client_summary`。
- 狀態表達（**文字 + icon，不單靠顏色**）：

  | status        | 文字   | 視覺                           |
  | ------------- | ------ | ------------------------------ |
  | `pending`     | 待開始 | 空心灰圓                       |
  | `in_progress` | 進行中 | `accent` 實心圓 + 輕微高亮背景 |
  | `done`        | 已完成 | 綠色 check                     |

- 日期：
  - `done` 且有 `completed_on` → 「完成於 2026年11月1日」；
  - 否則有 `due_on` → 「預計 2026年11月1日」；
  - 都冇 → 不顯示日期。
  - **客人端不顯示「已逾期」**（避免未經溝通的負面標示；逾期為 admin 內部資訊）。
- `client_summary` 為 `null` 時只顯示標題／狀態／日期。以 `whitespace-pre-line` 顯示純文字；**絕不用 `dangerouslySetInnerHTML`**，不自動轉連結。
- 冇任何可見 milestone：empty state「工程進度更新稍後會顯示在此。」
- Date-only 字串 `YYYY-MM-DD` **不經 `new Date()` 解析**（避免時區偏移一日），用字串拆分格式化為 `zh-HK`「2026年11月1日」。
- `<ol>` 語意列表；`in_progress` 項目加 `aria-current="step"`。

## 10. 工程相片（`ProgressPhotos`）

後端免費提供 `photos`（`client_visible=true`），Phase 2 一併呈現，重用現有 `Lightbox`／`useLightbox`：

- 縮圖 Grid（Mobile 2 欄 / `md` 3 欄），`loading="lazy"`、固定 `aspect-*`；`alt` 為「{title} 工程相片 {n}」。
- 點擊開 Lightbox：將 `photos` 組成現有 `Project` 型別（`{ id, categoryId: "", name: title, images, cover: null }`）傳入，行為（鍵盤、swipe、focus 還原）完全沿用。
- 冇相片：整個 section 不顯示。
- 相片 URL 來自 eImage（`img.eservice-hk.net`，見 §12 CSP）。

> 現有主站改動只限：`useProjects.ts` 改用 `API_ORIGIN`（§4）；`Lightbox` 無須改動。如要把相片 section 延後，可獨立移除而不影響其他部分。

## 11. 留言（`CommentThread`／`CommentComposer`）

資料：`GET`／`POST /client/comments`。

### 11.1 時間線

- `per_page=100`，逐頁拉取直到 `page >= total_pages`（上限 10 頁；超出顯示「只顯示最早 1000 則」）。
- 由舊到新由上而下；首次載入後捲到留言區底部（**僅限用戶在留言區內操作後**，避免進頁面就被拉到最底而錯過進度）。
- 每則：名稱、時間（`zh-HK`，`dateStyle: medium` + `timeStyle: short`）、內容。
  - `author_role === "client"` → 靠右，名稱顯示「你」；
  - `author_role === "staff"` → 靠左，名稱顯示「匠方工程」（**不顯示** `author_name`，避免暴露內部 username）。
  - 角色用文字標示，不單靠位置／顏色。
- `body` 以純文字顯示：`whitespace-pre-wrap`、`break-words`，不 render HTML／Markdown、不自動轉連結。
- 冇留言：「有任何問題，歡迎在下方留言。」
- 時間線容器 `role="log"` + `aria-live="polite"`。
- 「重新整理」按鈕；browser tab 重新可見（`visibilitychange`）時自動 refetch 一次（`GET /client/project` 同 `comments` 一併更新，令進度亦更新）。**不做定時輪詢**（後端冇推送，亦避免製造不必要請求）。

### 11.2 留言輸入

- Textarea（label「留言」，可見），`body` trim 後 1..2000，附字數計數；空白或超長時「送出」disabled。
- 提示：「留言送出後無法修改或刪除。」
- 送出：`POST /client/comments`，body 只有 `{ "comment": { "body": "..." } }`。**不送** `author_*`、`project_id`。
- 送出期間輸入框／按鈕 disabled（防重複送出；留言不可刪）；`Ctrl／⌘ + Enter` 可送出。
- 成功（`201`）：清空輸入框、refetch、捲到最新留言、`aria-live` 播報「留言已送出」。
- 失敗：保留內容。
  - `422 validation_failed`：顯示 `details.body`；
  - `429 rate_limited`（每工程每分鐘 10 則）：「留言太頻密，請 N 秒後再試。」按鈕倒數 disabled；
  - `401`：照 §5.4 返回 `needs_code`（草稿保留於記憶體，重新驗證後仍在）；
  - 網絡錯誤／`5xx`：先 refetch；若時間線末端已出現同一 `body` 嘅客人留言，提示「留言可能已送出」，**不自動重試**。
- 工程 `status` 為 `lead`／`active` 才進得來，故 composer 無需判斷 status。

## 12. 安全、私隱與部署

- **Code = 密碼。** 不放 URL path／query、不 `console.log`、不寫入 DOM（包括 `data-*`、title、錯誤訊息）、不傳去任何第三方。
- **Referrer：** `<meta name="referrer" content="no-referrer">`；站內對外連結（`wa.me`、`tel:`）加 `rel="noopener noreferrer"`。託管層 header 同樣設 `Referrer-Policy: no-referrer`（針對 `/progress`）。
- **傳輸：** 只准 HTTPS。
- **CSP（託管層 header，針對 `/progress`）：** `default-src 'self'`；`script-src 'self'`；`img-src 'self' data: https://img.eservice-hk.net`；`connect-src 'self' <API origin>`；`frame-ancestors 'none'`；`base-uri 'self'`。由於 Tailwind v4 build 產出外部 CSS，`style-src 'self'` 即可；如 Lightbox 有 inline style，需加 `'unsafe-inline'` 於 `style-src`（部署前核對）。
- **XSS：** 所有後端內容（`title`、`client_summary`、`body`、`author_name`）一律當純文字；React 預設轉義，嚴禁 `dangerouslySetInnerHTML`。
- **快取：** HTML 殼不含資料，可正常 CDN 快取；API response 由後端 `no-store`。
- **Log／監控：** `/progress` 不接 analytics／error SDK。主站如將來加 GA／Pixel（`spec.md` §10.6），必須排除 `/progress` 路徑，且不得採集 `location.hash`。
- **共用裝置：** 提供「登出此裝置」（§5.3）。
- **轉發連結：** 持有連結即可睇，留言以客人身份顯示（後端已知風險，見 `phase-2-spec.md` §11.2）；前台唔額外處理，但文案提醒「請勿轉發此連結」（頁尾小字）。
- 託管平台目前未定（`spec.md` §10.5）。Header／rewrite 規則需按平台寫配置檔（例如 Vercel `vercel.json`、Netlify `_headers`），列入部署清單（§14.4）。

## 13. 無障礙、效能、回應式

- 語意化：`header`／`main`／`section`（各帶 `aria-labelledby`）／`footer`；單一 `<h1>`（工程名稱）。
- 所有表單控件有可見 label；錯誤以 `aria-describedby` 關聯，並 focus 到第一個錯誤。
- 動態更新（載入完成、留言送出、錯誤）用 `aria-live`；時間線 `role="log"`。
- 最小點擊面積 44×44px；對比度符合 WCAG AA 目標（`accent` 在 `surface` 上的小字需人手核對）。
- `prefers-reduced-motion` 下關閉時間線入場動畫（沿用主站 `motion-reduce:` 做法）。
- 效能：`/progress` 為獨立 route，**主站 Hero 動畫、Showcase 等不載入**（route-level code splitting，`React.lazy` 於 route 層即可）。Lighthouse Mobile Performance ≥ 90、Accessibility ≥ 95。
- 回應式：375／768／1280 無橫向 scroll；窄螢幕留言氣泡最大寬度 85%。

## 14. 待確認／部署清單

1. **code 儲存位置：** 暫定 `localStorage`（客人可日後直接開 `/progress`）。如判斷共用裝置風險較高，改 `sessionStorage`（關 tab 即清、每次需重開連結）。需業務確認。
2. **`completed` 工程客人可否仍睇：** 取決於後端 `phase-2-spec.md` §11.1。若放寬，`ClientProject.status` 要加 `completed`，並加 badge「已完工」，§5.6 文案不變。
3. **CORS 驗證：** 後端須 allow 前台 origin 同 request header `X-Access-Code`、並正確回應 `OPTIONS` preflight（`Access-Control-Allow-Headers`）。部署前用真實域名測試。
4. **託管配置：** 為 `/progress` 設 `Referrer-Policy`、CSP、`X-Content-Type-Options`；確認平台能直出 `/progress`（SSG 的 `progress/index.html` 或 `progress.html`）而不 rewrite 去主站。
5. **測試基建：** site 目前冇測試。本 spec 建議新增 Vitest + RTL + MSW（devDependency，同 portal 版本）。如暫不引入，驗收只靠 §15 手動項目，並保留純函式（`accessCode.ts`、`dates.ts`）可後補單元測試。
6. **Code 派發方式：** 客人點擊連結前，職員點樣由 admin 拎到連結（admin portal 尚未做 access code 面板）。見 `phase-2-frontend-spec.md` §12.2。
7. **留言通知：** 職員回覆後客人點得知？暫無（需另開 email／WhatsApp 通知需求）；目前客人需自行再開連結／重新整理。
8. **主站導航入口：** 是否在主站加「客戶進度查詢」連結（連去 `/progress` 的 `AccessGate`）？暫定**不加**（保持主站專注轉換，亦減少撞 code 流量）；客人只經派發連結進入。

## 15. 驗收標準

### 認證

- 開 `/progress#code=<合法 code>`：成功顯示工程；網址列 fragment 即時被清走（`location.hash === ""`），refresh 後仍可透過 storage 自動載入。
- 開 `/progress`（無 storage）：顯示 `AccessGate`；輸入合法 code（含小寫、冇 `-`、前後空白）可進入。
- 錯誤 / 已 rotate / 工程已完結的 code：全部顯示同一句 `401` 文案，無法區分原因，並清除 storage。
- Admin rotate 後，客人 refresh 或下次請求（含重新整理、送出留言）即返回 `AccessGate`。
- `429` 顯示倒數，期間不可提交；倒數結束自動恢復。
- Code 絕不出現喺：URL（fragment 清走後）、任何 request 的 path／query／body、`console`、DOM 屬性、錯誤訊息、`Referer`。可用瀏覽器 DevTools Network 驗證每個 `/client/*` 請求只有 `X-Access-Code` header 帶 code。
- 「登出此裝置」後 storage 清空、返回 `AccessGate`；按返回鍵不能睇到舊資料。
- 禁用 `localStorage` 時頁面仍可使用（提示下次需重新用連結）。

### 內容

- 時間線只顯示後端返回的 milestone，按 `position` 順序；`pending`／`in_progress`／`done` 各有不同文字 + icon；日期顯示「完成於／預計」，date-only 無時區偏移。
- 無 `client_summary` 時只顯示標題／狀態／日期；客人端無「已逾期」字樣。
- `cover_photo` 為 `null` 時不顯示封面；`photos` 為空時不顯示相片 section；Lightbox 鍵盤、swipe、Esc、focus 還原正常。
- 惡意內容（`<script>`、`<img onerror>`、長 URL）出現喺 `title`／`client_summary`／留言時，只以純文字顯示，不執行、不轉連結。
- 頁面任何位置不出現 `access_code`、`client_name`、`internal_note`、`admin_user_id`。

### 留言

- 時間線由舊到新；客人留言標「你」，職員標「匠方工程」（不顯示 username）。
- 空白、超過 2000 字不可送出；送出期間無法重複送出；成功後清空並顯示新留言。
- 失敗（`422`／`429`／網絡）保留草稿並顯示對應錯誤；網絡錯誤後不自動重送。
- 前端 request body 只含 `{ comment: { body } }`。

### 非功能

- `pnpm build`（`vite-react-ssg build`）成功，並產出 `/progress` 靜態頁；預渲染 HTML 不含任何客人資料；hydration 無 mismatch warning。
- `/progress` 不在 `sitemap.xml`、`robots.txt` 已 `Disallow`、頁面有 `noindex` meta。
- 375／768／1280 三個闊度無橫向 scroll；Lighthouse Mobile：Performance ≥ 90、Accessibility ≥ 95。
- 主站 `/` 行為不變（含 `useProjects` 於修正 base URL 後仍正常取得作品）。
- 若引入 Vitest：覆蓋 `accessCode.ts`（fragment 解析、storage 失敗降級）、`dates.ts`、`clientApi.ts`（`Retry-After`、`401`／`429`／network 解析、header 只帶 `X-Access-Code`）、`useAccessCode` 狀態機、留言 composer（驗證、防重複送出、失敗保留草稿、純文字渲染）；MSW 模擬 `/client/*`，測試不得打真實後端。
- Prettier 格式化通過。
