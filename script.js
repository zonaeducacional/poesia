// Configurações do JSONBin
const JSONBIN_BIN_ID = "681122fe8561e97a500a46b6"; // Substitua pelo seu Bin ID
const JSONBIN_API_KEY = "$2a$10$QOElX.D6IN9twdhooyqs6O3pjTQGpmYUE8h2RHS3jZNPFcryFTopG"; // Substitua pela sua API Key
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}/latest`;

// Salva todos os poemas no JSONBin
async function salvarPoema() {
  const tema = document.getElementById('tema').value;
  const poema = document.getElementById('poema').value;

  if (!poema) {
    alert("Escreva algo primeiro!");
    return;
  }

  // Pega a lista atual de poemas
  const poemasAtuais = await carregarPoemasDoServidor();
  const novosPoemas = [...poemasAtuais, { tema, poema }];

  // Envia para o JSONBin
  try {
    const response = await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": JSONBIN_API_KEY,
      },
      body: JSON.stringify(novosPoemas),
    });

    if (response.ok) {
      alert("Poema salvo no servidor!");
      carregarPoemas();
      document.getElementById('poema').value = "";
    } else {
      throw new Error("Falha ao salvar");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao salvar. Tente novamente.");
  }
}

// Carrega poemas do JSONBin
async function carregarPoemasDoServidor() {
  try {
    const response = await fetch(JSONBIN_URL, {
      headers: { "X-Master-Key": JSONBIN_API_KEY },
    });
    const data = await response.json();
    return data.record || []; // Retorna a lista de poemas ou vazio
  } catch (error) {
    console.error("Erro ao carregar:", error);
    return [];
  }
}

// Atualiza a lista de poemas na tela
async function carregarPoemas() {
  const poemas = await carregarPoemasDoServidor();
  const listaDiv = document.getElementById('lista-poemas');

  listaDiv.innerHTML = poemas.map((item, index) => `
    <div class="bg-white p-4 rounded-lg shadow-md border border-purple-200">
      <h3 class="font-bold text-purple-700">${item.tema || "Sem tema"}</h3>
      <p class="poema-text mt-2 text-gray-800">${item.poema.replace(/\n/g, "<br>")}</p>
      <button onclick="deletarPoema(${index})" class="mt-2 text-red-500 hover:text-red-700">
        Deletar
      </button>
    </div>
  `).join("");
}

// Deleta um poema (atualiza o JSONBin)
async function deletarPoema(index) {
  const poemas = await carregarPoemasDoServidor();
  poemas.splice(index, 1);

  await fetch(`https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": JSONBIN_API_KEY,
    },
    body: JSON.stringify(poemas),
  });

  carregarPoemas();
}

// Carrega os poemas ao iniciar
document.addEventListener("DOMContentLoaded", carregarPoemas);
