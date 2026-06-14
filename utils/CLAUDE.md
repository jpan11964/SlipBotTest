# utils/ — CLAUDE.md

## Function Reference

### settingsManager.js
```js
loadSettings()              // โหลดจาก MongoDB → cache
saveSettings(data)          // บันทึก + update cache
getCachedSettings()         // อ่าน cache (sync, ไม่ต้อง await)
reloadSettings()            // force reload จาก DB
```
ใช้ `getCachedSettings()` เมื่อต้องการค่าในระหว่าง request — เร็วกว่า query DB ทุกครั้ง

### slipResultManager.js
```js
loadSlipResults()                    // 24h, max 100, sort DESC
saveSlipResults(slipObj)             // บันทึกลง MongoDB
reportResultToAPI(baseURL, result)   // POST /api/slip-results → trigger SSE broadcast
removeOldSlips()                     // ลบ records เก่ากว่า 24h
```

### userQueueManager.js
```js
addToUserQueue(userId, taskFn)  // returns false ถ้า user busy (ignore งานใหม่)
finishUserTask(userId)          // เรียกใน finally block เสมอ
```
ป้องกัน concurrent slip processing ต่อ user — ใช้ในทุก image handler

### accountUtils.js
```js
getBankAccounts(prefix)         // ดึง active bank accounts ของ prefix
```

### bankCodeMapping.js
```js
getBankName(code)               // "014" → "ธนาคารไทยพาณิชย์"
```
mapping รหัสธนาคาร 3 หลัก → ชื่อภาษาไทย

### savePhoneNumber.js
```js
checkAndSavePhoneNumber(userId, phoneNumber, prefix)    // insert ถ้าไม่มี
checkAndUpdatePhoneNumber(userId, phoneNumber, prefix)  // upsert
```

### getLineProfile.js
```js
getLineProfile(userId, accessToken)  // → { displayName, pictureUrl }
```
เรียก LINE Profile API — ใช้ใน text bot เพื่อ log ชื่อผู้ใช้

### qrData.js
```js
parseQrData(qrString)   // แยก payload จาก QR string ของสลิป
```

### qrSlipworker.js
```js
// จัดการ QR slip workflow ใน text context
// เรียกจาก handlers/textBot/textUtils/qrSlipworker.js
```

## Gotchas

- `broadcastLog()` import จาก `"../index.js"` — circular dependency ที่ตั้งใจ (ES Module จัดการได้)
- `settingsManager` cache อยู่ใน module scope — reload เมื่อ settings เปลี่ยนใน `/api/settings` POST
