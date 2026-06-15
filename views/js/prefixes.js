// prefixes.js — หน้าจัดการ Prefix (OWNER เท่านั้น)

async function initPrefixesPage() {
  const grid = document.getElementById("prefixGrid");
  if (!grid) return;

  let data;
  try {
    const res = await fetch("/api/prefixes");
    if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
    data = await res.json();
  } catch (err) {
    grid.innerHTML = `<p class="prefix-error">${err.message}</p>`;
    return;
  }

  const list = data.prefixes || [];
  if (!list.length) {
    grid.innerHTML = `<p class="prefix-empty">ยังไม่มี prefix</p>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <div class="prefix-chip">
      <span class="prefix-text">${escapeHTML(p)}</span>
      <button class="prefix-del-btn" title="ลบ" onclick="submitDeletePrefix('${escapeHTML(p)}')">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
  `).join("");
}

function showPrefixStatus(msg, ok) {
  const el = document.getElementById("prefixAddStatus");
  if (!el) return;
  el.textContent = msg;
  el.className = "prefix-add-status " + (ok ? "success" : "error");
  if (ok) setTimeout(() => { if (el) el.textContent = ""; }, 3000);
}

async function submitAddPrefix() {
  const input = document.getElementById("newPrefixInput");
  const prefix = input.value.trim().toUpperCase();
  if (!prefix) {
    showPrefixStatus("กรุณากรอก prefix", false);
    return;
  }
  try {
    const res = await fetch("/api/add-prefix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefix }),
    });
    const result = await res.json();
    if (result.success) {
      input.value = "";
      showPrefixStatus("เพิ่ม prefix เรียบร้อย", true);
      initPrefixesPage();
    } else {
      showPrefixStatus(result.message || "เกิดข้อผิดพลาด", false);
    }
  } catch (err) {
    showPrefixStatus("เชื่อมต่อล้มเหลว", false);
  }
}

async function submitDeletePrefix(prefix) {
  if (!confirm(`ยืนยันลบ prefix "${prefix}" ?`)) return;
  try {
    const res = await fetch("/api/delete-prefix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefix }),
    });
    const result = await res.json();
    if (result.success) {
      initPrefixesPage();
    } else {
      showPrefixStatus(result.message || "เกิดข้อผิดพลาด", false);
    }
  } catch (err) {
    showPrefixStatus("เชื่อมต่อล้มเหลว", false);
  }
}

window.initPrefixesPage = initPrefixesPage;
window.submitAddPrefix = submitAddPrefix;
window.submitDeletePrefix = submitDeletePrefix;
