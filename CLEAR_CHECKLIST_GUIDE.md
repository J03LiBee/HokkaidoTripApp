# 清除清單數據指南

如果你需要清除所有清單數據，請按照以下步驟操作：

## 方法 1: 通過 Firebase Console（推薦）

1. 前往 [Firebase Console](https://console.firebase.google.com/)
2. 選擇你的項目：`hokkaidowebapp`
3. 點擊左側菜單的 **Firestore Database**
4. 導航到以下路徑：
   ```
   artifacts
     └── 1:975455254658:web:483047a19033b2ede55c9b
         └── users
             └── [你的 User ID]
                 └── checklist
   ```
5. 選擇所有文檔，點擊刪除圖標
6. 刷新網頁，初始數據會自動重新載入（現在不含硬編碼的 ID）

## 方法 2: 通過應用程式本身

1. 登入應用程式
2. 前往「清單」頁面
3. 逐一點擊每個項目右側的垃圾桶圖標刪除
4. 現在刪除功能已經修復，應該可以正常刪除所有項目

## 修復說明

之前的問題是 `INITIAL_CHECKLIST` 中包含硬編碼的 `id` 字段（'1', '2', '3', 等），這些 ID 不是 Firestore 自動生成的真實 document ID。

當數據被種子到 Firestore 時：
1. Firestore 會生成新的 document ID（例如：`xyz123abc`）
2. 但硬編碼的 `id: '1'` 也被寫入為數據字段
3. 刪除時嘗試刪除 `id: '1'` 的文檔，但實際 document ID 是 `xyz123abc`
4. 結果：刪除失敗

**現在已修復**：移除了所有硬編碼的 `id` 字段，讓 Firestore 自動生成 document ID。

## 驗證修復

刷新應用後，嘗試：
1. 新增一個清單項目
2. 勾選它
3. 刪除它

如果所有操作都正常，修復成功！

## 清除你的帳號數據

如果你想完全重置你的清單數據：

### 選項 A: Firebase Console
按照「方法 1」的步驟刪除所有文檔

### 選項 B: 使用瀏覽器開發者工具
1. 打開應用程式
2. 按 F12 打開開發者工具
3. 切換到 Console 標籤
4. 運行以下腳本（替換 `YOUR_USER_ID` 為你的實際 User ID）：

```javascript
// 注意：這需要你登入後執行
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const clearChecklist = async (userId) => {
  const checklistRef = collection(
    db, 
    'artifacts', 
    '1:975455254658:web:483047a19033b2ede55c9b', 
    'users', 
    userId, 
    'checklist'
  );
  
  const snapshot = await getDocs(checklistRef);
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  
  console.log('所有清單項目已刪除');
};

// 執行
clearChecklist('YOUR_USER_ID');
```

## 獲取你的 User ID

1. 登入應用程式
2. 打開瀏覽器開發者工具 (F12)
3. Console 標籤
4. 輸入：`firebase.auth().currentUser.uid`
5. 複製顯示的 ID

## 注意事項

- 清單數據是**用戶專屬**的，每個用戶有自己的清單
- 刪除數據後，重新載入頁面會自動創建新的初始數據
- 新的初始數據不再包含硬編碼的 ID，所以可以正常刪除

---

最後更新：2024-12-19

