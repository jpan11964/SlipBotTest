# models/ — CLAUDE.md

## Schema Overview

ทุก model ใช้ Mongoose + ES Modules (`export default mongoose.model(...)`)

## Shop.js — หลัก

```js
{
  name: String,
  prefix: String,           // "ABC" — key สำคัญ ใช้ตลอด
  lines: [{                 // LINE OA accounts
    linename: String,
    channel_id: String,
    access_token: String,
    secret_token: String,
    main: Boolean,
  }],
  bonusImage: {
    image1: { data: Buffer, contentType: String },
    image2: { data: Buffer, contentType: String },
  },
  passwordImage: { data: Buffer, contentType: String },
  status: Boolean,          // shop เปิด/ปิด
  statusBot: Boolean,       // text bot เปิด/ปิด
  statusWithdraw: Boolean,
  statusBonusTime: Boolean, // ต้องมีรูปใน bonusImage ก่อนจึงจะ enable ได้
  statusPassword: Boolean,
  slipCheckOption: String,  // "duplicate" หรืออื่นๆ
  registerlink: String,
  loginlink: String,
}
```

> **Gotcha:** `bonusImage` เก็บ 2 รูป (image1/image2) — ไม่ใช่ single `data` อีกต่อไป
> เมื่อ query `shop.bonusImage?.image1?.data` ไม่ใช่ `shop.bonusImage?.data`

## BankAccount.js

```js
{ prefix: String, bankName: String, accountNumber: String, accountName: String, active: Boolean }
```
Group by prefix — 1 prefix มีได้หลาย bank accounts

## Phone.js

```js
{ userId: String, phoneNumber: String, prefix: String }
```
Maps LINE userId ↔ phone ↔ prefix

## Prefix.js

```js
{ prefix: String }
```
Registry ของ prefix ที่ valid — ต้องมีก่อนจึงจะสร้าง Shop ได้

## SlipResult.js

```js
{ prefix, amount, bank, accountNumber, transactionId, timestamp, status, createdAt }
```
- เก็บไว้ 24h, max 100 รายการ
- `createdAt` มี TTL index (auto-delete)

## Temp.js

```js
{ username: String, password: String, role: String }
```
roles: `"OWNER"` | `"ADMIN"` | `"MARKETING"`

## QrEntry.js

```js
{ qrId: String, prefix: String, createdAt: Date }
```
dedup QR code — ป้องกันสลิปซ้ำ

## Setting.js

```js
{ key: "global-settings", value: { timeLimit, sameQrTimeLimit, maxMessagesPerUser, ... } }
```
load/save ผ่าน `utils/settingsManager.js` เท่านั้น — ไม่ query โดยตรง

## lineSendingImage.js

```js
{ sessionId: String, data: Buffer, contentType: String, createdAt: Date }
```
temp storage สำหรับรูปที่ admin จะส่งผ่าน LINE — ลบเมื่อ session end
