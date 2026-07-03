# 社群雲端排程說明

這套流程負責把 Facebook / Instagram 發文改成「雲端排程，不靠本機開機」。

## 架構

1. 貼文內容建在 Sanity Studio 的 `社群排程貼文（socialPost）`
2. 圖片使用 Cloudinary 公開連結；一張是單圖，多張自動走輪播
3. GitHub Actions 每 5 分鐘喚醒一次 `/api/social/publish-due`，每次預設只處理 1 則，降低輪播逾時風險
4. API route 檢查到點貼文，直接呼叫 Meta Graph API 發 FB / IG
5. 發完後回寫 Sanity 狀態、貼文 ID、錯誤訊息

## Sanity 欄位

- `title`：內部辨識標題
- `caption`：共用貼文文案
- `images`：圖片網址清單；一張是單圖，多張是輪播，最多 10 張
- `imageUrl`：舊版單張圖片欄位，保留相容
- `link`：延伸連結
- `platforms`：`facebook`、`instagram` 或兩者一起
- `scheduledAt`：排程時間
- `status`：`scheduled`、`paused`、`processing`、`published`、`failed`

## 必要環境變數

放在 Vercel 專案環境變數：

- `SANITY_API_TOKEN`
- `SOCIAL_PUBLISH_SECRET`
- `FB_PAGE_ID`
- `FB_PAGE_ACCESS_TOKEN`
- `INSTAGRAM_BUSINESS_ACCOUNT_ID`
- `INSTAGRAM_ACCESS_TOKEN`（如果 IG 要用獨立 token；未填時會退回使用 `FB_PAGE_ACCESS_TOKEN`）
- `META_APP_ID`
- `META_APP_SECRET`
- `TOKEN_ALERT_EMAIL`（選填，Meta token 快過期時寄信通知）
- `META_GRAPH_API_VERSION`（選填，預設 `v25.0`）

放在 GitHub repository secrets：

- `SOCIAL_PUBLISH_ENDPOINT`
  - 例如：`https://www.focus-esg.com/api/social/publish-due`
- `SOCIAL_TOKEN_CHECK_ENDPOINT`
  - 例如：`https://www.focus-esg.com/api/social/token-check`
- `SOCIAL_PUBLISH_SECRET`
  - 要跟 Vercel 的 `SOCIAL_PUBLISH_SECRET` 相同

## 新增一篇排程貼文

1. 進 Sanity Studio
2. 建立 `IG 排程貼文`、`FB 排程貼文` 或 `FB + IG 排程貼文`
3. 填入文案、圖片清單、平台、排程時間
4. `status` 保持 `scheduled`
5. 在 Sanity 右上角按 Publish

## 手動測試

可手動打 API：

```bash
curl -X POST \
  -H "Authorization: Bearer $SOCIAL_PUBLISH_SECRET" \
  -H "Content-Type: application/json" \
  --data '{"limit":1}' \
  https://www.focus-esg.com/api/social/publish-due
```

或在 GitHub Actions 裡手動執行 `Publish scheduled social posts` workflow。

## Token 到期提醒

`Check Meta token expiry` workflow 每週一上午 9:11（台灣時間）呼叫 `/api/social/token-check`。

需要 Vercel 環境變數：

- `META_APP_ID`
- `META_APP_SECRET`
- `FB_PAGE_ACCESS_TOKEN`
- `SMTP_HOST` 等寄信設定

如果 token 已失效，或剩餘天數小於 `META_TOKEN_ALERT_DAYS`（預設 7 天），系統會寄信提醒。

## 失敗重送

如果狀態變成 `failed`：

1. 先看 `errorMessage`
2. 修正圖片、token 或權限問題
3. 把 `status` 改回 `scheduled`
4. 已成功的平台會保留 ID，不會重複發；只會補發尚未成功的平台

## 跟隔壁交接用的話術

之後相信閱讀的 IG / FB 發文一律走 `believe-in-reading` repo 這套雲端排程：

1. 貼文內容建在 Sanity 的 `socialPost`
2. 圖片用 Cloudinary 公開連結
3. GitHub Actions 只負責定時喚醒 `/api/social/publish-due`
4. 真正發文、回寫狀態、錯誤紀錄都在 repo 內的 social publisher 流程
5. 不再依賴本機開機排程，也不要改回瀏覽器自動化，除非老闆另外指定

先讀這份文件，再依既有流程執行。
