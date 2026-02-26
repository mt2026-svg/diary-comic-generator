export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ text: "エラー：APIキーが設定されていません" });

  try {
    // URLを v1beta から v1 に変更し、確実に動く形式に修正
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();

    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      // エラーの詳細を表示するように変更
      res.status(500).json({ text: "エラーが発生しました: " + (data.error ? data.error.message : "不明なエラー") });
    }
  } catch (e) {
    res.status(500).json({ text: "通信エラー：" + e.message });
  }
}
