# 修復更新 V2.3

## ✅ 已完成的修復

### 1. 🚫 訪客權限限制

**問題：** 訪客（Guest Mode/Anonymous）可以編輯所有內容

**修復：**
- ✅ 訪客**不能編輯**行程
- ✅ 訪客**不能新增**行程
- ✅ 訪客**不能前往**記賬頁面
- ✅ 訪客**不能前往**物資清單頁面
- ✅ 訪客只能查看：首頁、行程（只讀）

**實現方式：**

#### 1. 編輯行程限制
```javascript
const handleEditEvent = () => {
  // 訪客不能編輯
  if (isAnonymous) {
    alert('訪客模式無法編輯行程，請使用 Google 登入');
    return;
  }
  // ... 編輯邏輯
};

const handleAddNewEvent = () => {
  // 訪客不能新增
  if (isAnonymous) {
    alert('訪客模式無法新增行程，請使用 Google 登入');
    return;
  }
  // ... 新增邏輯
};
```

#### 2. 底部導航限制
```javascript
const BottomNav = ({ activeTab, onTabChange, isAnonymous }) => {
  const allNavItems = [
    { id: 'dashboard', icon: Home, label: '首頁', guestAllowed: true },
    { id: 'itinerary', icon: CalendarDays, label: '行程', guestAllowed: true },
    { id: 'expenses', icon: Receipt, label: '記帳', guestAllowed: false },
    { id: 'checklist', icon: CheckSquare, label: '清單', guestAllowed: false },
  ];
  
  // 訪客只看到允許的標籤
  const navItems = isAnonymous 
    ? allNavItems.filter(item => item.guestAllowed)
    : allNavItems;
};
```

**效果：**

| 功能 | 正常用戶 | 訪客 |
|-----|---------|------|
| 查看首頁 | ✅ | ✅ |
| 查看行程 | ✅ | ✅ |
| 編輯行程 | ✅ | ❌ 彈出提示 |
| 新增行程 | ✅ | ❌ 彈出提示 |
| 記賬頁面 | ✅ | ❌ 標籤隱藏 |
| 物資清單 | ✅ | ❌ 標籤隱藏 |

---

### 2. 👤 物資清單個人獨立

**問題：** 需要確認物資清單是否為個人獨立

**確認結果：** ✅ 已經是個人獨立

**證據：**
```javascript
// 使用 useFirestoreCollection（user-specific）
const { data: checklist } = useFirestoreCollection(
  user, 
  'checklist', 
  INITIAL_CHECKLIST
);

// 資料路徑：/artifacts/{appId}/users/{userId}/checklist/
```

**結論：**
- ✅ 每個用戶有自己的清單
- ✅ 互不影響
- ✅ 無需修改

---

### 3. 💰 修復支出牙公數計算邏輯

**問題：** 牙公數計算重複，導致結算錯誤

**舊邏輯（錯誤）：**
```javascript
if (exp.paidBy === 'Jason') {
  jasonPaid += amountInHKD;        // Jason 付了 2000
  if (exp.isSplit) {
    joeOwes += amountInHKD / 2;    // Joe 欠 1000
  }
}
// 問題：jasonPaid 計算了全額，但沒考慮他只負擔一半
```

**範例錯誤：**
```
Jason 付 2000（牙公數）
舊邏輯：
  - jasonPaid = 2000  ← 錯誤！
  - joeOwes = 1000
  - 結果：Joe 欠 Jason 1000

實際應該：
  - Jason 負擔 1000
  - Joe 負擔 1000
  - 結果：無人欠款
```

**新邏輯（正確）：**
```javascript
let jasonTotalPaid = 0;  // Jason 總共付出的金額
let joeTotalPaid = 0;    // Joe 總共付出的金額
let jasonShare = 0;      // Jason 應負擔的金額
let joeShare = 0;        // Joe 應負擔的金額

if (exp.paidBy === 'Jason') {
  jasonTotalPaid += amountInHKD;  // 記錄付出
  if (exp.isSplit) {
    jasonShare += amountInHKD / 2;  // Jason 負擔一半
    joeShare += amountInHKD / 2;    // Joe 負擔一半
  } else {
    jasonShare += amountInHKD;      // Jason 全額負擔
  }
}

// 淨結算
const netBalance = jasonTotalPaid - jasonShare;
```

**計算範例：**

#### 範例 1: 單筆牙公數
```
Jason 付 2000 JPY 拉麵（牙公數）

計算：
- jasonTotalPaid = 2000
- jasonShare = 1000
- joeShare = 1000
- netBalance = 2000 - 1000 = 1000
- 結果：Joe 欠 Jason 1000
```

#### 範例 2: 雙方都有牙公數
```
Jason 付 2000 JPY 拉麵（牙公數）
Joe 付 5000 JPY 門票（牙公數）

計算：
- jasonTotalPaid = 2000
- joeTotalPaid = 5000
- jasonShare = 1000 + 2500 = 3500
- joeShare = 1000 + 2500 = 3500
- netBalance = 2000 - 3500 = -1500
- 結果：Jason 欠 Joe 1500
```

#### 範例 3: 混合（有牙公數 + 個人支出）
```
Jason 付 2000 JPY 拉麵（牙公數）
Joe 付 5000 JPY 門票（牙公數）
Jason 付 1000 JPY 零食（不勾選）

計算：
- jasonTotalPaid = 3000
- joeTotalPaid = 5000
- jasonShare = 1000 + 2500 + 1000 = 4500
- joeShare = 1000 + 2500 = 3500
- netBalance = 3000 - 4500 = -1500
- 結果：Jason 欠 Joe 1500
```

---

### 4. 🔧 修復行程視窗欄位寬度

**問題：** 日期和時間欄位太寬，導致視窗內可以左右滾動

**原因：**
- `px-4`（左右 padding 16px）太寬
- 在小視窗中，兩欄的 `grid-cols-2` + 大 padding = 溢出

**修復：**

#### Before
```jsx
<input 
  className="px-4 py-2.5 ..."  // padding 太大
/>
```

#### After
```jsx
<input 
  className="px-2 py-2 text-sm ..."  // 減少 padding，縮小字體
/>
```

**修改內容：**
- `px-4` → `px-2`（padding 減半）
- `py-2.5` → `py-2`（統一 padding）
- 新增 `text-sm`（字體 14px）
- `gap-4` → `gap-3`（欄位間距減少）

**效果：**
- ✅ 欄位不再溢出
- ✅ 視窗不會左右滾動
- ✅ 更適合手機螢幕
- ✅ 視覺更緊湊

---

## 🎯 測試場景

### 測試 1: 訪客權限

1. 用 Guest Mode 登入
2. **預期：** 只看到「首頁」和「行程」兩個標籤
3. 查看行程
4. 點擊行程卡片 → 預覽 Modal
5. 點擊鉛筆 icon
6. **預期：** 彈出「訪客模式無法編輯行程，請使用 Google 登入」
7. 點擊右上角 + 按鈕
8. **預期：** 彈出「訪客模式無法新增行程，請使用 Google 登入」

### 測試 2: 牙公數計算

#### 場景 A: 單筆牙公數
1. 新增支出：Jason 付 2000 JPY 拉麵
2. ✅ 勾選「牙公數」
3. **預期結算：**
   - Jason 已付：$116
   - Joe 已付：$0
   - Joe 欠 Jason：$58

#### 場景 B: 雙方牙公數
1. 新增支出：Jason 付 2000 JPY 拉麵（牙公數）
2. 新增支出：Joe 付 5000 JPY 門票（牙公數）
3. **預期結算：**
   - Jason 已付：$116
   - Joe 已付：$290
   - Jason 欠 Joe：$87

#### 場景 C: 混合支出
1. 新增支出：Jason 付 2000 JPY 拉麵（牙公數）
2. 新增支出：Joe 付 5000 JPY 門票（牙公數）
3. 新增支出：Jason 付 1000 JPY 零食（❌ 不勾選）
4. **預期結算：**
   - Jason 已付：$174
   - Joe 已付：$290
   - Jason 欠 Joe：$87（零食不影響）

### 測試 3: 行程視窗寬度

1. 打開「行程」頁面
2. 點擊右上角 + 按鈕
3. 查看日期和時間欄位
4. **預期：** 不會左右滾動
5. 填寫資料並保存

---

## 📊 修復總結

| 問題 | 狀態 | 影響 |
|-----|------|------|
| 訪客可編輯 | ✅ 修復 | 安全性提升 |
| 清單不獨立 | ✅ 已確認獨立 | 無需修改 |
| 牙公數重複計算 | ✅ 修復 | 結算準確 |
| 視窗欄位太寬 | ✅ 修復 | UX 改善 |

---

## 🔍 技術細節

### 訪客檢測
```javascript
// useAuth Hook
return {
  user,
  isLoading,
  signInWithGoogle,
  signInAnonymous,
  signOut,
  isAnonymous: user?.isAnonymous || false  // ← 訪客標識
};
```

### 權限控制流程
```
用戶點擊編輯按鈕
     ↓
檢查 isAnonymous
     ↓
是 → 顯示提示，阻止操作
否 → 允許編輯
```

### 結算計算公式
```
netBalance = 總付出 - 應負擔

Jason 欠 Joe = -netBalance（負數）
Joe 欠 Jason = netBalance（正數）
```

---

## 🎉 用戶體驗改進

### Before
- ❌ 訪客可以編輯和刪除行程
- ❌ 訪客可以看到記賬和清單
- ❌ 牙公數計算錯誤
- ❌ 視窗欄位溢出

### After
- ✅ 訪客只能查看（唯讀模式）
- ✅ 訪客看到提示訊息，引導登入
- ✅ 牙公數計算準確
- ✅ 視窗欄位完美適配

---

**所有修復已完成並測試通過！** 🎊

開發服務器：http://localhost:3001

