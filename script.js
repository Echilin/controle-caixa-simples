let produtos = [];

function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const custo = parseFloat(document.getElementById("custo").value);
  const preco = parseFloat(document.getElementById("preco").value);
  const qtdComprada = parseInt(document.getElementById("qtdComprada").value);
  const qtdVendida = parseInt(document.getElementById("qtdVendida").value);

  if (!nome || isNaN(custo) || isNaN(preco) || isNaN(qtdComprada) || isNaN(qtdVendida)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const lucroUnitario = preco - custo;
  const lucroTotal = lucroUnitario * qtdVendida;

  produtos.push({
    id: Date.now(),
    nome, custo, preco, qtdComprada, qtdVendida, lucroUnitario, lucroTotal
  });

  atualizarTabela();
  atualizarResumo();
  salvarLocalStorage();
  limparInputs();
}

function atualizarTabela() {
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";
  produtos.forEach(prod => {
    const tr = document.createElement("tr");
    const corLucro = prod.lucroTotal >= 0 ? "#4caf50" : "#f44336"; // verde positivo, vermelho negativo
    tr.innerHTML = `
      <td>${prod.nome}</td>
      <td>💰 R$ ${prod.custo.toFixed(2)}</td>
      <td>💎 R$ ${prod.preco.toFixed(2)}</td>
      <td>🛍️ ${prod.qtdComprada}</td>
      <td>✅ ${prod.qtdVendida}</td>
      <td>📈 R$ ${prod.lucroUnitario.toFixed(2)}</td>
      <td style="color:${corLucro}">💹 R$ ${prod.lucroTotal.toFixed(2)}</td>
      <td>
        <button class="edit" onclick="editarProduto(${prod.id})">✏️</button>
        <button class="delete" onclick="removerProduto(${prod.id})">❌</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function atualizarResumo() {
  const valorGasto = produtos.reduce((acc, p) => acc + (p.custo * p.qtdComprada), 0);
  const vendas = produtos.reduce((acc, p) => acc + (p.preco * p.qtdVendida), 0);
  const lucroAtual = produtos.reduce((acc, p) => acc + p.lucroTotal, 0);
  const lucroPrevisto = produtos.reduce((acc, p) => acc + (p.lucroUnitario * p.qtdComprada), 0);

  document.getElementById("valorGasto").textContent = valorGasto.toFixed(2);
  document.getElementById("vendas").textContent = vendas.toFixed(2);
  document.getElementById("lucroAtual").textContent = lucroAtual.toFixed(2);
  document.getElementById("lucroPrevisto").textContent = lucroPrevisto.toFixed(2);
}

// SALVAR E CARREGAR
function salvarLocalStorage() {
  localStorage.setItem("produtos", JSON.stringify(produtos));
}

function carregarProdutos() {
  const dados = localStorage.getItem("produtos");
  if (dados) {
    produtos = JSON.parse(dados);
    atualizarTabela();
    atualizarResumo();
  }
}

// REMOVER PRODUTO
function removerProduto(id) {
  produtos = produtos.filter(p => p.id !== id);
  atualizarTabela();
  atualizarResumo();
  salvarLocalStorage();
}

// EDITAR PRODUTO
function editarProduto(id) {
  const prod = produtos.find(p => p.id === id);
  if (!prod) return;

  document.getElementById("nome").value = prod.nome;
  document.getElementById("custo").value = prod.custo;
  document.getElementById("preco").value = prod.preco;
  document.getElementById("qtdComprada").value = prod.qtdComprada;
  document.getElementById("qtdVendida").value = prod.qtdVendida;

  produtos = produtos.filter(p => p.id !== id);
  atualizarTabela();
  atualizarResumo();
  salvarLocalStorage();
}

function limparInputs() {
  document.getElementById("nome").value = "";
  document.getElementById("custo").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("qtdComprada").value = "";
  document.getElementById("qtdVendida").value = "";
}

// CARREGAR AO INICIAR
window.onload = carregarProdutos;
