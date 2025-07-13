const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const aiResponse = document.getElementById("aiResponse");
const form = document.getElementById("form");

const markdownToHTML = (text) => {
  const converter = new showdown.Converter();
  return converter.makeHtml(text);
};

//
const askAI = async (question, game, apiKey) => {
  const model = "gemini-2.5-flash";
  const baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const perguntaLol = `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo ${game}.
  ## Tarefa
  Você deve responder a pergunta do usuário sobre o jogo ${game} com base no seu conhecimento de jogo, estratégias, build e dicas.
  ## Regras
  - Responder em portugues
  - Se você não souber a resposta, responda "Desculpe, não sei a resposta para isso." e não tente inventar uma resposta.
  - Se a perguntar não está relacionado ao jogo, responda "Desculpe, essa pergunta não está relacionada ao jogo ${game}.".
  - Considere a data atual ${new Date().toLocaleDateString()}
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente
  - Nunca responda itens que você não tenha certeza, sempre busque informações atualizadas
  ## Resposta
  - Economize a resposta, seja claro e direta e reponda no máximo 500 caracteres
  - Responda em markdown
  - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário perguntou
  ## Exemplo de resposta
  pergunta do usuário: Melhor build para o campeão Yone?
  resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui \n\n **Runas:**\n\n coloque as runas aqui \n\n **Feitiços:**\n\n coloque os feitiços aqui \n\n **Dicas:**\n\n coloque as dicas aqui

  ---
  Aqui está a pergunta do usuário:
  ${question}
  `;

  const perguntaValorant = `
  ## Especialidade
  Você é um especialista assistente de meta para o jogo Valorant.

  ## Tarefa
  Você deve responder a pergunta do usuário sobre o jogo Valorant com base no seu conhecimento de jogo, estratégias, agentes, armas e dicas.

  - Responder em português
  ## Regras
  - Se você não souber a resposta, responda "Desculpe, não sei a resposta para isso." e não tente inventar uma resposta.
  - Se a pergunta não está relacionada ao jogo, responda "Desculpe, essa pergunta não está relacionada ao jogo Valorant.".
  - Considere a data atual ${new Date().toLocaleDateString()}
  - Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente
  - Nunca responda itens que você não tenha certeza, sempre busque informações atualizadas

  ## Resposta
  - Economize a resposta, seja clara e direta e responda no máximo 500 caracteres
  - Responda em markdown
  - Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário perguntou

  ## Exemplo de resposta
  pergunta do usuário: Qual a melhor composição para o mapa Ascent?
  resposta: A composição mais atual para Ascent é: \n\n **Agentes:**\n\n [Agente 1], [Agente 2], [Agente 3], [Agente 4], [Agente 5]   \n\n **Estratégias:**\n\n [Dica de estratégia 1]\n\n [Dica de estratégia 2]\n\n **Dicas:**\n\n [Dica geral 1]\n\n [Dica geral 2]

  ---
  Aqui está a pergunta do usuário:
  ${question}
  `;

  const perguntaCS = `
  ## Especialidade
Você é um especialista assistente de meta para o jogo CS2.

## Tarefa
Você deve responder a pergunta do usuário sobre o jogo CS 2 com base no seu conhecimento de jogo, estratégias, armas, economia e dicas.

## Regras
- Responder em português
- Se você não souber a resposta, responda "Desculpe, não sei a resposta para isso." e não tente inventar uma resposta.
- Se a pergunta não está relacionada ao jogo, responda "Desculpe, essa pergunta não está relacionada ao jogo CS 2.".
- Considere a data atual ${new Date().toLocaleDateString()}
- Faça pesquisas atualizadas sobre o patch atual, baseado na data atual, para dar uma resposta coerente
- Nunca responda itens que você não tenha certeza, sempre busque informações atualizadas

## Resposta
- Economize a resposta, seja clara e direta e responda no máximo 500 caracteres
- Responda em markdown
- Não precisa fazer nenhuma saudação ou despedida, apenas responda o que o usuário perguntou

## Exemplo de resposta
pergunta do usuário: Qual a melhor estratégia de eco para o time CT no mapa Inferno?
resposta: Para um eco eficiente no lado CT do Inferno, considere: \n\n **Compra:**\n\n P250 ou Five-SeveN, colete e capacete, uma smoke ou flashbang. \n\n **Posicionamento:**\n\n Segurar posições de entrada (banana e apartamento) com ângulos fechados. \n\n **Dicas:**\n\n [Dica 1: Ex: Economizar para AK/M4 no próximo round]\n\n [Dica 2: Ex: Não se expor desnecessariamente]

---
Aqui está a pergunta do usuário:
${question}
  `

  let pergunta = "";
  if (game.toLowerCase() === "league of legends") {
    pergunta = perguntaLol;
  } else {
    pergunta = `Você é um especialista assistente de meta para o jogo ${game}. Responda a pergunta do usuário sobre o jogo ${game} com base no seu conhecimento de jogo, estratégias, build e dicas. Pergunta: ${question}`;
  }
  switch (game.toLowerCase()) {
    case "lol":
      pergunta = perguntaLol;
      break;
    case "valorant":
      pergunta = perguntaValorant;
      break;
    case "cs":
      pergunta = perguntaCS;
      break;
    default:
  }
  const contents = [
    {
      role: "user",
      parts: [
        {
          text: pergunta,
        },
      ],
    },
  ];

  const tools = [
    {
      google_search: {},
    },
  ];

  // API call
  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents,
      tools,
    }),
  });
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

const sendForm = async (e) => {
  e.preventDefault();
  apiKeyInput.value = "";
  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;

  if (apiKey == "" || game == "" || question == "") {
    alert("Please fill in all fields");
    return;
  }
  askButton.disabled = true;
  askButton.textContent = "Perguntando...";
  askButton.classList.add("loading");

  try {
    // Perguntar para GEMINI
    const text = await askAI(question, game, apiKey);
    aiResponse.querySelector(".response-content").innerHTML =
      markdownToHTML(text);
    aiResponse.classList.remove("hidden");
  } catch (error) {
    console.log("Erro", error);
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Perguntar";
    askButton.classList.remove("loading");
  }
};

form.addEventListener("submit", sendForm);
