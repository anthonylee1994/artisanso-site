# artisanso-site — Functional Spec

Official website of 匠方工程 (Artisanso Engineering). Frontend-only SPA/SSG; the backend API lives in a separate repo (`https://api.artisanso.com`).

> This document is the entry point for business logic and implementation details. Update it whenever behavior changes, before committing.
> `phase-1-site-spec.md` and `phase-2-site-spec.md` are early design drafts. Where they conflict with this document, this document and the code win.

## 1. Overview

| Area                        | Description                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Public site `/`             | One-page marketing site: project showcase + WhatsApp quote form. The goal is to get visitors to message us on WhatsApp.         |
| Client progress `/progress` | Clients use an access code to view project progress, photos, and quotation/invoice PDFs, and to leave comments for the company. |
| Language                    | Traditional Chinese (Hong Kong), `<html lang="zh-HK">`                                                                          |
| Contact info                | Phone `51717371`, WhatsApp `85251717371`, `info@artisanso.com`, IG `@artisansohk` (`src/constants/contact.ts`)                  |

UI copy quoted in this document (in 「」) is the exact Chinese text shown to users; English glosses are added where needed.

### 1.1 Tech Stack

React 19, TypeScript, Vite 8, Tailwind CSS v4, `vite-react-ssg` (SSG), `react-router-dom` 6, `zustand` (state), `@react-pdf/renderer` (PDF), `react-icons`, Prettier. Deployed on Vercel (`vercel.json`).

### 1.2 Scripts

| Script        | Purpose                                  |
| ------------- | ---------------------------------------- |
| `pnpm dev`    | Dev server                               |
| `pnpm build`  | `vite-react-ssg build`, pre-renders HTML |
| `pnpm format` | Prettier                                 |

### 1.3 Environment Variables

| Variable            | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL` | API origin (without `/api/v1`; trailing `/` is stripped). See `src/constants/api.ts`. |

## 2. Routing and Rendering

Defined in `src/main.tsx`.

| Path        | Component      | Loader           | Notes                                                           |
| ----------- | -------------- | ---------------- | --------------------------------------------------------------- |
| `/`         | `App`          | `projectsLoader` | Projects are prefetched at build time and written into the HTML |
| `/progress` | `ProgressPage` | none             | Data is fetched client-side; `noindex`                          |
| `*`         | —              | —                | `<Navigate to="/" replace />`                                   |

Leak-prevention measures for `/progress`:

- `vercel.json` adds `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, `X-Robots-Tag: noindex, nofollow, noarchive`, and a CSP (`img-src` allows only `self`, `data:`, `https://img.eservice-hk.net`; `connect-src` allows only `self`, `data:`, `https://api.artisanso.com`; `script-src` includes `'wasm-unsafe-eval'` for PDF rendering; `frame-ancestors 'none'`).
- `ProgressLayout` adds `<meta name="robots">` and `<meta name="referrer" content="no-referrer">`.
- `public/robots.txt` has `Disallow: /progress`.

## 3. Public Site (`/`)

Structure (`src/app.tsx`): `Header` → `Hero` → `About` → `Showcase` → `QuoteForm` → `Contact` → `Footer` + `FloatingWhatsApp`.

### 3.1 Header (`components/layout/Header.tsx`)

- Sticky. Nav items: 首頁 `#home`, 關於我們 `#about`, 作品展示 `#showcase`, 即時報價 `#quote`, 聯絡我們 `#contact`.
- Horizontal nav on desktop; hamburger on mobile (`useMenuStore` manages open/close; the menu closes after a link is clicked).
- `useActiveSection` uses `IntersectionObserver` (`rootMargin: -40% 0 -55% 0`) to mark the current section (highlighted in the mobile menu).
- A scroll progress bar sits at the top.

### 3.2 Hero (`components/sections/Hero`)

- Full-width carousel; each slide is a project cover (`cover` first, otherwise the first image), showing the project name and district.
- Falls back to `assets/hero.webp` as a single slide when there is no project data.
- Autoplay every 5 seconds (`AUTOPLAY_MS`); pauses on mouse hover and on focus; no autoplay when `count < 2`.
- A horizontal touch swipe over 50px (and larger than the vertical movement) changes slides; vertical swipes still scroll the page.
- CTA: 「瀏覽作品」(Browse projects) → `#showcase`. `HeroControls` (prev/next) and `HeroTabs` (indicator bar) show only when `count > 1`.

### 3.3 About (`components/sections/About.tsx`)

Static content: "40 years of renovation experience", a company introduction, and four selling points (free on-site measuring and quotation, transparent pricing with no hidden fees, professional in-house craftsmen, service across Hong Kong).

### 3.4 Showcase (`components/sections/Showcase`)

- Data comes from `useProjects()` (see §5.1). `loading` / `success` / `error` show a spinner / the projects / 「暫時未能載入作品，請稍後再試。」 ("Unable to load projects, please try again later.").
- Category filter: 「全部」(All) plus the `CATEGORIES` that **have projects** (`useShowcaseStore.categoryId`).

    | id        | Name         |
    | --------- | ------------ |
    | `home`    | 住宅裝修     |
    | `office`  | 商舖及辦公室 |
    | `factory` | 傢俬廠房     |
    | `village` | 村屋及洋房   |

- Clicking a project card (`ProjectCard`) opens the Lightbox.

### 3.5 Lightbox (`components/ui/Lightbox.tsx`, `useLightbox`, `useLightboxStore`)

- Global store. While open it locks body scroll and sets `data-lightbox-open`; on close, focus returns to the trigger element.
- Keyboard: ← → to navigate, Esc to close. It closes automatically when the page is left.
- Shared by the public Showcase and the progress page's `ProgressPhotos` (which wraps photos into a `Project`).

### 3.6 QuoteForm (`components/sections/QuoteForm`)

**Frontend only; no backend call.** After validation passes it builds a WhatsApp URL and calls `window.open(..., "_blank", "noopener")`.

| Field                        | Rule (`utils/validateQuote.ts`)                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `name`                       | Required, 1–30 characters after trim                                                                        |
| `unitType`                   | Must be one of `UNIT_TYPES`: 私樓, 居屋, 公屋, 村屋, 洋房, 辦公室 / 寫字樓, 零售店舖, 餐飲 / 商業單位, 其他 |
| `area` (saleable area, sqft) | Required number, 1–99999                                                                                    |
| `district`                   | Required, 1–50 characters after trim                                                                        |
| `requirement`                | Optional, up to 500 characters                                                                              |

- On validation failure: per-field errors (`aria-invalid` / `aria-describedby`) and focus moves to the first invalid field (order given by `FIELD_ORDER`).
- WhatsApp message (`utils/whatsapp.ts`): `https://wa.me/85251717371?text=` + URL-encoded multi-line text (name / unit type / saleable area / district / requirement; requirement is 「無」 when empty).

### 3.7 Contact / Footer / FloatingWhatsApp

- Contact: WhatsApp button, phone (`tel:`), email (`mailto:`), Instagram.
- FloatingWhatsApp: fixed round button at the bottom right that opens `wa.me/85251717371` directly (no prefilled text).
- Footer: copyright; the year comes from `new Date().getFullYear()`.

## 4. Client Progress Page (`/progress`)

### 4.1 Access Code Flow

The access code is issued by the company, looks like `AS-XXXX-XXXX-XXXX-XXXX`, and identifies a single project.

1. On mount, `useAccessCode` calls `useAccessStore.init()`, which reads the URL query `?code=...` (`utils/accessCode.ts#readUrlCode`, trimmed; **the URL is not modified**). A code → `phase = active`; none → `phase = needs_code`.
2. `needs_code`: shows `AccessGate` (a single input + 「查看進度」). The frontend only checks that the trimmed value is non-empty; format validation is left to the backend.
3. Submit → `submit(value)` → `phase = active`, and the project is reloaded.
4. Any `/client/*` request returning `401` → `access.reject()`: discards the code, sets `rejected = true`, and returns to `AccessGate`.
5. The code is **kept in memory only (zustand)**. It is never written to localStorage/sessionStorage, so after a refresh it must come from the URL or be re-entered.

`AccessGate` behavior:

- The error message is deliberately vague and does not reveal the reason: 「存取碼無效或已失效，請向匠方工程查詢。」 ("Access code is invalid or expired, please contact Artisanso.")
- `429`: starts a countdown from `Retry-After` (60 seconds if missing) via `useCountdown`; the input and button are disabled meanwhile; message 「嘗試次數過多，請 N 秒後再試。」 ("Too many attempts, try again in N seconds.")
- A WhatsApp link at the bottom (no prefilled text).

### 4.2 Data Loading

The project (`GET /project`) loads first. The other three resources load only after it succeeds (`project.project` is set):

| Hook                | Store                    | Endpoint                      | Failure handling                                                                                                                           |
| ------------------- | ------------------------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `useClientProject`  | `useClientProjectStore`  | `GET /project`                | `401` → reject; other errors → 「暫時未能載入，請稍後重試。」 + retry button; `429` with no data yet → back to `AccessGate` with countdown |
| `useClientComments` | `useClientCommentsStore` | `GET /comments?page&per_page` | `401` → reject; other errors → `failed = true`                                                                                             |
| `useClientQuotes`   | `useClientQuotesStore`   | `GET /quotes`                 | `401` → reject; other errors are treated as "no documents" and do not block the page                                                       |
| `useClientInvoices` | `useClientInvoicesStore` | `GET /invoices`               | Same as quotes                                                                                                                             |

- Each store keeps a module-level `AbortController`: a new request aborts the previous in-flight one; requests are aborted on unmount or code change; `clear()` runs when there is no code.
- When the tab becomes visible again (`visibilitychange`), `refreshAll()` reloads all four resources.
- A `Skeleton` is shown while loading.

### 4.3 API Client (`src/api/clientApi.ts`)

- Base: `${API_ORIGIN}/api/v1/client${path}`; `clientGet` / `clientPost` (JSON body).
- Headers: `Accept: application/json`, `X-Access-Code: <code.trim()>`; `Content-Type: application/json` when there is a body. `cache: "no-store"`.
- The access code goes **only in the header**, and error objects never contain it. The backend CORS config must allow the frontend origin and `X-Access-Code`.
- Success returns `{data, meta?}`; failure throws `ApiError {status, code, message, details?, requestId?, retryAfter?}` (parses either an `error` wrapper or the root object, and `Retry-After` seconds).
- A `fetch` throw (other than abort) → `{status: 0, code: "network_error"}`; an abort is re-thrown as is.
- **No automatic retry** (especially for POST).

### 4.4 Page Layout

`ProgressLayout`: a simplified header (logo + 「工程進度」, logo links to `/`) and a `max-w-5xl` content area. It does not use the main site's Header or FloatingWhatsApp.

Once active, the page shows `ProjectSummary` + `ProgressTabs` + the matching tabpanel.

| Tab id       | Label | Shown when                  | Content                             |
| ------------ | ----- | --------------------------- | ----------------------------------- |
| `milestones` | 進度  | Always                      | `MilestoneTimeline`                 |
| `photos`     | 相片  | `photos.length > 0`         | `ProgressPhotos`                    |
| `documents`  | 文件  | quotes + invoices count > 0 | `ProgressDocuments`                 |
| `comments`   | 留言  | Always                      | `CommentThread` + `CommentComposer` |

- If the current tab no longer exists (e.g. documents were cleared), it falls back to `milestones`.
- `ProgressTabs`: `role="tablist"`; ← → Home End switch tabs and move focus; roving `tabIndex`.

### 4.5 ProjectSummary

- Shows the cover (only when `cover_photo` is set; no placeholder otherwise), a status badge (`lead` = 「籌備中」 "Preparing", `active` = 「施工中」 "In progress"), district, the Chinese category name (`CATEGORIES`), and the title as `<h1>`.
- Progress: number of `done` milestones / `milestones.length`; `percent = round(done / total * 100)`; the whole block is hidden when `total = 0`. Uses `role="progressbar"`.

### 4.6 MilestoneTimeline

- Sorted by `position` ascending (done in the store's `normalize`); semantic `<ol>`; the `in_progress` item has `aria-current="step"`.
- Status text: `pending` 待開始, `in_progress` 進行中, `done` 已完成. Status is not conveyed by color alone (there is a `Marker` icon).
- Date (`MilestoneItem.describeDate`): `done` with `completed_on` → 「完成於 …」 ("Completed on"); otherwise with `due_on` → 「預計 …」 ("Expected"); otherwise no date. **"Overdue" is never shown.**
- `client_summary` is plain text (`whitespace-pre-line`); `dangerouslySetInnerHTML` is never used.
- Date-only strings (`YYYY-MM-DD`) never go through `new Date()`; `formatDateOnly` splits the string and outputs `2026年11月1日`.

### 4.7 ProgressPhotos

- Thumbnail grid (2/3/4 columns), `loading="lazy"`; alt text is 「{title} 工程相片 {n}」; clicking opens the Lightbox.
- Photos are sorted by `position` ascending.

### 4.8 Comments

- `fetchAllComments`: 100 per page (`PER_PAGE`), at most 10 pages (`MAX_PAGES`). Beyond that, `truncated = true` and the UI shows 「只顯示最早 1000 則」 ("Showing only the earliest 1000"). Comments display in server order.
- `CommentThread`: `role="log"`; `author_role === "client"` aligns right (labeled 「你」 "You"), otherwise left (labeled 「匠方工程」); with no comments it shows 「有任何問題，歡迎在下方留言。」; it scrolls to the bottom after sending.
- `CommentComposer`:
    - Content must be 1–2000 characters after trim; Ctrl/Cmd + Enter sends; disabled while sending; hint 「留言送出後無法修改或刪除」 ("Comments cannot be edited or deleted once sent").
    - The draft is owned by `ProgressPage`, so switching tabs does not lose it.
    - `POST /comments` with body `{comment: {body}}`.
    - Outcomes (`SendResult`):
        - `sent`: clears the draft, reloads comments, scrolls to the bottom.
        - `maybe_sent` (network error / 5xx): refetches first; if the latest client comment's body equals the one sent, it is treated as sent (draft cleared). **No automatic retry.** Otherwise `failed`.
        - `422`: shows the backend `details.body` error, or 「留言內容無效，請檢查後再試。」 if missing.
        - `429`: counts down from `Retry-After` (60 seconds if missing) and shows 「留言太頻密，請 N 秒後再試。」
        - `401`: handled by `access.reject()`.
        - Anything else: 「暫時未能送出，請稍後重試。」

### 4.9 Documents (Quotation / Invoice PDFs)

- Quotes and invoices are the documents the API marks as client-visible. The store's `normalize` sorts sections and line items by `position` and **drops documents with no line items** (`utils/documentSections`).
- `ProgressDocuments` has two groups, 「報價單」 (quotations) and 「發票單」 (invoices). Each row shows the number (`reference_no` / `invoice_no`), the customer name (invoices also show the due date), and a download button. All buttons are disabled while one download runs; failure shows 「文件產生失敗，請重試。」
- Download (`pdf/downloadQuotePdf.ts`):
    - The PDF module, `@react-pdf/renderer`, and fonts are loaded only via dynamic import and are not in the main bundle.
    - Triggered with a `Blob` + `<a download>`; filenames are `quotation-<reference_no>.pdf` / `invoice-<invoice_no>.pdf` (characters outside `[A-Za-z0-9._-]` become `-`).
    - Issue date = today's Hong Kong date (`todayInHongKong`, `Asia/Hong_Kong`).

#### PDF Content (`src/pdf`)

- A4 portrait, two pages:
    1. Header + items table (sections numbered; empty sections are skipped and do not consume a number) + totals + notes (only when present).
    2. Quotation: terms and signature (`QUOTE_TERMS`, `QUOTE_SIGN_OFF`). Invoice: payment details (`INVOICE_PAYMENT`: payee, bank, account, 2% late interest) and due date.
- `PdfModel` (`pdfModel.ts`) copies only the needed fields, so internal fields such as `id` never enter the model. Amounts are formatted directly from the API strings and **never recalculated**.
- Totals: 「淨額總計」 (subtotal) → 「折扣 -x」 (discount, only when non-zero) → 「折實總計」 (total).
- Missing `contact_person` / `customer_phone` render as `-`. A missing invoice `quote_reference_no` omits the 「報價參考編號」 line.
- When the API returns `terms` (quotation) or `payment_details` (invoice) as rich-text HTML (only paragraphs, bold, and bullet/numbered lists), page 2 prints them instead of the default terms or payment details; `utils/richText.ts` parses the HTML into rows and `RichTextPdf` draws them. `null` or empty means the default text.
- Company letterhead and default terms are hard-coded in `src/constants/company.ts`; edit that file to change them.
- CJK font: Noto Sans TC (Regular/Bold, `src/assets/fonts`, `registerFonts`); `cjkLineBreak.ts#toPdfText` handles CJK line breaking.

#### Money Utilities (`utils/money.ts`)

Amounts are always two-decimal strings and are **never converted to `Number`**; internally they are handled as `BigInt` cents.

- `formatMoney("459000")` → `"459,000.00"` (returned unchanged if the format is invalid).
- `formatQty("2.50")` → `"2.5"` (only trailing zeros are stripped).
- `isZeroMoney` throws on invalid strings.

## 5. Data and Types

### 5.1 Public Projects API (`src/api/projectsApi.ts`)

- `GET ${API_ORIGIN}/api/v1/projects` (no auth) → `{data: ApiProject[]}`.
- Transformation: sorted by `position`; `category` → `categoryId`; empty-string `district` → `null`; `cover_photo` → `cover` (alt 「{title} 裝修工程封面」); photos sorted by `position` (alt 「{title} 裝修工程相片 {n}」); **projects with no photos are dropped**.
- The browser shares a single Promise cache; on failure the cache is cleared so it can be retried.
- `projectsLoader` (SSG): prefetches at build time; on failure it only calls `console.warn` and returns `null`, and the browser loads the data later.
- `useProjects`: the first render uses the prefetched data; `useProjectsStore.refresh` updates the store only if the content actually changed (compared with `JSON.stringify`); with prefetched data, a failure does not show an error.

### 5.2 Types

- `src/types/index.ts`: `Project`, `ProjectCategory`, `ProjectImage`, `UNIT_TYPES`, `QuoteFormValues` / `Draft` / `Errors`.
- `src/types/progress.ts`: `ClientProject` (`category`: `home|office|village|factory`, `status`: `lead|active`), `ClientMilestone`, `ClientPhoto`, `ClientComment`, `ClientQuote`, `ClientInvoice`, `ClientSection`, `ClientLineItem`, `ApiError`, `ApiResult`, `ApiMeta`.
- The frontend never expects or renders internal fields such as `access_code`, `client_name`, or `internal_note`.

### 5.3 Date Utilities (`utils/dates.ts`)

- `formatDateOnly`: `YYYY-MM-DD` → `2026年11月1日`; returns `""` on a malformed value.
- `formatDateTime`: ISO → `zh-HK` `medium` date + `short` time; returns `""` if invalid.
- `todayInHongKong`: today's Hong Kong date as `YYYY-MM-DD`.

## 6. Directory Structure

```
src/
├─ main.tsx / app.tsx          # Routes / public site composition
├─ api/                        # clientApi (needs code), projectsApi (public)
├─ constants/                  # api, company (PDF letterhead/terms), contact
├─ data/projects.ts            # Project categories
├─ stores/                     # zustand: access, client*, projects, showcase, lightbox, menu
├─ hooks/                      # Store wrappers + behavior hooks (carousel, countdown, lightbox…)
├─ pages/ProgressPage/         # Progress page + Skeleton
├─ components/{layout,sections,progress,ui}
├─ pdf/                        # Quotation / invoice PDFs
├─ utils/                      # accessCode, dates, documentSections, money, validateQuote, whatsapp
└─ types/
```

## 7. Design Tokens (`src/index.css`)

`brand #2b2622`, `brand-light #4a413a`, `accent #b8864b`, `accent-dark #96693a`, `surface #f7f2ea`; fonts `PingFang HK` / `Noto Sans TC` / `Microsoft JhengHei`. `--fab-clearance: 5.5rem` reserves space for the floating WhatsApp button.
