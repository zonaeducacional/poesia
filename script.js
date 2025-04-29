// Banco de dados de rimas (simplificado)
const rimas = {
  "flor": ["amor", "cor", "dor", "splendor"],
  "mar": ["azar", "lugar", "voar", "sonhar"],
  "lua": ["sua", "escuta", "bruxa", "nua"]
};

// Sugere rimas baseadas na última palavra do poema
function sugerirRima() {
  const poema = document.getElementById('poema').value;
  const palavras = poema.split(' ');
  const ultimaPalavra = palavras[palavras.length - 1].toLowerCase().replace(/[.,!?]/g, '');
  
  const sugestaoDiv = document.getElementById('sugestao-rima');
  sugestaoDiv.classList.remove('hidden');

  if (rimas[ultimaPalavra]) {
    sugestaoDiv.innerHTML = `
      <p class="font-bold text-purple-800">Rimas para "${ultimaPalavra}":</p>
      <p>${rimas[ultimaPalavra].join(', ')}</p>
    `;
  } else {
    sugestaoDiv.innerHTML = `<p>Nenhuma rima encontrada para "${ultimaPalavra}". Tente outra palavra!</p>`;
  }
}

// Salva o poema no localStorage
function salvarPoema() {
  const tema = document.getElementById('tema').value;
  const poema = document.getElementById('poema').value;

  if (!poema) {
    alert("Escreva algo primeiro!");
    return;
  }

  const poemasSalvos = JSON.parse(localStorage.getItem('poemas') || '[]');
  poemasSalvos.push({ tema, poema });
  localStorage.setItem('poemas', JSON.stringify(poemasSalvos));

  alert("Poema salvo com sucesso!");
  carregarPoemas();
  document.getElementById('poema').value = '';
}

// Carrega poemas salvos
function carregarPoemas() {
  const poemasSalvos = JSON.parse(localStorage.getItem('poemas') || '[]');
  const listaDiv = document.getElementById('lista-poemas');

  listaDiv.innerHTML = poemasSalvos.map((item, index) => `
    <div class="bg-white p-4 rounded-lg shadow-md border border-purple-200">
      <h3 class="font-bold text-purple-700">${item.tema || 'Sem tema'}</h3>
      <p class="poema-text mt-2 text-gray-800">${item.poema.replace(/\n/g, '<br>')}</p>
      <button onclick="deletarPoema(${index})" class="mt-2 text-red-500 hover:text-red-700">Deletar</button>
    </div>
  `).join('');
}

// Deleta um poema
function deletarPoema(index) {
  const poemasSalvos = JSON.parse(localStorage.getItem('poemas') || '[]');
  poemasSalvos.splice(index, 1);
  localStorage.setItem('poemas', JSON.stringify(poemasSalvos));
  carregarPoemas();
}

// Carrega poemas ao iniciar
document.addEventListener('DOMContentLoaded', carregarPoemas);