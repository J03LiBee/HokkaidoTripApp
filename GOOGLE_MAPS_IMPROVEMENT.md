# Google Maps URL 自動轉換功能

更新日期：2024-12-19

## 🎉 新功能

用戶現在可以直接貼上 **任何** Google Maps 連結，系統會自動轉換成嵌入格式！

### 之前 ❌
```
用戶需要：
1. 打開 Google Maps
2. 點擊「分享」
3. 點擊「嵌入地圖」
4. 複製整段 <iframe> HTML 代碼
5. 貼到應用程式
```

### 現在 ✅
```
用戶只需：
1. 打開 Google Maps
2. 點擊「分享」→「複製連結」
3. 貼到應用程式 → 自動轉換！
```

## 🔗 支援的格式

### 1️⃣ 分享短連結（最簡單）
```
https://maps.app.goo.gl/xxxxx
https://goo.gl/maps/xxxxx
```

**獲取方式：**
- Google Maps → 分享 → 複製連結

### 2️⃣ 完整 URL
```
https://www.google.com/maps/place/札幌市+手稻滑雪場/@43.064171,141.346939,17z
https://www.google.com/maps/@43.064171,141.346939,17z
https://www.google.com/maps/search/札幌+拉麵
```

**包含：**
- Place URLs（地點連結）
- Coordinate URLs（座標連結）
- Search URLs（搜尋連結）

### 3️⃣ 嵌入代碼（向下兼容）
```html
<iframe src="https://www.google.com/maps/embed?pb=..." width="600" height="450" ...></iframe>
```

**仍然支援：**
- 之前的輸入方式完全保留
- 舊數據完全兼容

## 🛠️ 技術實現

### 新增文件

```
src/utils/mapHelpers.js
```

### 核心功能

#### 1. **URL 格式識別與轉換**

```javascript
import { getEmbedUrl } from '@utils/mapHelpers';

// 自動識別並轉換
const embedUrl = getEmbedUrl(userInput);

// 支援的輸入：
// - 短連結：maps.app.goo.gl/xxxxx
// - 地點連結：google.com/maps/place/...
// - 座標連結：@43.064171,141.346939
// - 搜尋連結：google.com/maps/search/...
// - iframe HTML：<iframe src="...">
```

#### 2. **智能解析**

```javascript
// 解析地點名稱
const placeMatch = url.match(/google\.com\/maps\/place\/([^/]+)/);
→ https://www.google.com/maps/embed/v1/place?q=札幌市手稻滑雪場

// 解析座標
const coordMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
→ https://www.google.com/maps/embed?q=43.064171,141.346939&z=15

// 解析搜尋
const searchMatch = url.match(/google\.com\/maps\/search\/([^/]+)/);
→ https://www.google.com/maps/embed/v1/search?q=札幌拉麵
```

#### 3. **向下兼容**

```javascript
// 如果是 iframe HTML，提取 src
if (input.includes('<iframe')) {
  const srcMatch = input.match(/src=["']([^"']+)["']/);
  return srcMatch[1];
}

// 如果已經是 embed URL，直接返回
if (input.includes('google.com/maps/embed')) {
  return input;
}
```

## 📱 用戶體驗改進

### EventModal（新增/編輯行程）

**之前：**
```jsx
<label>Google Maps Embed HTML</label>
<textarea placeholder='貼上 <iframe> HTML 代碼' />
<p>Google Maps → 分享 → 嵌入地圖 → 複製 HTML</p>
```

**現在：**
```jsx
<label>🔗 Google Maps 連結</label>
<textarea placeholder='貼上 Google Maps 連結或 <iframe> HTML' />
<p>
  💡 三種方式都可以：
  1️⃣ 分享連結：https://maps.app.goo.gl/xxxxx
  2️⃣ 完整連結：https://www.google.com/maps/place/...
  3️⃣ 嵌入代碼：<iframe src="...">...</iframe>
</p>
```

### 即時預覽

- ✅ 貼上連結後立即顯示地圖預覽
- ✅ 錯誤處理：無效連結不顯示預覽
- ✅ 支援所有格式

## 📋 修改的文件

```
✅ src/utils/mapHelpers.js (新增)
   - convertToEmbedUrl(): 轉換各種 URL 格式
   - getEmbedUrl(): 統一入口函數
   - generateIframeHtml(): 生成 iframe HTML
   - isValidMapsInput(): 驗證輸入

✅ src/components/modals/EventModal.jsx
   - 移除本地 getEmbedUrl 函數
   - 導入 mapHelpers
   - 更新 UI 提示文字

✅ src/components/modals/EventDetailModal.jsx
   - 移除本地 getEmbedUrl 函數
   - 導入 mapHelpers
```

## 🧪 測試案例

### 測試用連結

#### 1. 手稻滑雪場（座標）
```
https://www.google.com/maps/@43.064171,141.346939,17z
```

#### 2. 札幌市（地點）
```
https://www.google.com/maps/place/札幌市/@43.0642,141.3469,12z
```

#### 3. 搜尋拉麵
```
https://www.google.com/maps/search/札幌+拉麵
```

#### 4. 分享短連結
```
https://maps.app.goo.gl/xxxxx
```

### 測試步驟

1. ✅ 新增行程
2. ✅ 在「Google Maps 連結」欄位貼上任一格式的連結
3. ✅ 確認地圖立即顯示預覽
4. ✅ 儲存後，在詳情頁查看地圖正確顯示
5. ✅ 編輯行程，確認連結保留

## 🔍 轉換邏輯詳解

### 優先級

```
1. 檢查是否為 iframe HTML → 提取 src
2. 檢查是否已經是 embed URL → 直接返回
3. 檢查是否為短連結 → 轉換為基本 embed
4. 檢查是否為地點 URL → 提取地點名稱轉換
5. 檢查是否為座標 URL → 提取座標轉換
6. 檢查是否為搜尋 URL → 提取搜尋詞轉換
7. 嘗試從 URL 參數提取 q/query
8. 無法解析 → 返回 null
```

### 範例轉換

```javascript
// 輸入：分享連結
https://maps.app.goo.gl/abc123

// 輸出：embed URL
https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d0!3d0...

// ─────────────────────────

// 輸入：地點連結
https://www.google.com/maps/place/手稻滑雪場/@43.064,141.346,17z

// 輸出：embed URL
https://www.google.com/maps/embed/v1/place?q=手稻滑雪場

// ─────────────────────────

// 輸入：座標
https://www.google.com/maps/@43.064171,141.346939,17z

// 輸出：embed URL
https://www.google.com/maps/embed?q=43.064171,141.346939&z=15
```

## 🎯 優勢

### 用戶體驗
- ✅ **簡單**：只需複製分享連結
- ✅ **快速**：減少 3 個步驟
- ✅ **直觀**：符合用戶習慣
- ✅ **靈活**：支援多種格式

### 技術實現
- ✅ **向下兼容**：舊數據完全支援
- ✅ **容錯性高**：無法解析時不顯示
- ✅ **維護性好**：集中管理轉換邏輯
- ✅ **可擴展**：易於支援新格式

## ⚠️ 限制

### 短連結限制
- 短連結（maps.app.goo.gl）無法完全解析地點資訊
- 會顯示一個基本的地圖視圖
- 建議：如需精確地點，使用完整 URL

### API Key
- 部分 embed URL 格式需要 Google Maps API key
- 目前使用不需要 key 的基本格式
- 未來可配置 API key 以支援更多功能

## 🚀 使用指南

### 對於用戶

#### 最簡單的方式（推薦）
1. 打開 Google Maps
2. 搜尋地點
3. 點擊「分享」
4. 點擊「複製連結」
5. 貼到「Google Maps 連結」欄位
6. 完成！✨

#### 其他方式
- 從瀏覽器網址列複製完整 URL
- 從 Google Maps 嵌入代碼複製（舊方式仍支援）

### 對於開發者

#### 使用轉換函數
```javascript
import { getEmbedUrl, isValidMapsInput, generateIframeHtml } from '@utils/mapHelpers';

// 轉換 URL
const embedUrl = getEmbedUrl(userInput);

// 驗證輸入
if (isValidMapsInput(userInput)) {
  // 有效的 Google Maps 輸入
}

// 生成 iframe HTML
const html = generateIframeHtml(embedUrl);
```

## 📝 後續改進空間

### 可能的增強
- [ ] 支援 Google Maps API key 配置
- [ ] 更精確的短連結解析
- [ ] 支援其他地圖服務（Apple Maps, OpenStreetMap）
- [ ] 自動提取地點名稱顯示
- [ ] 地圖縮放級別自動優化

### 用戶反饋
歡迎提供使用反饋和改進建議！

---

最後更新：2024-12-19

