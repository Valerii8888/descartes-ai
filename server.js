require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/analyze', async (req, res) => {
  const { q1, q2, q3, q4 } = req.body;

  const prompt = `
Ты — умный помощник по принятию решений. На основе метода "Квадрат Декарта" сделай вывод и порекомендуй одно из трёх: "Действовать", "Подумать", "Воздержаться". Аргументируй кратко.
Ответы пользователя:
1. ${q1}
2. ${q2}
3. ${q3}
4. ${q4}

Вывод:
`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const result = completion.data.choices[0].message.content.trim();
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: "Ошибка анализа. Попробуйте позже." });
  }
});

app.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});