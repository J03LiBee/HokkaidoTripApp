# MeteoSource Weather API 設定指南

## 🌤️ 為什麼選擇 MeteoSource？

### 優勢
- ✅ **完全免費**：無需信用卡
- ✅ **每日 400 次調用**：足夠個人使用
- ✅ **7 天預報**：涵蓋整個旅程
- ✅ **高精度數據**：專業氣象服務
- ✅ **簡單易用**：清晰的 API 文檔

### 對比 OpenWeatherMap
| 功能 | MeteoSource | OpenWeatherMap |
|------|-------------|----------------|
| 免費額度 | 400 calls/day | 60 calls/min, 1M/month |
| 需要信用卡 | ❌ 不需要 | ✅ 需要 |
| 7 天預報 | ✅ 免費 | ✅ 免費 |
| 註冊難度 | 簡單 | 需要驗證 |

## 📝 註冊步驟

### 1. 前往 MeteoSource 官網

訪問：https://www.meteosource.com/client/sign-up

### 2. 創建免費帳號

填寫資訊：
- Email
- Password
- 不需要信用卡！

### 3. 獲取 API Key

登入後：
1. 前往 Dashboard
2. 找到 "API Key" 或 "Your API Keys"
3. 複製你的 API key（類似：`abc123def456...`）

### 4. 配置到應用程式

#### 本地開發

在項目根目錄創建 `.env` 文件（如果還沒有）：

```bash
# 複製 .env.example
cp .env.example .env
```

編輯 `.env`，添加你的 API key：

```bash
VITE_METEOSOURCE_API_KEY=你的_api_key_這裡
```

#### Vercel 部署

1. 前往 Vercel Dashboard
2. 選擇你的項目
3. Settings → Environment Variables
4. 添加新變數：
   - Name: `VITE_METEOSOURCE_API_KEY`
   - Value: 你的 API key
5. 重新部署

## 🧪 測試

### 檢查是否正常工作

#### 方法 1：查看溫度
- ❌ **顯示 99°C** → API 未配置或失敗
- ✅ **顯示正常溫度**（例如 -5°C）→ API 正常工作

#### 方法 2：查看描述
- ❌ "DEMO DATA - API not configured"
- ✅ 正常天氣描述（例如 "snow"）

#### 方法 3：瀏覽器 Console
打開開發者工具（F12）→ Console：
- ❌ 看到警告：`No MeteoSource API key found`
- ✅ 無警告訊息

## 📊 API 使用說明

### 請求限制
- **免費版**：400 calls/day
- **重置時間**：每日 UTC 00:00

### 我們的使用量
- 每次刷新頁面：1 次 API 調用
- 點擊刷新按鈕：1 次 API 調用
- **估計**：正常使用約 10-20 calls/day

**結論：400 calls/day 綽綽有餘！** ✅

## 🌡️ Demo 溫度指示器（99°C）

### 為什麼使用 99°C？

當 API key 未配置或 API 調用失敗時，顯示 **99°C** 作為明顯的指示器：

```
❌ API 未配置
今天: 99°C
明天: 99°C
↓
一眼就知道是 Demo 數據！
```

### 正常溫度範圍

札幌冬季（12月-1月）：
- 平均：-3°C 到 0°C
- 最低：-10°C 到 -5°C
- 最高：-1°C 到 2°C

**如果看到 99°C，立即知道 API 有問題！** 🔥

## 🔧 故障排除

### 問題 1：顯示 99°C

**原因：**
- 沒有設定 API key
- API key 錯誤
- API 調用失敗

**解決：**
1. 檢查 `.env` 文件是否存在
2. 檢查 API key 是否正確複製（無空格）
3. 重啟開發伺服器：`npm run dev`
4. 檢查 Console 是否有錯誤訊息

### 問題 2：API key 無效

**症狀：**
- Console 顯示 `API returned 401` 或 `403`

**解決：**
1. 重新登入 MeteoSource
2. 確認 API key 是否正確
3. 確認 API key 是否已啟用
4. 嘗試生成新的 API key

### 問題 3：超過調用限制

**症狀：**
- Console 顯示 `API returned 429`
- 錯誤訊息：`Rate limit exceeded`

**解決：**
- 等待至隔天 UTC 00:00 重置
- 或升級至付費方案

### 問題 4：環境變數未載入

**解決（Vite）：**
1. 環境變數必須以 `VITE_` 開頭
2. 修改 `.env` 後必須重啟伺服器
3. 檢查 `import.meta.env.VITE_METEOSOURCE_API_KEY` 是否有值

## 📋 API 響應格式

### MeteoSource 返回結構

```json
{
  "daily": {
    "data": [
      {
        "day": "2025-12-31",
        "weather": "mostly_clear",
        "all_day": {
          "temperature": -3.5,
          "temperature_min": -8.2,
          "temperature_max": 0.1,
          "humidity": 75,
          "wind": {
            "speed": 12.5
          }
        }
      }
    ]
  }
}
```

### 我們的處理

```javascript
{
  date: "2025-12-31",
  temp: -3,              // 四捨五入
  temp_min: -8,
  temp_max: 0,
  condition: "Clear",     // 轉換成統一格式
  description: "mostly_clear",
  humidity: 75,
  windSpeed: 13          // km/h
}
```

## 🎨 UI 顯示邏輯

```javascript
// Mock 數據（99°C）
今天: 99°
-8° / 0°  →  99° / 99°

// 真實數據
今天: -3°
-8° / 0°  →  正常範圍
```

## 🔗 有用的連結

- 官網：https://www.meteosource.com/
- 註冊：https://www.meteosource.com/client/sign-up
- API 文檔：https://www.meteosource.com/documentation
- Dashboard：https://www.meteosource.com/client/dashboard

## 💡 最佳實踐

### 開發環境
1. 使用 `.env.local`（不提交到 Git）
2. 定期檢查 API 使用量
3. 開發時可以不配置（使用 99°C mock 數據）

### 生產環境
1. 在 Vercel 設定環境變數
2. 監控 API 調用次數
3. 考慮添加緩存機制（如果調用頻繁）

## ⚠️ 注意事項

1. **不要提交 `.env` 到 Git**
   - 已包含在 `.gitignore`
   - API key 是私密資訊

2. **API key 外洩處理**
   - 立即在 Dashboard 刪除舊 key
   - 生成新的 key
   - 更新所有部署環境

3. **配額管理**
   - 免費版每日 400 次調用
   - 建議添加緩存（可選）
   - 監控使用量

---

最後更新：2024-12-19

