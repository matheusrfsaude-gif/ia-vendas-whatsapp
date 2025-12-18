import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem) {
      return res.json({
        message: "Não recebi a mensagem. Pode repetir, por favor?"
      });
    }

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
            content: `
Você é um assistente comercial especialista em planos de saúde e odontológicos.

REGRAS:
- Linguagem humana, simples e objetiva
- Uma pergunta por vez
- Não informe valores
- Não solicite documentos
- Não finalize vendas

FLUXO:
1. Entenda a necessidade do cliente
2. Faça perguntas de qualificação (quem é o plano, idade, cidade)
3. Gere valor explicando benefícios
4. Quando o cliente pedir preço ou demonstrar intenção de fechar, responda exatamente:
"Perfeito. Vou chamar um especialista humano agora para te apresentar as melhores opções."
Após isso, encerre a conversa.
`
          },
          {
            role: "user",
            content: mensagem
          }
        ]
      })
    });

    const data = await response.json();

    return res.json({
      message: data.choices[0].message.content
    });

  } catch (error) {
    return res.json({
      message: "Tive um problema técnico agora. Pode repetir sua mensagem?"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("IA rodando na porta", PORT);
});
