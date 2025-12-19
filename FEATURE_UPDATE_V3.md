# Feature Update V3 - 清單分類 & 天氣預報

更新日期：2024-12-19

## 🎉 新功能

### 1. **清單分類系統**

清單現在分為兩種類型：

#### 📋 個人清單（私人）
- **用戶專屬**：每個用戶有自己的私人清單
- **獨立數據**：不同用戶之間的私人清單互不影響
- **數據存儲**：存儲在 `artifacts/{appId}/users/{userId}/checklist`

#### 👥 共享清單
- **團隊共享**：所有團隊成員都可以看到和編輯
- **實時同步**：任何用戶的更改會實時同步到所有人
- **數據存儲**：存儲在 `trips/{tripId}/sharedChecklist`

#### 功能特點
- ✅ **新增項目時選擇類型**：勾選「共享清單」checkbox
- ✅ **默認私人清單**：不勾選時自動創建為私人項目
- ✅ **分類顯示**：清單頁面清晰分為「共享清單」和「個人清單」兩個區塊
- ✅ **獨立管理**：每個類型的清單可獨立勾選、編輯、刪除
- ✅ **完成進度**：進度條統計所有清單（共享+個人）的完成狀態
- ✅ **視覺區分**：
  - 共享清單：紫色圖標（👥 Users）
  - 個人清單：藍色圖標（👤 User）

### 2. **天氣預報組件**

在主頁（Dashboard）新增了札幌 7 天天氣預報：

#### 顯示內容
- 📅 **日期**：今天、明天、具體日期（月/日 週X）
- 🌡️ **溫度**：當前溫度 + 最高/最低溫
- ☁️ **天氣狀況**：晴朗、多雲、下雪、下雨等（中文顯示）
- 🌤️ **天氣圖標**：emoji 表情（☀️ ❄️ ☁️ 🌧️）
- 💨 **額外資訊**（僅今天）：風速、濕度

#### UI 設計
- **水平滾動**：左右滑動查看 7 天預報
- **局部滾動**：只有天氣卡片區域可滾動，不影響整個頁面
- **今天高亮**：當天天氣卡片使用藍色高亮顯示
- **玻璃擬態**：延續整體設計風格
- **刷新按鈕**：可手動刷新天氣數據

#### 數據來源
- **API**: OpenWeatherMap API（可選）
- **Mock數據**：如果未配置 API key，自動使用模擬數據
- **地點**：札幌（Sapporo, JP）

## 📁 文件結構

### 新增文件

```
src/
├── components/
│   ├── common/
│   │   └── WeatherWidget.jsx          # 天氣預報組件
│   └── views/
│       └── ChecklistView.jsx          # 更新：支持共享/私人清單
├── services/
│   └── weatherService.js              # 天氣服務：API 調用與數據處理
└── App.jsx                            # 更新：清單數據管理
```

### 修改文件

```
src/
├── App.jsx
│   - 添加 sharedChecklist 數據獲取
│   - 分離 personal 和 shared checklist handlers
│   - 更新 ChecklistView props
│
├── components/views/Dashboard.jsx
│   - 導入 WeatherWidget
│   - 合併 personal 和 shared checklist 計算
│   - 顯示天氣預報組件
│
└── components/views/ChecklistView.jsx
    - 完全重寫，支持雙清單系統
    - 新增 isShared 切換選項
    - 分類顯示共享和私人清單
```

## 🔧 技術實現

### 清單數據流

```javascript
// App.jsx
const { data: personalChecklist } = useFirestoreCollection(
  user, 
  'checklist', 
  INITIAL_CHECKLIST
);

const { data: sharedChecklist } = useSharedCollection(
  'sharedChecklist', 
  []
);

// ChecklistView.jsx
const ChecklistView = ({ 
  personalChecklist, 
  sharedChecklist,
  onTogglePersonal, 
  onToggleShared,
  onAddPersonal, 
  onAddShared,
  // ...
});
```

### 天氣數據流

```javascript
// weatherService.js
export const getWeatherForecast = async () => {
  if (!import.meta.env.VITE_OPENWEATHER_API_KEY) {
    return getMockWeatherData(); // 使用模擬數據
  }
  
  const response = await fetch(
    `${BASE_URL}/forecast?q=Sapporo,JP&units=metric&appid=${API_KEY}`
  );
  // ...
};

// WeatherWidget.jsx
const WeatherWidget = () => {
  const [forecast, setForecast] = useState([]);
  
  useEffect(() => {
    fetchWeather();
  }, []);
  
  return (
    <div className="overflow-x-auto scrollbar-hide">
      {/* 水平滾動的天氣卡片 */}
    </div>
  );
};
```

## 🎨 UI/UX 改進

### 清單頁面
- **分類標題**：明確區分共享和個人清單
- **圖標識別**：
  - 👥 Users - 共享清單（紫色）
  - 👤 User - 個人清單（藍色）
- **空狀態**：每個分類的空狀態提示
- **進度統計**：統一的完成進度條

### 天氣組件
- **卡片式設計**：每天一個獨立卡片
- **今天高亮**：今天的卡片更寬，使用藍色主題
- **平滑滾動**：支持觸摸滑動和鼠標滾動
- **加載狀態**：顯示加載動畫
- **提示文字**：「向左滑動查看更多天氣 →」

## 🔐 數據安全

### Firestore 規則更新

需要在 Firebase Console 中更新以下規則：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 個人清單（user-specific）
    match /artifacts/{appId}/users/{userId}/checklist/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // 共享清單（team shared）
    match /trips/{tripId}/sharedChecklist/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🌐 環境變數配置

### 天氣 API（可選）

在 `.env` 文件中添加：

```bash
# OpenWeatherMap API (Optional)
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

**獲取 API Key：**
1. 前往 https://openweathermap.org/api
2. 註冊免費帳號
3. 在 API keys 頁面生成 key
4. 免費版本：60 calls/minute, 1,000,000 calls/month

**如果不配置：**
- 應用會自動使用模擬數據
- 功能完全正常，只是數據不是實時的

## 📱 使用指南

### 清單使用

#### 新增項目
1. 點擊「新增項目」按鈕
2. 輸入項目名稱和備註
3. **選擇類型**：勾選「共享清單」checkbox（不勾選=私人）
4. 點擊「新增」

#### 編輯項目
1. 點擊項目卡片
2. 修改名稱或備註
3. **注意**：無法更改已創建項目的類型（共享/私人）
4. 點擊「更新」

#### 勾選/刪除
- **勾選**：點擊左側 checkbox
- **刪除**：點擊右側垃圾桶圖標

### 天氣預報使用

#### 查看天氣
- 主頁自動顯示天氣預報
- 向左滑動查看未來 7 天

#### 刷新數據
- 點擊右上角刷新圖標
- 自動重新獲取最新天氣

## 🐛 已知限制

### 清單
- **類型鎖定**：項目創建後無法更改共享/私人屬性
  - 原因：避免數據在不同集合間移動的複雜性
  - 解決：如需更改，請刪除並重新創建

### 天氣
- **免費 API 限制**：
  - OpenWeatherMap 免費版只提供 5 天預報（每 3 小時一次）
  - 我們取每天中午的數據作為當天預報
  - 實際可能只有 5-6 天數據，不足 7 天會用最後一天補齊

- **模擬數據**：
  - 如果未配置 API key，顯示固定的模擬數據
  - 溫度範圍：-10°C 到 0°C（符合札幌冬季）
  - 天氣狀況：隨機但符合冬季特徵

## 🚀 部署注意事項

### Vercel 環境變數

如果使用實時天氣 API，需要在 Vercel 添加：

```
VITE_OPENWEATHER_API_KEY = your_api_key
```

**步驟：**
1. Vercel Dashboard → 你的項目
2. Settings → Environment Variables
3. 添加 `VITE_OPENWEATHER_API_KEY`
4. Value: 你的 OpenWeatherMap API key
5. Redeploy 項目

### Firestore 規則

記得在 Firebase Console 更新 Firestore 規則以支持共享清單。

## 📊 數據遷移

### 現有清單數據

如果你已經有個人清單數據：
- ✅ **不需要遷移**：現有數據自動成為個人清單
- ✅ **向下兼容**：舊數據格式完全支持
- ✅ **共享清單**：初始為空，用戶可自行創建

## 🎯 測試清單

請測試以下功能：

### 清單功能
- [ ] 新增個人清單項目（不勾選共享）
- [ ] 新增共享清單項目（勾選共享）
- [ ] 勾選個人清單項目
- [ ] 勾選共享清單項目
- [ ] 編輯個人清單項目
- [ ] 編輯共享清單項目
- [ ] 刪除個人清單項目
- [ ] 刪除共享清單項目
- [ ] 驗證進度條正確計算
- [ ] 多用戶同時查看共享清單（實時同步）

### 天氣功能
- [ ] 主頁顯示天氣預報
- [ ] 水平滾動查看 7 天天氣
- [ ] 今天的天氣卡片高亮顯示
- [ ] 點擊刷新按鈕更新數據
- [ ] 驗證 Mock 數據（無 API key 時）
- [ ] 驗證實時數據（有 API key 時）

---

## 📞 支持

如有問題，請檢查：
1. Firestore 規則是否正確配置
2. 天氣 API key 是否正確（如使用實時數據）
3. 瀏覽器 Console 是否有錯誤

最後更新：2024-12-19

