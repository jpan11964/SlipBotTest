# เพิ่มฟีเจอร์ใหม่ให้ Shop

## ข้อมูลที่ต้องการก่อนเริ่ม

กรุณาระบุ:
- ชื่อฟีเจอร์และทำงานอย่างไร
- ต้องการ toggle (on/off) ไหม
- ต้องการ data เพิ่มใน schema ไหม (string/boolean/image)
- แสดงผลใน UI ส่วนไหนของ shop card

## Checklist

### Backend
- [ ] เพิ่ม field ใน `models/Shop.js`
- [ ] เพิ่ม API endpoint ใน `index.js` (ดู pattern ใน `add-api-route.md`)
- [ ] อัปเดต Route Map comment ใน `index.js`

### Frontend
- [ ] เพิ่ม HTML ใน `generateShopHTML(shop)` ใน `views/js/main.js`
- [ ] เพิ่ม JavaScript function ใน `views/js/main.js`
- [ ] เพิ่ม CSS ในไฟล์ที่เหมาะสมใน `views/css/`
- [ ] ใช้ CSS variables เท่านั้น — ห้าม hardcode สี
- [ ] ห้ามใช้ emoji — ใช้ Bootstrap Icons

### Toggle Pattern (ถ้าต้องการ toggle)
```js
// Schema
statusFeatureName: Boolean,

// API
app.post('/api/update-featureName-status', async (req, res) => { ... })

// HTML (ใน generateShopHTML)
`<input type="checkbox" ${shop.statusFeatureName ? "checked" : ""}
    onchange="updateFeatureNameStatus('${prefix}', this.checked, this)">`

// JS
async function updateFeatureNameStatus(prefix, newStatus, checkbox) {
  const response = await fetch("/api/update-featureName-status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prefix, statusFeatureName: newStatus })
  });
  const result = await response.json();
  if (!result.success && checkbox) checkbox.checked = !newStatus;
}
```

## ไฟล์ที่ต้องแก้

| ไฟล์ | สิ่งที่ต้องเพิ่ม |
|------|--------------|
| `models/Shop.js` | field ใน ShopSchema |
| `index.js` | API route(s) |
| `views/js/main.js` | HTML template + JS functions |
| `views/css/main.css` หรือไฟล์ใหม่ | styles |
| `CLAUDE.md` | อัปเดต Schema + API sections |
