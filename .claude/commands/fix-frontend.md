# Frontend Fix / Add UI

## กฎที่ต้องทำตามเสมอ

1. **ห้ามใช้ emoji** ในทุกไฟล์ — ใช้ Bootstrap Icons แทน: `<i class="bi bi-{name}"></i>`
2. **ใช้ CSS variables เท่านั้น** — ดูรายการใน `views/css/shared.css` หรือ `views/CLAUDE.md`
3. **Font** — Noto Sans Thai + Inter (มี CDN ใน index.html อยู่แล้ว ไม่ต้องเพิ่มซ้ำ)
4. **สีพื้นหลัง input/textarea** — ใช้ `var(--white)` ไม่ใช่ `#f8fafc`
5. **Layout** — ทุก page-level element ต้องมี `left: var(--sidebar-width)` (260px)

## ขั้นตอน

1. อ่าน `views/CLAUDE.md` ก่อนเสมอ
2. แก้เฉพาะ CSS ที่เกี่ยวข้อง ห้ามแตะ `shared.css` โดยไม่จำเป็น
3. ถ้าเพิ่ม element ใหม่ → ใช้ class ที่มีอยู่แล้วถ้าทำได้ก่อนสร้างใหม่

## ไฟล์ที่เกี่ยวข้อง

- `views/css/shared.css` — CSS variables ทั้งหมด
- `views/css/main.css` — shop cards, modals, buttons
- `views/js/main.js` — shop UI functions
