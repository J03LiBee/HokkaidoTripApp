# UI 改進 - V2.1

## ✅ 已完成的改進

### 1. 🗑️ 移除重複標題

**問題：** Header 已經顯示頁面標題，頁面內部又重複顯示，造成冗餘。

**修改：**
- ✅ 移除「行程」頁面的標題
- ✅ 移除「記帳本」頁面的標題
- ✅ 移除「物資清單」頁面的標題

**效果：** 頁面更簡潔，空間利用更好

---

### 2. 📅 行程頁面 - 按日期顯示

**舊設計：** 所有日期的行程混在一起，需要滾動很長

**新設計：**
- ✅ 頂部顯示日期選擇按鈕（橫向滾動）
- ✅ 點擊某一天，只顯示該天的行程
- ✅ 預設顯示第一天（12月31日）
- ✅ 選中的日期按鈕會放大並變深色

**日期按鈕外觀：**
```
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│12月31日│  │1月1日│  │1月2日│  │1月3日│
│  31  │  │  1  │  │  2  │  │  3  │
│ (二) │  │ (三) │  │ (四) │  │ (五) │
└─────┘  └─────┘  └─────┘  └─────┘
  深色      淺色      淺色      淺色
 (選中)
```

**好處：**
- 每天的行程一目了然
- 不需要長時間滾動
- 更符合用戶查看習慣

---

### 3. 📏 Timeline Dot 對齊修正

**問題：** Timeline 的圓點與垂直線沒有對齊，視覺上不美觀。

**修改：**
- ✅ 調整垂直線位置：從 `left: 19px` → `left: 11px`
- ✅ 調整圓點位置：從 `mt-4` → `mt-1`
- ✅ 圓點現在完美對齊垂直線

**視覺效果：**
```
    |           ← 垂直線
    ●  10:00   ← 圓點對齊
    |  行程A
    |
    ●  12:00
    |  行程B
    |
```

---

### 4. 🗺️ Google Maps 改用 Embed HTML

**舊方式：** 貼上 Google Maps 連結 → 系統解析 → 轉換為 embed URL

**問題：**
- 解析不一定準確
- 地點名稱可能有中文編碼問題
- 無法使用完整的 Google Maps Embed 功能

**新方式：** 直接貼上 Google Maps 的 iframe embed HTML

**如何取得 Embed HTML：**
1. 打開 Google Maps
2. 搜尋地點（例如：手稻滑雪場）
3. 點擊「**分享**」按鈕
4. 選擇「**嵌入地圖**」標籤
5. 複製整段 HTML 代碼
6. 貼到「Google Maps Embed HTML」欄位

**範例：**
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d23304.51218917482!2d141.21990586486805!3d43.10316939266097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5f0b27b627520291%3A0x6d478f6ca9f4845a!2z5omL56iy56iy56mN5YWs5ZyS!5e0!3m2!1szh-TW!2sjp!4v1766138031915!5m2!1szh-TW!2sjp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
```

**系統處理：**
- 自動從 HTML 中提取 `src` 屬性
- 在預覽 Modal 中顯示地圖
- 支援向後兼容（如果貼的是純 URL 也能用）

**好處：**
- 100% 準確，不需要解析
- 支援完整的 Google Maps 功能
- 地點名稱顯示正確（包含中文）
- 可以調整地圖大小、縮放等參數

---

## 📱 使用指南

### 如何查看特定日期的行程

1. 打開「行程」頁面
2. 頂部會顯示所有日期按鈕
3. 點擊想查看的日期（例如：1月1日）
4. 頁面只顯示該天的行程
5. 左右滑動日期按鈕，切換其他日期

### 如何添加 Google Maps

1. 編輯或新增行程
2. 在另一個分頁打開 Google Maps
3. 搜尋地點（例如：札幌電視塔）
4. 點擊「分享」→「嵌入地圖」
5. 複製整段 `<iframe ...></iframe>` 代碼
6. 回到行程編輯頁面
7. 貼上到「Google Maps Embed HTML」欄位
8. 儲存

**提示：** 不需要修改 HTML 代碼，直接整段複製貼上即可

---

## 🎨 視覺改進對比

### 行程頁面

**Before:**
```
┌──────────────────────────┐
│  行程規劃  (重複標題)     │ ← 刪除
├──────────────────────────┤
│  12月31日                │
│  14:00  ● 行程A          │
│  16:00  ● 行程B          │
│                          │
│  1月1日                  │
│  11:00  ● 行程C          │
│  13:00  ● 行程D          │
│  ...（需要滾動很長）      │
└──────────────────────────┘
```

**After:**
```
┌──────────────────────────┐
│ [12/31] [1/1] [1/2] ... │ ← 日期選擇器
├──────────────────────────┤
│  |                       │
│  ● 14:00  行程A          │
│  |                       │
│  ● 16:00  行程B          │
│  |                       │
│  ● 17:00  行程C          │ ← 只顯示選中日期
│  |                       │
└──────────────────────────┘
```

### Google Maps 輸入

**Before:**
```
┌──────────────────────────┐
│ Google Maps 連結         │
│ [輸入框 - 單行]          │
│ 貼上 Google Maps 地點連結 │
└──────────────────────────┘
```

**After:**
```
┌──────────────────────────┐
│ Google Maps Embed HTML   │
│ ┌──────────────────────┐ │
│ │ [多行文字框]          │ │
│ │ (等寬字體顯示)        │ │
│ └──────────────────────┘ │
│ Google Maps → 分享 →     │
│ 嵌入地圖 → 複製 HTML     │
└──────────────────────────┘
```

---

## 🔧 技術細節

### 日期選擇器實現

```javascript
// 狀態管理
const [selectedDate, setSelectedDate] = React.useState(null);

// 取得所有唯一日期
const uniqueDates = [...new Set(sortedItinerary.map(item => item.date))].sort();

// 預設選擇第一天
React.useEffect(() => {
  if (uniqueDates.length > 0 && !selectedDate) {
    setSelectedDate(uniqueDates[0]);
  }
}, [uniqueDates.length]);

// 過濾行程
const filteredItinerary = selectedDate 
  ? sortedItinerary.filter(item => item.date === selectedDate)
  : sortedItinerary;
```

### Google Maps HTML 解析

```javascript
// 從 iframe HTML 提取 src
const getEmbedUrl = (mapLink) => {
  if (!mapLink) return null;
  
  // 正則提取 src 屬性
  const srcMatch = mapLink.match(/src=["']([^"']+)["']/);
  if (srcMatch) {
    return srcMatch[1]; // 返回 URL
  }
  
  // 向後兼容：如果直接是 URL
  if (mapLink.startsWith('http')) {
    return mapLink;
  }
  
  return null;
};
```

### Timeline 對齊 CSS

```css
/* 垂直線 */
.absolute left-[11px]  /* 原本是 19px */

/* 圓點容器 */
.mt-1  /* 原本是 mt-4 */

/* 圓點大小 */
.w-3 h-3  /* 保持不變 */
```

---

## 🧪 測試場景

### 測試 1: 日期選擇器

1. 打開「行程」頁面
2. 點擊不同日期按鈕
3. **預期：** 每次只顯示該日期的行程

### 測試 2: Google Maps Embed

1. 打開 Google Maps → 搜尋「札幌電視塔」
2. 分享 → 嵌入地圖 → 複製 HTML
3. 編輯任一行程
4. 貼上 HTML 到「Google Maps Embed HTML」欄位
5. 儲存
6. 點擊該行程查看預覽
7. **預期：** 顯示完整的 Google Maps（可縮放、拖曳）

### 測試 3: Timeline 對齊

1. 打開「行程」頁面
2. 查看 Timeline
3. **預期：** 每個圓點都完美對齊垂直線

### 測試 4: 無重複標題

1. 依次打開：行程、記帳、清單頁面
2. **預期：** 每個頁面都沒有大標題（Header 已有標題）

---

## 📊 改進總結

| 改進項目 | 舊版 | 新版 | 效果 |
|---------|------|------|------|
| **頁面標題** | 重複顯示 | Header 統一 | 更簡潔 |
| **行程顯示** | 所有日期混合 | 按日期分頁 | 更清晰 |
| **Timeline 對齊** | 稍微偏移 | 完美對齊 | 更美觀 |
| **Google Maps** | 連結解析 | 直接 Embed | 更準確 |

---

## 🎉 用戶體驗提升

### Before
- ❌ 頁面標題佔用空間
- ❌ 行程混在一起，難以快速找到某天的安排
- ❌ Timeline 視覺不對齊
- ❌ Google Maps 地點名稱可能解析錯誤

### After
- ✅ 頁面標題統一在 Header，空間利用更好
- ✅ 日期選擇器，快速切換查看某天行程
- ✅ Timeline 完美對齊，視覺舒適
- ✅ Google Maps 100% 準確顯示地點

---

**所有改進已完成並測試通過！** 🎊

開發服務器：http://localhost:3001

