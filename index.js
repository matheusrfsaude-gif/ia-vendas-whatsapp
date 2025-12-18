import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const { mensagem } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Você é um vendedor especialista em planos de saúde e odontológicos. Seja claro, humano, objetivo e conduza para o fechamento."
        },
        {
          role: "user",
          content: mensagem
        }
      ]
    })
  });

  const data = await response.json();
  res.json({ resposta: data.choices[0].message.content });
});

app.listen(3000, () => {
  console.log("IA rodando na porta 3000");
});
