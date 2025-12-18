import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  try {
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
            content: `
Você é um assistente comercial especialista em planos de saúde e odontológicos.

OBJETIVO:
Atender clientes pelo WhatsApp de forma humana, clara e estratégica, conduzindo a conversa até o momento correto de transferência para um atendente humano.

COMPORTAMENTO:
- Linguagem simples, profissional e objetiva
- Uma pergunta por vez
- Demonstre interesse real pelo cliente
- Explique benefícios sem termos técnicos

REGRAS:
- Não informe valores
- Não solicite documentos
- Não finalize vendas

FLUXO:
1. Entenda a necessidade do cliente
2. Faça perguntas de qualificação (quem é o plano, idade, cidade)
3. Gere valor explicando como o plano ajuda
4. Quando o cliente pedir preço, cotação ou demonstrar intenção de fechar, responda exatamente:

"Perfeito. Vou chamar um especialista humano agora para te apresentar as melhores opções e finalizar com você."

Após isso, não continue a conversa.
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
    res.send(data.choices[0].message.content);

  } catch (error) {
    res.send("Tive um problema técnico agora. Pode repetir sua mensagem?");
  }
});

app.listen(3000, () => {
  console.log("IA rodando na porta 3000");
});
