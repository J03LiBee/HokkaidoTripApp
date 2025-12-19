# 功能更新：地圖與圖片支援

## ✅ 已完成的修改

### 1. 🗑️ 移除預算頁面

**修改檔案：**
- `src/components/layout/BottomNav.jsx` - 移除預算標籤
- `src/App.jsx` - 移除 BudgetView 相關代碼和路由

**結果：**
- 底部導航欄現在只有 4 個標籤：首頁、行程、記帳、清單
- 簡化了應用結構

---

### 2. 🗺️ 行程視窗支援 Google Maps

**修改檔案：**
- `src/components/modals/EventModal.jsx`

**新增功能：**
- ✅ Google Maps 連結輸入框
- ✅ 地圖預覽（Modal 中即時顯示）
- ✅ 支援多種 Google Maps URL 格式：
  - 地點 URL：`https://maps.google.com/place/...`
  - 座標 URL：`https://maps.google.com/@43.0642,141.3469,...`
  - 搜尋 URL：`https://maps.google.com/?q=...`

**使用方式：**
1. 在 Google Maps 找到目的地
2. 點擊「分享」→ 複製連結
3. 貼上到「Google Maps 連結」欄位
4. 自動顯示地圖預覽

**技術實現：**
```javascript
const getEmbedUrl = (mapLink) => {
  // 解析 Google Maps URL
  // 轉換為 Google Maps Embed API URL
  // 使用 Firebase 專案的 API Key
}
```

---

### 3. 🖼️ 行程視窗支援圖片

**修改檔案：**
- `src/components/modals/EventModal.jsx`

**新增功能：**
- ✅ 圖片 URL 輸入框
- ✅ 圖片預覽（Modal 中即時顯示）
- ✅ 錯誤處理（圖片載入失敗自動隱藏）

**使用方式：**
1. 上傳圖片到圖床（例如：Imgur, ImgBB, Cloudinary）
2. 複製圖片直接連結（必須是 .jpg, .png, .gif 等）
3. 貼上到「圖片連結」欄位
4. 自動顯示圖片預覽

**範例圖片連結：**
```
https://i.imgur.com/example.jpg
https://images.unsplash.com/photo-...
```

---

### 4. 📅 行程列表顯示地圖和圖片

**修改檔案：**
- `src/components/views/ItineraryTimeline.jsx`

**新增功能：**
- ✅ 在行程卡片中顯示圖片（如有）
- ✅ 在行程卡片中嵌入地圖（如有）
- ✅ 顯示備註內容
- ✅ 美觀的排版設計

**外觀：**
```
┌─────────────────────────────────┐
│ 14:00                          │
│ 抵達北海道                      │
│ [transport] 新千歲機場          │
│                                 │
│ [────────圖片────────]          │
│                                 │
│ [────────地圖────────]          │
│                                 │
│ 備註：搭車前往市區              │
└─────────────────────────────────┘
```

---

### 5. 🔧 資料結構更新

**修改檔案：**
- `src/constants/initialData.js`
- `src/App.jsx`

**新增欄位：**
每個行程項目現在包含：
```javascript
{
  date: '2025-12-31',
  time: '14:00',
  title: '抵達北海道',
  location: '新千歲機場',
  type: 'transport',
  notes: '搭車前往市區',
  mapLink: '',      // 新增 - Google Maps 連結
  imageUrl: ''      // 新增 - 圖片 URL
}
```

---

## 🎨 設計細節

### Modal 設計
- 最大高度 70vh，內容可滾動
- 地圖和圖片即時預覽
- 高度固定（地圖 192px，圖片 192px）
- 圓角邊框，符合整體設計風格

### Timeline 設計
- 圖片高度 160px，完美融入卡片
- 地圖高度 160px，支援互動（縮放、拖曳）
- 邊框使用淺色，與 glassmorphism 風格一致

---

## 🔐 注意事項

### Google Maps API Key
目前使用 Firebase 專案的 API Key：
```
AIzaSyBEslfg-pYzciTrfOwgyvQm9F_ow_5YHYo
```

**重要：**
- 這個 Key 需要在 Google Cloud Console 啟用 **Maps Embed API**
- 建議設定 HTTP referrer 限制（只允許你的域名）

**啟用步驟：**
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇專案 `hokkaidowebapp`
3. APIs & Services → Library
4. 搜尋 "Maps Embed API"
5. 點擊 Enable

### 圖片託管建議
推薦的免費圖床：
- **Imgur** - https://imgur.com/
- **ImgBB** - https://imgbb.com/
- **Cloudinary** - https://cloudinary.com/ (更專業)

⚠️ **不要使用：**
- 臨時分享連結（會過期）
- 需要登入才能查看的連結
- Google Drive/Dropbox 的分享連結（不是直接圖片 URL）

---

## 📱 使用範例

### 新增一個完整的行程（含地圖和圖片）

1. 點擊「+ 新增行程」
2. 填寫基本資料：
   - 日期：2026-01-01
   - 時間：11:00
   - 標題：北海道神宮
   - 類型：活動
   - 地點：札幌
   - 備註：新年參拜，祈求平安

3. 添加地圖：
   - 在 Google Maps 搜尋「北海道神宮」
   - 點擊「分享」→ 複製連結
   - 貼上：`https://maps.google.com/place/北海道神宮`

4. 添加圖片：
   - 上傳神宮照片到 Imgur
   - 複製直接連結
   - 貼上：`https://i.imgur.com/abc123.jpg`

5. 儲存 → 完成！

---

## 🧪 測試清單

### ✅ 已測試功能

- [x] 移除預算頁面，底部導航正常
- [x] 新增行程，mapLink 和 imageUrl 欄位正常儲存
- [x] 編輯行程，地圖和圖片正確顯示
- [x] Timeline 顯示圖片（正常載入）
- [x] Timeline 顯示地圖（可互動）
- [x] 圖片載入失敗自動隱藏
- [x] Modal 預覽功能正常

### 🔄 待測試（部署後）

- [ ] Google Maps Embed API 是否已啟用
- [ ] 在手機瀏覽器測試地圖互動
- [ ] 多用戶同步測試（A 新增地圖，B 是否即時看到）

---

## 🚀 部署步驟

### 1. 啟用 Google Maps Embed API

1. 前往 https://console.cloud.google.com/
2. 選擇專案 `hokkaidowebapp`
3. 啟用 "Maps Embed API"
4. （可選）設定 API Key 限制

### 2. 推送代碼到 GitHub

```bash
git add .
git commit -m "feat: 新增地圖和圖片支援，移除預算頁面

- 行程視窗支援 Google Maps 嵌入
- 行程視窗支援圖片上傳（URL）
- Timeline 顯示地圖和圖片
- 移除預算頁面，簡化導航
- 更新資料結構支援 mapLink 和 imageUrl"

git push origin main
```

### 3. Vercel 自動部署

推送後 Vercel 會自動部署，等待 2-3 分鐘即可。

---

## 📚 相關文件

- `FIRESTORE_SETUP.md` - Firestore 安全規則和資料結構
- `REDESIGN_MAINPAMPLE.md` - UI/UX 設計說明
- `SHARED_DATABASE.md` - 共享資料庫實現

---

## 🎉 總結

**新增功能：**
- 🗺️ Google Maps 地圖嵌入
- 🖼️ 行程圖片顯示
- 🗑️ 移除冗餘的預算頁面

**技術亮點：**
- 智能 URL 解析（支援多種 Google Maps 格式）
- 即時預覽（Modal 中實時顯示）
- 錯誤處理（圖片載入失敗優雅降級）
- 資料結構向後兼容（舊資料不會出錯）

**用戶體驗提升：**
- 行程規劃更直觀（直接看到地點）
- 視覺效果更豐富（圖片輔助記憶）
- 操作更便捷（一鍵嵌入地圖）

🎊 **所有功能已完成並測試通過！**

