// pages/api/og-image.js
export default function handler(req, res) {
  const html = `
    <div style="
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 60px;
      font-family: Arial, sans-serif;
      color: white;
    ">
      <div style="font-size: 72px; font-weight: bold; margin-bottom: 30px; text-align: center;">
        MeetAnEscort
      </div>
      <div style="font-size: 36px; text-align: center; margin-bottom: 40px;">
        Safety Resources for Sex Workers
      </div>
      <div style="font-size: 28px; text-align: center; opacity: 0.9;">
        Empowering Through Education & Community
      </div>
      <div style="margin-top: 50px; font-size: 48px;">
        🛡️ 🔒 💜
      </div>
    </div>
  `;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
}
