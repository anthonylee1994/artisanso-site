# artisanso-site — Functional Spec

匠方工程（Artisanso Engineering）官方網站。純前端 SPA／SSG，後端 API 另有 repo（`https://api.artisanso.com`）。

> 本文件係業務邏輯同代碼實作嘅入口。改動功能後、commit 前必須同步更新。
> `phase-1-site-spec.md`、`phase-2-site-spec.md` 係早期設計稿，如與本文件有出入，以本文件同代碼為準。

## 1. 概覽

| 範疇                   | 說明                                                                                                           |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| 公開主站 `/`           | 一頁式宣傳網站：作品展示 + WhatsApp 報價表單，目標係令訪客 WhatsApp 查詢                                       |
| 客戶進度頁 `/progress` | 客戶用存取碼（access code）睇工程進度、相片、報價單／發票 PDF，並同公司留言                                    |
| 語言                   | 繁體中文（香港），`<html lang="zh-HK">`                                                                        |
| 聯絡資料               | 電話 `51717371`、WhatsApp `85251717371`、`info@artisanso.com`、IG `@artisansohk`（`src/constants/contact.ts`） |

### 1.1 Tech Stack

React 19、TypeScript、Vite 8、Tailwind CSS v4、`vite-react-ssg`（SSG）、`react-router-dom` 6、`zustand`（狀態）、`@react-pdf/renderer`（PDF）、`react-icons`、Prettier。部署於 Vercel（`vercel.json`）。

### 1.2 Scripts

| Script        | 用途                                |
| ------------- | ----------------------------------- |
| `pnpm dev`    | 開發伺服器                          |
| `pnpm build`  | `vite-react-ssg build`，預渲染 HTML |
| `pnpm format` | Prettier                            |

### 1.3 環境變數

| 變數                | 說明                                                                       |
| ------------------- | -------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | API origin（不含 `/api/v1`，尾部 `/` 會被去除），見 `src/constants/api.ts` |

## 2. 路由與渲染

定義於 `src/main.tsx`。

| Path        | 元件           | Loader           | 備註                          |
| ----------- | -------------- | ---------------- | ----------------------------- |
| `/`         | `App`          | `projectsLoader` | Build 時預載作品寫入 HTML     |
| `/progress` | `ProgressPage` | 無               | 客戶端渲染資料；`noindex`     |
| `*`         | —              | —                | `<Navigate to="/" replace />` |

`/progress` 嘅防洩漏措施：

- `vercel.json` 為 `/progress` 加 `Referrer-Policy: no-referrer`、`X-Content-Type-Options: nosniff`、`X-Robots-Tag: noindex, nofollow, noarchive`、CSP（`img-src` 只允許 `self`、`data:`、`https://img.eservice-hk.net`；`connect-src` 只允許 `self`、`data:`、`https://api.artisanso.com`；`script-src` 含 `'wasm-unsafe-eval'` 供 PDF 渲染；`frame-ancestors 'none'`）。
- `ProgressLayout` 加 `<meta name="robots">` 同 `<meta name="referrer" content="no-referrer">`。
- `public/robots.txt` `Disallow: /progress`。

## 3. 公開主站（`/`）

結構（`src/app.tsx`）：`Header` → `Hero` → `About` → `Showcase` → `QuoteForm` → `Contact` → `Footer` + `FloatingWhatsApp`。

### 3.1 Header（`components/layout/Header.tsx`）

- Sticky；導航項目：首頁 `#home`、關於我們 `#about`、作品展示 `#showcase`、即時報價 `#quote`、聯絡我們 `#contact`。
- Desktop 橫向導航；Mobile 用 hamburger（`useMenuStore` 管開合，點擊連結後自動收起）。
- `useActiveSection` 用 `IntersectionObserver`（`rootMargin: -40% 0 -55% 0`）標示當前 section（mobile 選單高亮）。
- 頂部有 scroll progress bar。

### 3.2 Hero（`components/sections/Hero`）

- 全幅 carousel，每張 slide 係一個作品嘅封面（`cover` 優先，否則第一張相）；顯示作品名同地區。
- 冇作品資料時用 `assets/hero.webp` 作 fallback slide。
- 自動播放 5 秒（`AUTOPLAY_MS`）；hover（滑鼠）、focus 時暫停；`count < 2` 不自動播放。
- 觸控橫向掃動 > 50px 且橫向位移大於縱向時切換；縱向仍然係捲動頁面。
- CTA：「瀏覽作品」→ `#showcase`。`HeroControls`（前後）同 `HeroTabs`（指示條）僅在 `count > 1` 時顯示。

### 3.3 About（`components/sections/About.tsx`）

靜態內容：「40 年裝修經驗」+ 公司介紹 + 四個賣點（免費上門量度報價、價錢透明無隱藏收費、專業師傅團隊、服務香港各區）。

### 3.4 Showcase（`components/sections/Showcase`）

- 資料來自 `useProjects()`（見 §5.1）；狀態 `loading`／`success`／`error` 分別顯示 spinner／作品／「暫時未能載入作品，請稍後再試。」。
- 分類 Filter：「全部」+ `CATEGORIES` 中**有作品**嘅分類（`useShowcaseStore.categoryId`）。

    | id        | 名稱         |
    | --------- | ------------ |
    | `home`    | 住宅裝修     |
    | `office`  | 商舖及辦公室 |
    | `factory` | 傢俬廠房     |
    | `village` | 村屋及洋房   |

- 作品卡（`ProjectCard`）點擊開 Lightbox。

### 3.5 Lightbox（`components/ui/Lightbox.tsx`、`useLightbox`、`useLightboxStore`）

- 全域 store；開啟時鎖 body scroll、設 `data-lightbox-open`；關閉後 focus 返去觸發元素。
- 鍵盤：← → 切換、Esc 關閉；離開頁面時自動關閉。
- 同時被主站 Showcase 同進度頁 `ProgressPhotos` 使用（後者將相片組成 `Project` 傳入）。

### 3.6 QuoteForm（`components/sections/QuoteForm`）

**純前端，不呼叫後端。** 驗證通過後組 WhatsApp URL 並 `window.open(..., "_blank", "noopener")`。

| 欄位            | 規則（`utils/validateQuote.ts`）                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------- |
| `name` 稱呼     | trim 後 1–30 字，必填                                                                                    |
| `unitType`      | 必須係 `UNIT_TYPES` 之一：私樓、居屋、公屋、村屋、洋房、辦公室 / 寫字樓、零售店舖、餐飲 / 商業單位、其他 |
| `area` 實用呎數 | 數字，1–99999，必填                                                                                      |
| `district`      | trim 後 1–50 字，必填                                                                                    |
| `requirement`   | 選填，最多 500 字                                                                                        |

- 驗證失敗：逐欄顯示錯誤（`aria-invalid`／`aria-describedby`），focus 去第一個有錯嘅欄位（順序 `FIELD_ORDER`）。
- WhatsApp 訊息（`utils/whatsapp.ts`）：`https://wa.me/85251717371?text=` + URL-encoded 多行文字（稱呼／單位類型／實用面積／物業地區／要求，要求空白時寫「無」）。

### 3.7 Contact / Footer / FloatingWhatsApp

- Contact：WhatsApp 按鈕、電話（`tel:`）、電郵（`mailto:`）、Instagram。
- FloatingWhatsApp：右下角固定圓形按鈕，直接開 `wa.me/85251717371`（不預填內容）。
- Footer：版權，年份由 `new Date().getFullYear()` 生成。

## 4. 客戶進度頁（`/progress`）

### 4.1 存取碼流程

存取碼由公司提供，格式例 `AS-XXXX-XXXX-XXXX-XXXX`，用嚟識別單一工程。

1. `useAccessCode` mount 時呼叫 `useAccessStore.init()`：讀取 URL query `?code=...`（`utils/accessCode.ts#readUrlCode`，trim；**唔改動網址**）。有 code → `phase = active`；冇 → `phase = needs_code`。
2. `needs_code`：顯示 `AccessGate`（單一輸入框 + 「查看進度」）。前端只檢查 trim 後非空，格式由後端判斷。
3. 提交 → `submit(value)` → `phase = active`，並重新載入工程。
4. 任何 `/client/*` 請求回 `401` → `access.reject()`：丟棄 code，`rejected = true`，返回 `AccessGate`。
5. Code **只保存喺記憶體（zustand）**，不寫入 localStorage／sessionStorage；重新整理後需由 URL 帶入或重新輸入。

`AccessGate` 行為：

- 錯誤文案刻意含糊（唔區分原因）：「存取碼無效或已失效，請向匠方工程查詢。」
- `429`：用 `Retry-After`（缺少時 60 秒）起倒數（`useCountdown`），期間輸入框同按鈕 disabled，文案「嘗試次數過多，請 N 秒後再試。」
- 底部提供 WhatsApp 連結（不預填內容）。

### 4.2 資料載入

進入頁面後只有 `GET /project` 成功（`project.project` 有值）先會載入其餘三項：

| Hook                | Store                    | Endpoint                      | 失敗處理                                                                                                         |
| ------------------- | ------------------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `useClientProject`  | `useClientProjectStore`  | `GET /project`                | `401` → reject；其他錯誤 → 顯示「暫時未能載入，請稍後重試。」+ 重試鈕；`429` 且未有資料 → 回 `AccessGate` 並倒數 |
| `useClientComments` | `useClientCommentsStore` | `GET /comments?page&per_page` | `401` → reject；其他 → `failed = true`                                                                           |
| `useClientQuotes`   | `useClientQuotesStore`   | `GET /quotes`                 | `401` → reject；其他錯誤當冇文件，唔阻擋頁面                                                                     |
| `useClientInvoices` | `useClientInvoicesStore` | `GET /invoices`               | 同 quotes                                                                                                        |

- 每個 store 維持一個模組級 `AbortController`：新請求會取消上一個未完成請求；unmount／code 變更時取消；冇 code 時 `clear()`。
- 分頁重新變成 visible（`visibilitychange`）時，`refreshAll()` 重新載入四項資料。
- 載入中顯示 `Skeleton`。

### 4.3 API Client（`src/api/clientApi.ts`）

- Base：`${API_ORIGIN}/api/v1/client${path}`；`clientGet` / `clientPost`（JSON body）。
- Header：`Accept: application/json`、`X-Access-Code: <code.trim()>`；有 body 時加 `Content-Type: application/json`。`cache: "no-store"`。
- Access code **只放喺 header**，error 物件不帶 code。需要後端 CORS 允許前台 origin 同 `X-Access-Code`。
- 成功回傳 `{data, meta?}`；失敗 throw `ApiError {status, code, message, details?, requestId?, retryAfter?}`（解析 `error` 包裝或根層、`Retry-After` 秒數）。
- `fetch` throw（非 abort）→ `{status: 0, code: "network_error"}`；abort 則原樣 re-throw。
- **不做自動 retry**（尤其 POST）。

### 4.4 頁面佈局

`ProgressLayout`：簡化 Header（logo + 「工程進度」，logo 連去 `/`）+ `max-w-5xl` 內容區；唔使用主站 Header／FloatingWhatsApp。

`active` 之後顯示：`ProjectSummary` + `ProgressTabs` + 對應 tabpanel。

| Tab id       | 標籤 | 顯示條件              | 內容                                |
| ------------ | ---- | --------------------- | ----------------------------------- |
| `milestones` | 進度 | 永遠                  | `MilestoneTimeline`                 |
| `photos`     | 相片 | `photos.length > 0`   | `ProgressPhotos`                    |
| `documents`  | 文件 | 報價單 + 發票總數 > 0 | `ProgressDocuments`                 |
| `comments`   | 留言 | 永遠                  | `CommentThread` + `CommentComposer` |

- 當前 tab 不存在（例如文件被清空）時自動回落到 `milestones`。
- `ProgressTabs`：`role="tablist"`，← → Home End 鍵切換並移動 focus；roving `tabIndex`。

### 4.5 ProjectSummary

- 顯示封面（`cover_photo` 有值先顯示，冇則唔用佔位圖）、狀態 badge（`lead` = 「籌備中」、`active` = 「施工中」）、地區、類別中文名（`CATEGORIES`）、標題 `<h1>`。
- 進度：`done` 數 / `milestones.length`；`percent = round(done / total * 100)`；`total = 0` 時整段隱藏。`role="progressbar"`。

### 4.6 MilestoneTimeline

- 按 `position` 升序（store `normalize` 時排序）；`<ol>` 語意，`in_progress` 項目 `aria-current="step"`。
- 狀態文字：`pending` 待開始、`in_progress` 進行中、`done` 已完成；唔單靠顏色（有 `Marker` icon）。
- 日期（`MilestoneItem.describeDate`）：`done` 且有 `completed_on` →「完成於 …」；否則有 `due_on` →「預計 …」；否則唔顯示。**唔顯示「已逾期」。**
- `client_summary` 純文字（`whitespace-pre-line`），不用 `dangerouslySetInnerHTML`。
- Date-only（`YYYY-MM-DD`）不經 `new Date()`，由 `formatDateOnly` 拆字串，輸出 `2026年11月1日`。

### 4.7 ProgressPhotos

- 縮圖 grid（2／3／4 欄）、`loading="lazy"`；alt 為「{title} 工程相片 {n}」；點擊開 Lightbox。
- 相片按 `position` 升序。

### 4.8 留言

- `fetchAllComments`：每頁 100（`PER_PAGE`），最多 10 頁（`MAX_PAGES`）；超出時 `truncated = true`，提示「只顯示最早 1000 則」。按 server 回傳順序顯示。
- `CommentThread`：`role="log"`；`author_role === "client"` 靠右（顯示「你」），否則靠左（顯示「匠方工程」）；冇留言時提示「有任何問題，歡迎在下方留言。」；送出後自動捲到底。
- `CommentComposer`：
    - 內容 trim 後 1–2000 字；Ctrl／Cmd + Enter 送出；送出中 disabled；提示「留言送出後無法修改或刪除」。
    - Draft 由 `ProgressPage` 持有，切換 tab 唔會遺失。
    - `POST /comments`，body `{comment: {body}}`。
    - 結果（`SendResult`）：
        - `sent`：清空 draft、重新載入留言、捲到底。
        - `maybe_sent`（網絡錯誤／5xx）：先 refetch，若最新一則 client 留言內容等於所送內容則視為已送出（清空 draft），**唔自動重試**；否則 `failed`。
        - `422`：顯示後端 `details.body` 錯誤，缺少時「留言內容無效，請檢查後再試。」
        - `429`：用 `Retry-After`（缺少 60 秒）倒數，顯示「留言太頻密，請 N 秒後再試。」
        - `401`：由 `access.reject()` 處理。
        - 其他：「暫時未能送出，請稍後重試。」

### 4.9 文件（報價單／發票 PDF）

- 報價單／發票由 API 回傳「客人可見」嘅文件；store `normalize` 時按 `position` 排序 section 同細項，並**剔除冇任何細項嘅文件**（`utils/documentSections`）。
- `ProgressDocuments` 分「報價單」「發票單」兩組；每行顯示編號（`reference_no`／`invoice_no`）、客戶名（發票另加到期日），及下載按鈕。下載中所有按鈕 disabled，失敗顯示「文件產生失敗，請重試。」
- 下載（`pdf/downloadQuotePdf.ts`）：
    - PDF 模組同 `@react-pdf/renderer`、字型只經 dynamic import 載入，不入主 bundle。
    - 以 `Blob` + `<a download>` 觸發；檔名 `quotation-<reference_no>.pdf`／`invoice-<invoice_no>.pdf`（非 `[A-Za-z0-9._-]` 字元換成 `-`）。
    - 簽發日期 = 今日香港日期（`todayInHongKong`，`Asia/Hong_Kong`）。

#### PDF 內容（`src/pdf`）

- A4 直向，兩頁：
    1. Header + 項目表（按 section 編號，空分類略過不佔編號）+ 總計 + 備註（有先顯示）。
    2. 報價單：條款及簽署（`QUOTE_TERMS`、`QUOTE_SIGN_OFF`）；發票：付款詳情（`INVOICE_PAYMENT`：收款人、銀行、帳號、逾期利息 2%）及到期日。
- `PdfModel`（`pdfModel.ts`）只複製需要欄位，`id` 等內部欄位不進入 model；金額直接格式化 API 字串，**不重新計算**。
- 總計：「淨額總計」→ 折扣非零先顯示「折扣 -x」→「折實總計」。
- `contact_person`／`customer_phone` 缺少時顯示 `-`。發票 `quote_reference_no` 缺少時唔印「報價參考編號」。
- 公司抬頭同條款硬編碼喺 `src/constants/company.ts`（改資料請改此處）。
- 中文字型：Noto Sans TC（Regular／Bold，`src/assets/fonts`，`registerFonts`）；`cjkLineBreak.ts#toPdfText` 處理 CJK 斷行。

#### 金額工具（`utils/money.ts`）

金額一律係兩位小數字串，**絕不轉 `Number`**，內部以 `BigInt` 分（cents）處理。

- `formatMoney("459000")` → `"459,000.00"`（格式唔正確則原樣回傳）。
- `formatQty("2.50")` → `"2.5"`（只去尾 0）。
- `isZeroMoney` 對非法字串 throw。

## 5. 資料與型別

### 5.1 公開作品 API（`src/api/projectsApi.ts`）

- `GET ${API_ORIGIN}/api/v1/projects`（無認證）→ `{data: ApiProject[]}`。
- 轉換：按 `position` 排序；`category` → `categoryId`；`district` 空字串 → `null`；`cover_photo` → `cover`（alt「{title} 裝修工程封面」）；相片按 `position` 排序（alt「{title} 裝修工程相片 {n}」）；**剔除冇相片嘅作品**。
- 瀏覽器端共用同一個 Promise cache，失敗時清 cache 方便重試。
- `projectsLoader`（SSG）：build 時預載；失敗只 `console.warn` 並回傳 `null`，由瀏覽器補載入。
- `useProjects`：首次 render 用預載資料頂住；`useProjectsStore.refresh` 載入後僅在內容真係變咗（`JSON.stringify` 比對）才更新；有預載資料時失敗唔顯示 error。

### 5.2 型別

- `src/types/index.ts`：`Project`、`ProjectCategory`、`ProjectImage`、`UNIT_TYPES`、`QuoteFormValues`／`Draft`／`Errors`。
- `src/types/progress.ts`：`ClientProject`（`category`: `home|office|village|factory`、`status`: `lead|active`）、`ClientMilestone`、`ClientPhoto`、`ClientComment`、`ClientQuote`、`ClientInvoice`、`ClientSection`、`ClientLineItem`、`ApiError`、`ApiResult`、`ApiMeta`。
- 前端永不預期或渲染 `access_code`、`client_name`、`internal_note` 等內部欄位。

### 5.3 日期工具（`utils/dates.ts`）

- `formatDateOnly`：`YYYY-MM-DD` → `2026年11月1日`；格式錯誤回傳 `""`。
- `formatDateTime`：ISO → `zh-HK` `medium` 日期 + `short` 時間；無效回傳 `""`。
- `todayInHongKong`：香港今日 `YYYY-MM-DD`。

## 6. 目錄結構

```
src/
├─ main.tsx / app.tsx          # 路由 / 主站組合
├─ api/                        # clientApi（需 code）、projectsApi（公開）
├─ constants/                  # api、company（PDF 抬頭／條款）、contact
├─ data/projects.ts            # 作品分類
├─ stores/                     # zustand：access、client*、projects、showcase、lightbox、menu
├─ hooks/                      # store 封裝 + 行為 hooks（carousel、countdown、lightbox…）
├─ pages/ProgressPage/         # 進度頁 + Skeleton
├─ components/{layout,sections,progress,ui}
├─ pdf/                        # 報價單／發票 PDF
├─ utils/                      # accessCode、dates、documentSections、money、validateQuote、whatsapp
└─ types/
```

## 7. 設計 Token（`src/index.css`）

`brand #2b2622`、`brand-light #4a413a`、`accent #b8864b`、`accent-dark #96693a`、`surface #f7f2ea`；字型 `PingFang HK`／`Noto Sans TC`／`Microsoft JhengHei`。`--fab-clearance: 5.5rem` 預留浮動 WhatsApp 按鈕空間。
