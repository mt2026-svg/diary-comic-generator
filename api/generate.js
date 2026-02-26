export default async function handler(req, res) {
  // 1. キーがあるかチェック
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ text: "エラー：VercelにAPIキーが設定されていません。Settingsを確認してください。" });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();

    // 2. Geminiからの返答をチェック
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      res.status(200).json({ text: data.candidates[0].content.parts[0].text });
    } else {
      res.status(500).json({ text: "エラー：Geminiから返答が届きませんでした。" + JSON.stringify(data) });
    }
  } catch (e) {
    res.status(500).json({ text: "エラーが発生しました：" + e.message });
  }
}
