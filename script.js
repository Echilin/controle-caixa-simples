// CHAVE DO LOCALSTORAGE
const STORAGE_KEY = "clarinho_caixa_v1";

// ===== FUNÇÕES DE STORAGE =====
function carregarProdutos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function salvarProdutos(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// ===== ADICIONAR =====
function adicionarProduto() {
  const nome = document.getElementById("nome").value.trim();
  const custo = Number(document.getElementById("custo").value);
  const preco = Number(document.getElementById("preco").value);
  const qtdComprada = Number(document.getElementById("qtdComprada").value);
  const qtdVendida = Number(document.getElementById("qtdVendida").value);

  if (!nome || isNaN(custo) || isNaN(preco) || isNaN(qtdComprada) || isNaN(qtdVendida)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const produtos = carregarProdutos();

  produtos.push({
    id: Date.now(),
    nome,
    custo,
    preco,
    qtdComprada,
    qtdVendida
  });

  salvarProdutos(produtos);
  limparInputs();
  atualizarTabela();
}

// ===== REMOVER =====
function removerProduto(id) {
  const produtos = carregarProdutos().filter(p => p.id !== id);
  salvarProdutos(produtos);
  atualizarTabela();
}

// ===== LIMPAR INPUTS =====
function limparInputs() {
  document.getElementById("nome").value = "";
  document.getElementById("custo").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("qtdComprada").value = "";
  document.getElementById("qtdVendida").value = "";
}

// ===== ATUALIZAR TABELA + RESUMO =====
function atualizarTabela() {
  const produtos = carregarProdutos();
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  let valorGasto = 0;
  let vendas = 0;
  let lucroAtual = 0;
  let lucroPrevisto = 0;

  produtos.forEach(p => {
    const lucroUnit = p.preco - p.custo;
    const lucroTotal = lucroUnit * p.qtdVendida;

    valorGasto += p.custo * p.qtdComprada;
    vendas += p.preco * p.qtdVendida;
    lucroAtual += lucroTotal;
    lucroPrevisto += lucroUnit * p.qtdComprada;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.nome}</td>
      <td>R$ ${p.custo.toFixed(2)}</td>
      <td>R$ ${p.preco.toFixed(2)}</td>
      <td>${p.qtdComprada}</td>
      <td>${p.qtdVendida}</td>
      <td>R$ ${lucroUnit.toFixed(2)}</td>
      <td>R$ ${lucroTotal.toFixed(2)}</td>
      <td>
        <button class="delete" onclick="removerProduto(${p.id})">❌</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("valorGasto").textContent = valorGasto.toFixed(2);
  document.getElementById("vendas").textContent = vendas.toFixed(2);
  document.getElementById("lucroAtual").textContent = lucroAtual.toFixed(2);
  document.getElementById("lucroPrevisto").textContent = lucroPrevisto.toFixed(2);
}

// ===== CARREGAR AO ABRIR =====
window.onload = atualizarTabela;

// ===== DEIXA GLOBAL (BOTÃO FUNCIONA) =====
window.adicionarProduto = adicionarProduto;
window.removerProduto = removerProduto;
