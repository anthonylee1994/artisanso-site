# 匠方工程 — 裝修工程一頁式網頁 Spec

## 1. 目標

為「匠方工程」整一個一頁式（Single Page）宣傳網站，核心目的：**令客人睇完作品之後，即刻 WhatsApp 嚟問價**。
- 語言：繁體中文（香港），`<html lang="zh-HK">`
- 目標用戶：大埔 / 荃灣 / 元朗一帶嘅住宅同商業單位業主
- 主要轉換（Conversion）：WhatsApp 即時報價 → `51717371`

## 2. Tech Stack

| 項目     | 選擇                                             |
| -------- | ------------------------------------------------ |
| Build    | Vite                                             |
| UI       | React 18+                                        |
| Language | TypeScript（strict）                             |
| Style    | Tailwind CSS（v4，`@tailwindcss/vite`）          |
| 格式化   | Prettier（每次改完 code 必須跑）                 |
| 後端     | 無（純靜態，部署去 Vercel / Netlify / CF Pages） |

> 唔使 Router、唔使 State Library、唔使 Backend。Form 淨係組 URL 打開 WhatsApp。

## 3. 專案結構

```
artisanso-site/
├─ index.html
├─ public/
│  ├─ favicon.svg
│  └─ og-image.jpg
├─ src/
│  ├─ main.tsx
│  ├─ app.tsx                      # 小寫 app.tsx，export const App
│  ├─ index.css                    # @import "tailwindcss" + theme tokens
│  ├─ constants/
│  │  └─ contact.ts                # PHONE, WA_NUMBER, EMAIL
│  ├─ data/
│  │  └─ projects.ts               # Showcase 資料
│  ├─ types/
│  │  └─ index.ts
│  ├─ utils/
│  │  └─ whatsapp.ts               # buildWhatsAppUrl()
│  ├─ hooks/
│  │  ├─ use-lightbox.ts           # export function useLightbox
│  │  └─ use-active-section.ts     # export function useActiveSection
│  ├─ assets/projects/<project-id>/01.jpg ...
│  └─ components/
│     ├─ layout/
│     │  ├─ header.tsx
│     │  └─ footer.tsx
│     ├─ sections/
│     │  ├─ hero.tsx
│     │  ├─ about.tsx
│     │  ├─ showcase.tsx
│     │  ├─ quote-form.tsx
│     │  └─ contact.tsx
│     └─ ui/
│        ├─ section-title.tsx
│        ├─ lightbox.tsx
│        └─ floating-whatsapp.tsx
```

## 4. 頁面結構（由上到下）

| #   | Section  | Anchor ID   | 說明                                 |
| --- | -------- | ----------- | ------------------------------------ |
| 0   | Header   | —           | Sticky 導航 + 「即時報價」CTA        |
| 1   | Hero     | `#top`      | 標語 + 兩粒 CTA（睇作品 / 即時報價） |
| 2   | 公司介紹 | `#about`    | 簡單介紹 + 3–4 個賣點                |
| 3   | 作品展示 | `#showcase` | 按分類 Filter 嘅項目 Gallery         |
| 4   | 即時報價 | `#quote`    | WhatsApp Form                        |
| 5   | 聯絡我們 | `#contact`  | 電話、電郵                           |
| 6   | Footer   | —           | Copyright                            |
- Header 導航用 smooth scroll（`scroll-behavior: smooth` + `scroll-mt-*` 避免俾 sticky header 遮住）
- Mobile 用 hamburger menu；Header 右邊永遠保留「即時報價」按鈕
- 右下角浮動 WhatsApp 圓形按鈕（直接 `wa.me/85251717371`，無預填內容）

### 4.1 Hero

- H1：`匠方工程` + 副標（例：「用心施工，每個細節都係匠心」— 文案可再改）
- CTA 1：`睇我哋作品` → `#showcase`
- CTA 2：`即時報價` → `#quote`
- 背景：全幅作品相 + 深色 overlay

### 4.2 公司介紹

- 一段簡短介紹（約 80–120 字），內容待客戶提供，暫用 placeholder
- 賣點 Grid（icon + 標題 + 一句說明），暫定：
  1. 免費上門度尺報價 2. 價錢透明，無隱藏收費 3. 專業師傅團隊 4. 服務大埔 / 荃灣 / 元朗

### 4.3 作品展示（Show Case Gallery）

**資料模型**

```ts
// src/types/index.ts
export type ProjectCategory = {
    id: string;
    name: string; // 例：住宅翻新、商業空間
};

export type ProjectImage = {
    src: string;
    alt: string;
};

export type Project = {
    id: string;
    categoryId: string; // → ProjectCategory.id
    name: string; // 項目名稱
    images: ProjectImage[]; // one-to-many，最少 1 幅
};
```

**關係**：`Category 1 — N Project 1 — N Image`

**UI 行為**
- 頂部 Category Tabs：`全部` + 各分類；Active 狀態明顯
- 每個 Project 一張 Card：封面 = `images[0]`，下面顯示項目名稱 + 分類 tag + 相數（例：`6 張`）
- Card Grid：Mobile 1 欄 / Tablet 2 欄 / Desktop 3 欄
- 點擊 Card → 開 Lightbox：
  - 顯示該項目全部圖片
    - 左右箭嘴 + 鍵盤 `←` `→` + `Esc` 關閉
    - Mobile 支援 swipe
    - 顯示項目名稱 + `3 / 8` 頁碼
    - 開啟時鎖住 body scroll，關閉後 focus 返回觸發嘅 Card
- 圖片 `loading="lazy"`、加 `width` / `height` 或 `aspect-*` 避免 layout shift

**分類（暫定，可改）**：住宅翻新 / 商舖及辦公室 / 餐飲空間 / 村屋及洋房

> 現階段用 placeholder 圖同假資料，資料只改 `src/data/projects.ts`，唔使碰 component。

### 4.4 即時報價 WhatsApp Form

| 欄位     | 型別            | Control      | 必填 | 驗證                                 |
| -------- | --------------- | ------------ | ---- | ------------------------------------ |
| 稱呼     | `string`        | text input   | ✅   | trim 後 1–30 字                      |
| 單位類型 | `UnitType` enum | select       | ✅   | 必須係 enum 其中一個                 |
| 實用呎數 | `number`        | number input | ✅   | 正數，1–99999，`inputMode="numeric"` |
| 物業地區 | `string`        | text input   | ✅   | trim 後 1–50 字                      |
| 要求     | `string`        | textarea     | ❌   | 最多 500 字                          |

**Enum**

```ts
export const UNIT_TYPES = ["私樓", "居屋", "公屋", "村屋", "洋房", "辦公室 / 寫字樓", "零售店舖", "餐飲 / 商業單位", "其他"] as const;
export type UnitType = (typeof UNIT_TYPES)[number];
```

**提交流程**
1. 用戶撳「WhatsApp 即時報價」
2. Client-side 驗證；失敗就喺欄位下面顯示錯誤，focus 去第一個錯誤欄位
3. 通過就組訊息，用 `window.open(url, '_blank', 'noopener')` 開 WhatsApp
4. 唔做任何 API call，唔儲存資料

**WhatsApp 連結**

```ts
// src/utils/whatsapp.ts
function buildWhatsAppUrl(values: QuoteFormValues): string {
    const lines = [
        "你好，我想查詢裝修報價：",
        `稱呼：${values.name}`,
        `單位類型：${values.unitType}`,
        `實用面積：${values.area} 呎`,
        `物業地區：${values.district}`,
        `要求：${values.requirement || "無"}`,
    ];
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}
```

- `WA_NUMBER = '85251717371'`（香港區號 852 + 51717371；`wa.me` 唔接受 `+` 同空格）
- 訊息必須用 `encodeURIComponent`，換行用 `\n`

### 4.5 聯絡我們

- 電話：`51717371` → `<a href="tel:+85251717371">`
- 電郵：`info@artisanso.com` → `<a href="mailto:info@artisanso.com">`
- 附一粒 WhatsApp 按鈕（`wa.me/85251717371`）
- 兩個資料都放入 `src/constants/contact.ts`，Footer / Floating Button / Form 共用

## 5. 視覺設計

- 風格：專業、穩陣、有質感（唔好太花）
- 色板（暫定，寫入 Tailwind `@theme`）：
  - `--color-brand`：深木色 / 炭灰（主色）
    - `--color-accent`：暖銅金（CTA、Active 狀態）
    - `--color-surface`：米白底
    - WhatsApp 按鈕固定用 WhatsApp 綠 `#25D366`
- 字體：系統中文字體 stack（`"PingFang HK", "Noto Sans TC", "Microsoft JhengHei", sans-serif`），唔載入 web font 以保速度
- Mobile First；斷點用 Tailwind 預設（`md` / `lg`）
- 按鈕最小點擊面積 44×44px

## 6. 非功能需求

- **效能**：Lighthouse Mobile Performance ≥ 90；圖片用 WebP / AVIF，Hero 圖 ≤ 200KB，其餘 Gallery 縮圖 ≤ 120KB
- **無障礙**：語意化 tag（`header` / `main` / `section` / `footer`）；Form 全部有 `<label>`；Lightbox 有 `role="dialog"` + `aria-modal` + focus trap；圖片有 `alt`
- **SEO**：`<title>`、`meta description`、Open Graph、`LocalBusiness` JSON-LD（名稱、電話、電郵、服務地區）
- **瀏覽器**：最新兩個版本嘅 Chrome / Safari / Edge；iOS Safari、Android Chrome

## 7. Coding 規範（跟 Anthony 個人規範）

- 每個 React 檔第一行 `import React from 'react'`；`.less` import 放最後（今次用 Tailwind，應該冇）
- 用 `React.useState` / `React.useRef` 等，**唔好**解構呼叫
- Component：`export const Xxx = ...`，**唔好**用 `export default function` / `export function`
- Custom Hook：`export function useXxx`，**唔好**用 `export const useXxx`
- Fragment 一律寫 `<React.Fragment>`，**唔好**用 `<>`
- Component 內部 function 直接用 Arrow Function，唔好包 `React.useCallback`
- Component 以外嘅 function 用 `function xxx()`；匿名函數用 Arrow Function
- Memo：項目冇 `ReactUtil.memo`，用 `React.memo`（只喺 Gallery Card 呢類會重複渲染嘅地方用）
- 新 Vite 專案：`App.tsx` 改名 `app.tsx`，`export default function App` 改 `export const App`
- 每次改完 code 跑 Prettier；**唔跑** ESLint 同 Type Check

## 8. 實作步驟

1. `pnpm create vite@latest . -- --template react-ts`，清走 boilerplate，`App.tsx` → `app.tsx`
2. 安裝 Tailwind（`tailwindcss` + `@tailwindcss/vite`），設定 `index.css` 同 theme tokens
3. 建 `constants/contact.ts`、`types/index.ts`、`data/projects.ts`（先放 placeholder 資料）
4. 寫 Layout：Header（含 mobile menu）、Footer、Floating WhatsApp
5. 寫 Hero + 公司介紹
6. 寫 Showcase：Category Tabs → Project Card Grid → Lightbox（含 `use-lightbox` hook）
7. 寫 Quote Form：欄位 + 驗證 + `buildWhatsAppUrl` + 開 WhatsApp
8. 寫 Contact section
9. SEO meta、JSON-LD、favicon、OG image
10. Prettier 格式化；手動測試；`pnpm run build` + `pnpm run preview` 睇 production build
11. 部署

## 9. 驗收標準（Acceptance Criteria）

- [ ] 一頁包含：公司介紹、作品展示、報價 Form、聯絡我們，導航可跳到各 section
- [ ] Gallery 可按分類篩選；每個項目有項目名稱同 1 幅以上圖片；Lightbox 可翻頁、鍵盤操作、Esc 關閉
- [ ] Form 5 個欄位型別 / Enum 同上表一致；必填欄位漏填會有錯誤提示
- [ ] 撳 WhatsApp 按鈕開 `https://wa.me/85251717371?text=...`，訊息內容齊全，中文同換行冇亂碼
- [ ] 電話 / 電郵連結可直接撥號 / 開郵件
- [ ] 375px、768px、1280px 三個闊度版面正常，冇橫向 scroll
- [ ] Lighthouse Mobile：Performance ≥ 90、Accessibility ≥ 95、SEO ≥ 95

## 10. 待確認（Open Questions）

1. 公司介紹正式文案、成立年份、經驗年資、公司 Logo
2. 真實項目相、項目名稱、分類清單
3. 品牌色 / 有冇現成 VI
4. 電話係咪要同時支援 WhatsApp（假設 51717371 就係 WhatsApp 號碼）
5. 域名同部署平台
6. 係咪需要 Google Analytics / Meta Pixel 追蹤 WhatsApp 點擊
