export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // 1. キーが読み込めているかチェック
  if (!apiKey) {
    return res.status(500).json({ error: { message: "Vercelの環境変数 GEMINI_API_KEY が空です。Settingsを確認してください。" } });
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    
    // 2. Googleからのエラーをそのままクライアントに返す
    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: { message: "通信失敗: " + e.message } });
  }
}
