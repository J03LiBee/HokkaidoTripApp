# 🚀 部署檢查清單 - 共享資料庫功能

## ✅ 需要做的事 (只需 2 步)

### 第 1 步: 更新 Firestore Security Rules ⭐ (必須)

1. 打開 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案 `hokkaidowebapp`
3. 左側選單 → **Firestore Database**
4. 頂部標籤 → **Rules** (規則)
5. 將 `firestore.rules` 的內容完整複製貼上
6. 點擊 **Publish** (發布)
7. ✅ 完成！

### 第 2 步: 推送代碼到 GitHub

```bash
# 將所有新檔案加入 Git
git add .

# 提交變更
git commit -m "feat: 實現多用戶共享資料庫功能

- 行程規劃改為共享 (所有用戶可見)
- 支出記錄改為共享
- 行李清單保持個人專屬
- 更新 Firestore Security Rules
- 新增 MainSample 風格設計"

# 推送到 GitHub
git push origin main
```

---

## ❓ 常見疑問

### Q: 舊的資料會唔會唔見？

**答**: **唔會！** 

- 舊資料仍然在 `/artifacts/hokkaido-2025-v2/users/{userId}/` 
- 新資料在 `/trips/hokkaido-2025/`
- 兩者**完全分開**，互不影響

### Q: 需唔需要清空 Firestore？

**答**: **唔需要！**

- 保留現有資料沒問題
- 第一次登入時會自動創建新的共享資料
- 舊資料可以稍後手動刪除（如果需要）

### Q: 資料會唔會重複？

**答**: **唔會！**

新代碼會自動：
1. 從**共享資料庫**讀取行程和支出
2. 從**個人資料庫**讀取行李清單
3. 不會讀取舊的個人行程

### Q: 幾時會創建共享資料？

**答**: **第一個用戶登入時自動創建**

```javascript
// useSharedCollection 會自動執行：
if (資料庫係空的) {
  自動創建初始資料 (INITIAL_ITINERARY, INITIAL_EXPENSES)
}
```

---

## 🧪 測試步驟

### 本地測試

```bash
# 確保開發服務器正在運行
npm run dev

# 打開瀏覽器: http://localhost:3001
```

### 測試 1: 單用戶測試

1. ✅ 用 Google 登入
2. ✅ 新增一個行程
3. ✅ 打開 Firebase Console > Firestore Database
4. ✅ 確認看到 `/trips/hokkaido-2025/itinerary/` 下有資料

### 測試 2: 多用戶測試

1. ✅ Chrome: 用 Google 帳號 A 登入
2. ✅ Firefox: 用 Google 帳號 B 登入
3. ✅ Chrome: 新增行程 "早餐 - 拉麵"
4. ✅ Firefox: 應該即時看到 "早餐 - 拉麵" 出現

---

## 📊 資料庫路徑對比

### 舊版 (個人資料)
```
/artifacts/hokkaido-2025-v2/users/{userId}/
  ├── itinerary/     ❌ 不再使用
  ├── expenses/      ❌ 不再使用
  ├── budget/        ❌ 不再使用
  └── checklist/     ✅ 仍然使用 (個人專屬)
```

### 新版 (共享資料)
```
/trips/hokkaido-2025/
  ├── itinerary/     🌐 所有用戶共享
  ├── expenses/      🌐 所有用戶共享
  └── budget/        🌐 所有用戶共享
```

---

## ⚠️ 重要提醒

### 1. 必須更新 Security Rules

如果**沒有**更新 Firestore Rules，會出現：

```
Error: Missing or insufficient permissions
```

### 2. 確認 Google Sign-in 已啟用

Firebase Console → Authentication → Sign-in method → Google → **已啟用**

### 3. Vercel 環境變量已設定

確認 Vercel 上已設定所有 Firebase 配置：
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

---

## 🎉 完成後的效果

- ✅ 所有用戶看到相同的行程
- ✅ 任何人新增行程，所有人即時看到
- ✅ 支出記錄自動同步
- ✅ 行李清單保持個人專屬

---

## 🆘 遇到問題？

### 1. 檢查 Browser Console (F12)

```javascript
// 應該看到：
✅ Successfully connected to Firestore
✅ Listening to shared collection: itinerary

// 不應該看到：
❌ permission-denied
❌ Missing or insufficient permissions
```

### 2. 檢查 Firestore Rules

Firebase Console → Firestore → Rules → 確認已發布最新規則

### 3. 清除快取

```bash
# Chrome: Ctrl+Shift+Delete → 清除快取
# 或使用無痕模式測試
```

---

**總結**: 唔需要重新初始化 Firebase，只需要更新 Security Rules 就可以了！🚀


