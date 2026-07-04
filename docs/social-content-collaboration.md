# 雙引擎社群內容協作規範

這份規範是相信閱讀 Facebook／Instagram 的共同作業標準。Claude 與 Codex 排程前都必須先讀。

## 唯一內容台帳

Sanity `socialPost` 是唯一內容日曆與主題台帳。

- 新規劃、待確認、已排程、已發佈、失敗與暫停內容都留在 Sanity
- 不另建只有單一引擎看得到的正式排程清單
- 不用 Meta Business Suite／FB 原生排程建立新的常態貼文
- Business Suite 只用於檢查、緊急人工處理或老闆明確指定的例外
- 2026-07-07 前既有的 FB 原生排程屬舊制過渡，查重時仍要檢查 `fb-repost-queue.md` 與 Meta Planner

## 固定分工

| 負責引擎 | 發文日 | Sanity `owner` |
|---|---|---|
| Claude | 週一、週三、週五、週日 | `claude` |
| Codex | 週二、週四、週六 | `codex` |

Codex 目前固定時段為台北時間 07:00、19:00。Claude 使用老闆核准的時段；兩邊不得自行占用對方日期。

分不同日期只解決時間衝突，不代表主題不會重複。所有內容仍須走下列查重流程。

## 標準流程

1. 執行 `npm run social:audit -- --check "候選主題"`。
2. 同時檢查 `topic`、`series`、`contentAngle`，不能只比標題文字。
3. 確認沒有撞題後，先在 Sanity 建立 `status=draft` 的主題預約。
4. 填入 `topic`、`series`、`contentAngle`、`owner`、平台與預計時間，並按 Sanity 的 Publish，讓它成為可公開查詢的文件；欄位狀態仍維持 `status=draft`。
5. 製作文案與配圖，交給老闆確認。
6. 老闆核准後補齊文案與公開圖片網址，再把狀態改為 `scheduled`。
7. 發佈後保留 `published` 紀錄，不刪除，作為長期去重依據。

`draft` 不會被 `/api/social/publish-due` 選中；排程器只處理到期的 `scheduled` 或可重試的 `failed`。

注意：`npm run social:audit` 目前使用無 token 公開讀取，抓不到 Sanity 尚未 Publish、ID 為 `drafts.*` 的 Studio 私有草稿。用來佔題的文件必須先按 Publish，並以欄位 `status=draft` 保持不發佈狀態。

## 撞題判定

以下任一情況成立，就先視為可能重複：

- `topic` 相同或只是換同義詞
- 核心問題相同，例如都在解釋「碳中和與淨零的差別」
- 結論與讀者收穫相同，只換標題或圖片
- 與近期待發內容競爭同一個資訊需求
- 網站文章剛發佈，社群又使用幾乎相同的摘要，但沒有新的平台切角

同一系列可以重複，但每則 `contentAngle` 必須明確不同。若無法用一句話說清楚新切角，就換題。

## 例外與衝突

- 兩邊同時選到同一題時，以 Sanity 最早建立的 `draft` 為優先。
- 後建立的一方改題，不用覆蓋或刪除另一方內容。
- 若要刻意延伸已發布主題，需在 `contentAngle` 說明新增價值，並先交老闆確認。
- 任何立即發佈、取消排程或修改 `scheduled` 的動作，都必須先取得老闆同意。

## 每次交接格式

```text
主題：
系列：
內容切角：
負責引擎：claude / codex
預計時間：
平台：facebook / instagram / both
Sanity 狀態：draft / scheduled / published
查重結果：已查 Sanity socialPost、網站文章、FB 舊佇列、戰情記錄、本機草稿
```

## 給隔壁的固定說法

相信閱讀的 FB／IG 內容改用 Sanity `socialPost` 作唯一台帳。排題前先執行 `npm run social:audit -- --check "候選主題"`；確認不撞題後，建立 `status=draft` 並按 Sanity Publish 完成佔題，老闆核准圖文才改 `scheduled`。Claude 負責週一三五日，Codex 負責週二四六，兩邊都不得再另外建立常態 Business Suite 排程。
