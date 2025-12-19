# 🌐 共享資料庫架構說明

## 完成日期
2025-12-11

## 概述
實現了**多用戶共享資料**功能，讓所有參加同一個旅行的用戶都能查看和編輯相同的行程、預算和支出記錄。

---

## 📊 資料庫結構

### ✅ 共享資料 (Shared Data)
**路徑**: `/trips/hokkaido-2025/{collection}`

所有已登入的用戶都可以讀取和修改：

#### 1. **行程規劃** (`/itinerary`)
```javascript
{
  date: "2025-12-31",
  time: "12:00",
  title: "札幌拉麵共和國",
  location: "札幌",
  type: "food", // food, transport, stay, activity
  notes: "必吃味噌拉麵"
}
```

#### 2. **支出記錄** (`/expenses`)
```javascript
{
  title: "拉麵",
  amount: 1500,
  currency: "JPY", // JPY or HKD
  category: "food", // food, transport, accommodation, activity, shopping, other
  date: "2025-12-31",
  notes: "札幌拉麵共和國"
}
```

#### 3. **預算項目** (`/budget`)
```javascript
{
  item: "機票",
  amount: 5000,
  payer: "大家分擔",
  status: "已結算" // 已結算, 未支付
}
```

---

### 👤 個人資料 (User-Specific Data)
**路徑**: `/artifacts/hokkaido-2025-v2/users/{userId}/{collection}`

只有該用戶自己可以讀取和修改：

#### 1. **行李清單** (`/checklist`)
```javascript
{
  text: "護照",
  category: "證件",
  checked: true
}
```

---

## 🔐 安全規則 (Firestore Security Rules)

```javascript
// 共享旅程資料 - 所有登入用戶可讀寫
match /trips/{tripId} {
  allow read, write: if request.auth != null;
  
  match /itinerary/{itemId} {
    allow read, write: if request.auth != null;
  }
  
  match /expenses/{expenseId} {
    allow read, write: if request.auth != null;
  }
  
  match /budget/{budgetId} {
    allow read, write: if request.auth != null;
  }
}

// 個人資料 - 只有擁有者可讀寫
match /artifacts/{appId}/users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
  
  match /checklist/{itemId} {
    allow read, write: if request.auth != null && request.auth.uid == userId;
  }
}
```

---

## 🛠️ 技術實現

### 新增的 Firestore 函數

**`src/services/firestore.js`**

```javascript
// 常量
export const SHARED_TRIP_ID = 'hokkaido-2025';

// 獲取共享集合引用
export const getSharedCollection = (collectionName) => {
  return collection(db, 'trips', SHARED_TRIP_ID, collectionName);
};

// 訂閱共享集合
export const subscribeToSharedCollection = (collectionName, initialData, callback);

// CRUD 操作
export const addSharedDocument = async (collectionName, data);
export const updateSharedDocument = async (collectionName, docId, data);
export const deleteSharedDocument = async (collectionName, docId);
```

### 新增的 React Hook

**`src/hooks/useSharedCollection.js`**

```javascript
// 使用方式
const { data, loading, error } = useSharedCollection('itinerary', INITIAL_ITINERARY);
```

---

## 🔄 應用程式更新

### `App.jsx` 主要變更

**修改前**:
```javascript
// 用戶專屬資料
const { data: itinerary } = useFirestoreCollection(user, 'itinerary', INITIAL_ITINERARY);
const { data: expenses } = useFirestoreCollection(user, 'expenses', INITIAL_EXPENSES);
```

**修改後**:
```javascript
// 共享資料 (所有用戶都能看到)
const { data: itinerary } = useSharedCollection('itinerary', INITIAL_ITINERARY);
const { data: expenses } = useSharedCollection('expenses', INITIAL_EXPENSES);

// 個人資料 (只有自己能看到)
const { data: checklist } = useFirestoreCollection(user, 'checklist', INITIAL_CHECKLIST);
```

---

## 🚀 部署步驟

### 1. 更新 Firestore Security Rules

在 Firebase Console:
1. 進入 **Firestore Database**
2. 點擊 **規則 (Rules)** 標籤
3. 將 `firestore.rules` 的內容複製貼上
4. 點擊 **發布 (Publish)**

### 2. 測試共享功能

1. 使用 **Google 登入**創建第一個用戶
2. 新增一些行程和支出
3. 使用另一個 Google 帳號登入
4. ✅ 確認可以看到第一個用戶新增的行程和支出
5. ✅ 確認兩個用戶的行李清單是分開的

### 3. 驗證實時同步

1. 在兩個瀏覽器視窗同時登入不同帳號
2. 在視窗 A 新增一個行程
3. ✅ 視窗 B 應該**即時顯示**新行程（無需重新整理）

---

## 🎯 使用場景

### 場景 1: 多人共同規劃行程
- **小明**: 新增「早餐 - 札幌拉麵」
- **小華**: 即時看到小明的新增，接著新增「午餐 - 海鮮丼」
- **小美**: 修改「早餐」的時間從 9:00 改為 10:00
- ✅ **所有人即時同步**

### 場景 2: 即時記帳
- **小明**: 在餐廳付款後立即記錄「拉麵 ¥1500」
- **小華**: 在手機上即時看到小明的支出
- **小美**: 繼續記錄自己的交通費用
- ✅ **總支出自動累加，所有人都能看到**

### 場景 3: 個人行李準備
- **小明**: 勾選「護照」、「手機」
- **小華**: 勾選「相機」、「充電器」
- ✅ **各自的清單不會互相影響**

---

## 📌 注意事項

### 1. 資料隱私
- **共享資料**: 所有登入的用戶都能看到和修改
- **個人資料**: 行李清單只有自己能看到
- ⚠️ **不要在共享資料中記錄敏感個人資訊**

### 2. 衝突處理
- Firebase Firestore 使用 **最後寫入獲勝 (Last Write Wins)** 策略
- 如果兩個用戶同時修改同一筆資料，後提交的會覆蓋先提交的
- 💡 **建議**: 溝通協調，避免同時編輯同一項目

### 3. 離線支援
- Firestore 自動支援離線快取
- 離線時的修改會在連線後自動同步
- ✅ **即使在飛機上也能記帳，落地後自動同步**

---

## 🔮 未來擴展

### 可能的改進方向

1. **多旅程支援**
   - 目前固定為 `hokkaido-2025`
   - 未來可支援創建多個旅程

2. **權限管理**
   - 增加「旅程管理員」角色
   - 設定唯讀/可編輯權限

3. **版本歷史**
   - 記錄誰在何時修改了什麼
   - 支援回溯到之前的版本

4. **通知功能**
   - 有人新增行程時推送通知
   - 支出接近預算時提醒

---

## ✅ 完成清單

- ✅ 實現共享資料庫架構
- ✅ 更新 Firestore Security Rules
- ✅ 創建 `useSharedCollection` Hook
- ✅ 更新 App.jsx 使用共享資料
- ✅ 行程規劃改為共享
- ✅ 支出記錄改為共享
- ✅ 預算項目改為共享
- ✅ 行李清單保持個人專屬
- ✅ 實時同步測試完成

---

**共享資料庫已完成！** 🎉

現在所有用戶都可以一起規劃行程、記帳，並即時看到彼此的更新！


