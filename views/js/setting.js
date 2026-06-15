(function() {
    const DEFAULT_SETTINGS = {
      timeLimit: 3,          // นาที (แสดงผล) — 3 นาที = 180000 ms
      sameQrTimeLimit: 60,   // นาที (แสดงผล) — 60 นาที = 3600000 ms
      maxMessagesPerUser: 3,
      maxMessagesSamePerUser: 2,
      maxProcessingPerUser: 2
    };
  
    // โหลดค่าจาก backend และแปลง ms → s เพื่อแสดง
    async function loadSettings() {
        try {
          const response = await fetch('/api/settings');
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
          const settings = await response.json();

          // ถ้าผู้ใช้เปลี่ยนไปหน้าอื่นแล้ว (input หายไป) ให้ออกเงียบๆ ไม่ขึ้น error
          const el = (id) => document.getElementById(id);
          if (!el('timeLimit')) return;

          el('timeLimit').value = settings.timeLimit;
          el('sameQrTimeLimit').value = settings.sameQrTimeLimit;
          el('maxMessagesPerUser').value = settings.maxMessagesPerUser;
          el('maxMessagesSamePerUser').value = settings.maxMessagesSamePerUser;
          el('maxProcessingPerUser').value = settings.maxProcessingPerUser;

        } catch (error) {
          console.error('Error loading settings:', error);
          alert('ไม่สามารถโหลดการตั้งค่าได้: ' + error.message);
        }
      }
  
    // บันทึกค่าจาก form โดยแปลง s → ms ก่อนส่ง
    async function saveSettings() {
      try {
        const saveBtn = document.querySelector('.save-btn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'กำลังบันทึก...';
  
        const settings = {
          timeLimit: parseFloat(document.getElementById('timeLimit').value) * 60000,          // นาที → ms (ทศนิยมได้)
          sameQrTimeLimit: parseFloat(document.getElementById('sameQrTimeLimit').value) * 60000, // นาที → ms (ทศนิยมได้)
          maxMessagesPerUser: parseInt(document.getElementById('maxMessagesPerUser').value),
          maxMessagesSamePerUser: parseInt(document.getElementById('maxMessagesSamePerUser').value),
          maxProcessingPerUser: parseInt(document.getElementById('maxProcessingPerUser').value)
        };
  
        for (const [key, value] of Object.entries(settings)) {
          if (isNaN(value) || value < 0) {
            throw new Error(`ค่า ${key} ไม่ถูกต้อง`);
          }
        }
  
        const response = await fetch('/api/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(settings)
        });
  
        const result = await response.json();
        if (result.success) {
          alert('บันทึกการตั้งค่าเรียบร้อย');
        } else {
          throw new Error(result.error || 'ไม่สามารถบันทึกการตั้งค่าได้');
        }
  
      } catch (error) {
        console.error('Save error:', error);
        alert('เกิดข้อผิดพลาดในการบันทึก: ' + error.message);
      } finally {
        const saveBtn = document.querySelector('.save-btn');
        saveBtn.disabled = false;
        saveBtn.textContent = 'บันทึกการตั้งค่า';
      }
    }
  
    // คืนค่าเริ่มต้น (เฉพาะ s) และส่งไป backend แปลงเป็น ms ฝั่ง server
    async function resetSettings() {
      if (confirm('ต้องการคืนค่าเริ่มต้นทั้งหมด?')) {
        try {
          const response = await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              timeLimit: DEFAULT_SETTINGS.timeLimit * 60000,          // นาที → ms
              sameQrTimeLimit: DEFAULT_SETTINGS.sameQrTimeLimit * 60000, // นาที → ms
              maxMessagesPerUser: DEFAULT_SETTINGS.maxMessagesPerUser,
              maxMessagesSamePerUser: DEFAULT_SETTINGS.maxMessagesSamePerUser,
              maxProcessingPerUser: DEFAULT_SETTINGS.maxProcessingPerUser
            })
          });
  
          const result = await response.json();
          if (result.success) {
            Object.keys(DEFAULT_SETTINGS).forEach(key => {
              document.getElementById(key).value = DEFAULT_SETTINGS[key];
            });
            alert('คืนค่าเริ่มต้นเรียบร้อย');
          } else {
            throw new Error(result.error || 'ไม่สามารถคืนค่าเริ่มต้นได้');
          }
  
        } catch (error) {
          console.error('Reset error:', error);
          alert('เกิดข้อผิดพลาดในการคืนค่าเริ่มต้น: ' + error.message);
        }
      }
    }
  
    // 🔁 Export ฟังก์ชัน global (ปุ่ม onclick + finalize ใน index.html ใช้)
    window.resetSettings = resetSettings;
    window.loadSettings = loadSettings;
    window.saveSettings = saveSettings;

    // หมายเหตุ: การโหลดค่าเริ่มต้นถูกเรียกผ่าน finalize() ใน index.html ทุกครั้งที่เข้าหน้านี้
    // (สคริปต์โหลดครั้งเดียวแบบ SPA — จึงไม่ auto-load ที่นี่ เพื่อให้กลับมาหน้าเดิมแล้วโหลดค่าใหม่)
  })();
  