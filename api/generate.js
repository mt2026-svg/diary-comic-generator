export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ text: "エラー：APIキーが未設定です" });

  try {
    // モデル名を gemini-1.5-flash から gemini-pro に変更（確実性を優先）
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ text: "Google APIエラー: " + data.error.message });
    }

    if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ text: "エラー：解析可能なデータが届きませんでした。" + JSON.stringify(data) });
    }
  } catch (e) {
    res.status(500).json({ text: "通信失敗：" + e.message });
  }
}
