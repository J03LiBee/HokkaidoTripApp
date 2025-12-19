# 清除資料指南

## 🗑️ 如何清除記賬本資料

記賬本資料儲存在 Firebase Firestore，有兩種清除方式：

---

## 方法 1: 在 Firebase Console 手動刪除（推薦）

### 步驟：

1. **打開 Firebase Console**
   - 前往 https://console.firebase.google.com/
   - 選擇專案：`hokkaidowebapp`

2. **進入 Firestore Database**
   - 左側選單 → **Firestore Database**
   - 點擊頂部 **Data** 標籤

3. **找到記賬資料**
   - 導航到路徑：`trips/hokkaido-2025/expenses/`
   - 你會看到所有支出記錄

4. **刪除資料**
   - 點擊每筆記錄右側的「⋮」按鈕
   - 選擇「Delete document」
   - 或選擇整個 `expenses` collection，右鍵選擇「Delete collection」

5. **確認刪除**
   - 刷新網頁應用，記賬本應該是空的

---

## 方法 2: 使用 Firebase Admin SDK（需要後端）

如果你想用程式清除，需要設置後端：

```javascript
// 需要 Firebase Admin SDK
import admin from 'firebase-admin';

const db = admin.firestore();

async function clearExpenses() {
  const expensesRef = db.collection('trips/hokkaido-2025/expenses');
  const snapshot = await expensesRef.get();
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  console.log('所有記賬資料已清除');
}
```

---

## 方法 3: 在應用中添加「清空」按鈕（未實現）

如果你想要一個按鈕來清空，我可以添加這個功能。但出於安全考慮，建議使用 Firebase Console 手動刪除。

---

## 📊 Firestore 資料結構

### 記賬本資料路徑
```
/trips/
  └── hokkaido-2025/
      ├── expenses/          ← 記賬資料（共享）
      │   ├── doc1
      │   ├── doc2
      │   └── ...
      ├── itinerary/         ← 行程資料（共享）
      └── budget/            ← 預算資料（共享）

/artifacts/
  └── hokkaido-2025-v2/
      └── users/
          └── {userId}/
              └── checklist/ ← 清單資料（個人）
```

---

## 🧹 清除其他資料

### 清除行程資料
路徑：`/trips/hokkaido-2025/itinerary/`

### 清除預算資料
路徑：`/trips/hokkaido-2025/budget/`

### 清除個人清單
路徑：`/artifacts/hokkaido-2025-v2/users/{你的UID}/checklist/`

---

## ⚠️ 注意事項

1. **刪除前備份**
   - 如果資料重要，先備份
   - Firebase Console 可以匯出資料

2. **多用戶影響**
   - 記賬、行程、預算是共享的
   - 刪除會影響所有用戶

3. **清單是個人的**
   - 每個用戶的清單是獨立的
   - 刪除只影響自己

4. **無法撤銷**
   - Firestore 刪除操作無法撤銷
   - 確認後再刪除

---

## 🎯 快速清除步驟（記賬本）

```
1. https://console.firebase.google.com/
2. hokkaidowebapp 專案
3. Firestore Database → Data
4. trips → hokkaido-2025 → expenses
5. 右鍵 expenses collection → Delete collection
6. 確認刪除
7. ✅ 完成！
```

---

## 📝 驗證清除成功

1. 刷新網頁：http://localhost:3001
2. 前往「記賬」頁面
3. 應該看到空白狀態：「還沒有記錄」
4. 結算卡片顯示：
   - Jason 已付：$0
   - Joe 已付：$0
   - 已結算 ✓

---

## 🔄 重新填充初始資料

如果你想要重新開始，可以：

1. 清空現有資料（如上）
2. 重新載入頁面
3. 系統會自動填充 `INITIAL_EXPENSES`（目前是空的）

如果你想要一些範例資料，可以修改：
```javascript
// src/constants/initialData.js
export const INITIAL_EXPENSES = [
  { 
    title: '範例支出', 
    amount: 1000, 
    currency: 'JPY', 
    category: 'food',
    date: '2025-12-31',
    paidBy: 'Jason',
    isSplit: false,
    notes: ''
  },
];
```

---

**清除記賬資料最簡單的方法：在 Firebase Console 刪除 `expenses` collection！**

