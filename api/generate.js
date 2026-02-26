const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.json();

    // Googleからエラーが返ってきた場合の処理
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    // 正常な返答をそのままフロントエンドに送る
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
