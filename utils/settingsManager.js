import Setting from "../models/Setting.js";

let cachedSetting = null;

const DEFAULT_SETTINGS = {
  timeLimit: 15,
  sameQrTimeLimit: 24,
  maxMessagesPerUser: 10,
}

export async function loadSettings() {
  try {
    let setting = await Setting.findOne({ key: "global-settings" });
    if (!setting) {
      // DB เปล่า (dev/fresh install) → สร้าง default settings อัตโนมัติ
      setting = await Setting.create({ key: "global-settings", value: DEFAULT_SETTINGS })
      console.log("ℹ️  ไม่พบ Settings — สร้าง default settings แล้ว")
    }
    cachedSetting = setting.value;
    return setting.value;
  } catch (err) {
    console.error("❌ โหลด settings ไม่สำเร็จ:", err.message);
    return {};
  }
}

export async function saveSettings(data) {
  try {
    await Setting.findOneAndUpdate(
      { key: "global-settings" },
      { $set: { value: data } },
      { upsert: true }
    );
    cachedSetting = data;
  } catch (err) {
    console.error("❌ บันทึก settings ไม่สำเร็จ:", err.message);
    throw err;
  }
}

export function getCachedSettings() {
  return cachedSetting || {};
}

export async function reloadSettings() {
  await loadSettings(); // ต้องใช้ await เพื่อ update ค่าให้ทัน
}
