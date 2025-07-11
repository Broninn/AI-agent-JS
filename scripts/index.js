const apiKeyInput = document.getElementById("apiKey");
const gameSelect = document.getElementById("gameSelect");
const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const aiResponse = document.getElementById("aiResponse");
const form = document.getElementById("form");

const askAI = async (question, game, api) => {
  const model = "gemini-2.0-flash"
  const baseURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${api}`;
  //28:25 video
};

const sendForm = (e) => {
  e.preventDefault();
  const apiKey = apiKeyInput.value;
  const game = gameSelect.value;
  const question = questionInput.value;
  console.log({ apiKey, game, question });

  if (apiKey == "" || game == "" || question == "") {
    alert("Please fill in all fields");
    return;
  }
  askButton.disabled = true;
  askButton.textContent = "Perguntando...";
  askButton.classList.add("loading");

  try {
    // Perguntar para GEMINI
    askAI(question, game, apiKey);
  } catch (error) {
    console.log("Erro", error);
  } finally {
    askButton.disabled = false;
    askButton.textContent = "Perguntar";
    askButton.classList.remove("loading");
  }
};

form.addEventListener("submit", sendForm);
