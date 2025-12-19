# 🔥 Firestore 資料庫設定指南

## 📋 目錄
1. [Firestore Security Rules 部署](#1-firestore-security-rules-部署)
2. [資料庫結構預覽](#2-資料庫結構預覽)
3. [測試共享功能](#3-測試共享功能)
4. [常見問題](#4-常見問題)

---

## 1. Firestore Security Rules 部署

### 步驟 1: 進入 Firebase Console

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的專案 (`hokkaidowebapp`)
3. 在左側選單點擊 **Firestore Database**

### 步驟 2: 更新安全規則

1. 點擊頂部的 **規則 (Rules)** 標籤
2. 將以下內容**完整複製**並**貼上替換**現有規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function: Check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // ===== SHARED TRIP DATA =====
    // 共享旅程資料：所有已登入用戶可讀寫
    match /trips/{tripId} {
      allow read, write: if isAuthenticated();
      
      // Shared Itinerary (行程規劃)
      match /itinerary/{itemId} {
        allow read, write: if isAuthenticated();
      }
      
      // Shared Expenses (支出記錄)
      match /expenses/{expenseId} {
        allow read, write: if isAuthenticated();
      }
      
      // Shared Budget (預算項目)
      match /budget/{budgetId} {
        allow read, write: if isAuthenticated();
      }
    }
    
    // ===== USER-SPECIFIC DATA =====
    // 用戶專屬資料：僅擁有者可讀寫
    match /artifacts/{appId}/users/{userId} {
      allow read, write: if isAuthenticated() && request.auth.uid == userId;
      
      // User-specific checklist (行李清單)
      match /checklist/{itemId} {
        allow read, write: if isAuthenticated() && request.auth.uid == userId;
      }
      
      // Legacy collections (向下兼容舊版本)
      match /itinerary/{itemId} {
        allow read, write: if isAuthenticated() && request.auth.uid == userId;
      }
      
      match /budget/{itemId} {
        allow read, write: if isAuthenticated() && request.auth.uid == userId;
      }
      
      match /expenses/{itemId} {
        allow read, write: if isAuthenticated() && request.auth.uid == userId;
      }
    }
  }
}
```

### 步驟 3: 發布規則

1. 檢查右上角是否有 ⚠️ 錯誤提示
2. 如果沒有錯誤，點擊 **發布 (Publish)** 按鈕
3. 等待幾秒鐘，直到看到 "規則已發布" 的確認訊息

---

## 2. 資料庫結構預覽

部署後，你的 Firestore 將會有以下結構：

```
📁 Firestore Database
│
├── 📂 trips (共享資料)
│   └── 📂 hokkaido-2025
│       ├── 📂 itinerary (行程規劃) 🌐
│       │   ├── 📄 doc1: { date, time, title, location, type, notes }
│       │   ├── 📄 doc2: { ... }
│       │   └── 📄 ...
│       │
│       ├── 📂 expenses (支出記錄) 🌐
│       │   ├── 📄 doc1: { title, amount, currency, category, date, notes }
│       │   └── 📄 ...
│       │
│       └── 📂 budget (預算項目) 🌐
│           ├── 📄 doc1: { item, amount, payer, status }
│           └── 📄 ...
│
└── 📂 artifacts
    └── 📂 hokkaido-2025-v2
        └── 📂 users
            ├── 📂 {user1_uid} (用戶 A)
            │   └── 📂 checklist (行李清單) 👤
            │       ├── 📄 doc1: { text, category, checked }
            │       └── 📄 ...
            │
            └── 📂 {user2_uid} (用戶 B)
                └── 📂 checklist (行李清單) 👤
                    ├── 📄 doc1: { text, category, checked }
                    └── 📄 ...

🌐 = 所有用戶共享
👤 = 個人專屬
```

---

## 3. 測試共享功能

### 測試 A: 單一用戶測試

1. 用 Google 帳號登入
2. 新增一個行程項目 (例如：「早餐 - 拉麵」)
3. 打開 Firebase Console > Firestore Database
4. ✅ 確認可以看到 `/trips/hokkaido-2025/itinerary` 下有新資料

### 測試 B: 多用戶實時同步測試

#### 準備工作
- 準備 2 個不同的 Google 帳號
- 使用 2 個不同的瀏覽器 (或無痕模式)

#### 測試步驟

**步驟 1: 用戶 A 登入**
```
瀏覽器 1 (Chrome):
1. 打開 http://localhost:3001
2. 用 Google 帳號 A 登入
3. 新增行程: "12:00 - 札幌拉麵"
```

**步驟 2: 用戶 B 登入**
```
瀏覽器 2 (Firefox):
1. 打開 http://localhost:3001
2. 用 Google 帳號 B 登入
3. ✅ 確認可以看到用戶 A 新增的「札幌拉麵」
```

**步驟 3: 實時同步測試**
```
瀏覽器 1 (用戶 A):
- 新增行程: "14:00 - 狸小路購物"

瀏覽器 2 (用戶 B):
- ✅ 應該即時看到「狸小路購物」出現（無需重新整理頁面）
```

**步驟 4: 修改測試**
```
瀏覽器 2 (用戶 B):
- 點擊「札幌拉麵」編輯，改時間為 "11:30"

瀏覽器 1 (用戶 A):
- ✅ 應該即時看到時間變更為 11:30
```

**步驟 5: 刪除測試**
```
瀏覽器 1 (用戶 A):
- 刪除「狸小路購物」

瀏覽器 2 (用戶 B):
- ✅ 應該即時看到該行程消失
```

### 測試 C: 個人資料隔離測試

```
用戶 A:
1. 進入「行李清單」
2. 勾選「護照」、「手機」

用戶 B:
1. 進入「行李清單」
2. ✅ 應該看不到用戶 A 的勾選項目
3. 勾選「相機」、「充電器」

用戶 A:
- ✅ 應該看不到用戶 B 的勾選項目
```

---

## 4. 常見問題

### Q1: 更新規則後仍然出現 `permission-denied` 錯誤？

**可能原因**:
- 規則尚未完全生效（需要幾秒鐘）
- 瀏覽器快取問題

**解決方法**:
```bash
1. 等待 10-30 秒讓規則生效
2. 清除瀏覽器快取並重新登入
3. 檢查 Firebase Console > Rules 確認規則已發布
```

### Q2: 看不到其他用戶新增的資料？

**檢查清單**:
- ✅ 確認兩個用戶都已登入（非匿名）
- ✅ 確認 Firestore Rules 已正確部署
- ✅ 檢查 Browser Console 是否有錯誤訊息
- ✅ 確認網路連線正常

**除錯方法**:
```javascript
// 打開 Browser Console (F12)
// 應該看到實時更新的訊息
// 如果有錯誤，會顯示詳細的 Firestore 錯誤碼
```

### Q3: 資料會不會被其他陌生人看到？

**答案**: **不會**

只有以下情況才能存取共享資料：
1. ✅ 必須使用 **Google 登入**（或匿名登入）
2. ✅ 必須知道應用程式的 **URL**
3. ✅ 必須通過 Firebase Authentication

**安全建議**:
- 不要在公開場合分享應用程式 URL
- 只邀請參加旅行的朋友使用
- 未來可以增加「旅程密碼」功能進一步保護

### Q4: 如何新增更多旅程？

**目前狀況**:
- 目前固定為 `hokkaido-2025` 單一旅程

**未來擴展**:
```javascript
// 可以修改為動態旅程 ID
const TRIP_ID = 'maldives-2026'; // 馬爾地夫
const TRIP_ID = 'tokyo-2025-summer'; // 東京
```

**實現方式**:
1. 在 `firestore.js` 中將 `SHARED_TRIP_ID` 改為動態參數
2. 增加「創建旅程」功能
3. 用戶可以選擇加入不同的旅程

### Q5: 離線時可以使用嗎？

**答案**: **可以**

Firestore 支援離線快取：
- ✅ 離線時可以查看已載入的資料
- ✅ 離線時的修改會被暫存
- ✅ 連線後自動同步到雲端
- ⚠️ 衝突時採用「最後寫入獲勝」策略

---

## 🚀 下一步

設定完成後：

1. ✅ **本地測試**: 使用 `npm run dev` 測試共享功能
2. ✅ **部署到 Vercel**: 推送到 GitHub 後自動部署
3. ✅ **邀請朋友**: 分享應用程式 URL 給旅伴
4. ✅ **開始規劃**: 一起編輯行程、記帳！

---

**設定完成！** 🎉

現在你的應用程式支援多用戶實時協作了！


