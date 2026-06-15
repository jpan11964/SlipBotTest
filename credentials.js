import Credentials from "./models/Temp.js";

export async function loadCredentialsFromDB() {
  try {
    const data = await Credentials.findOne();
    if (!data) throw new Error("ไม่พบข้อมูล credentials");

    const owner = data.OWNER[0] || { username: "", password: "" };

    const admins = Array.isArray(data.ADMIN) ? data.ADMIN : [];

    const users = Array.isArray(data.USER) ? data.USER : [];

    return { owner, admins, users };
  } catch (err) {
    console.error("❌ โหลด credentials ล้มเหลว:", err);
    return {
      owner: { username: "", password: "" },
      admins: [],
      users: []
    };
  }
}