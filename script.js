const vendasRef = db.collection("vendas");

// Adicionar produto
function adicionarProduto() {
  const nome = document.getElementById("nome").value.trim();
  const custo = Number(document.getElementById("custo").value);
  const preco = Number(document.getElementById("preco").value);
  const qtdComprada = Number(document.getElementById("qtdComprada").value);
  const qtdVendida = Number(document.getElementById("qtdVendida").value);

  if (!nome || !Number.isFinite(custo) || !Number.isFinite(preco) || !Number.isFinite(qtdComprada) || !Number.isFinite(qtdVendida)) {
    alert("Preencha todos os campos corretamente!");
    return;
  }

  const lucroUnit = preco - custo;
  const lucroTotal = lucroUnit * qtdVendida;

  vendasRef.add({
    nome,
    custo,
    preco,
    qtdComprada,
    qtdVendida,
    lucroUnit,
    lucroTotal,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    limparInputs();
  }).catch((erro) => {
    console.error("Erro ao salvar:", erro);
    alert("Não consegui salvar. Olha o Console (F12) pra ver o erro.");
  });
}

function limparInputs() {
  document.getElementById("nome").value = "";
  document.getElementById("custo").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("qtdComprada").value = "";
  document.getElementById("qtdVendida").value = "";
}

// Monta linha da tabela
function renderLinha(doc) {
  const p = doc.data();
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${p.nome ?? ""}</td>
    <td>R$ ${(p.custo ?? 0).toFixed(2)}</td>
    <td>R$ ${(p.preco ?? 0).toFixed(2)}</td>
    <td>${p.qtdComprada ?? 0}</td>
    <td>${p.qtdVendida ?? 0}</td>
    <td>R$ ${(p.lucroUnit ?? 0).toFixed(2)}</td>
    <td>R$ ${(p.lucroTotal ?? 0).toFixed(2)}</td>
    <td><button class="delete" onclick="removerProduto('${doc.id}')">❌</button></td>
  `;

  return tr;
}

// Recalcula resumo baseado no snapshot inteiro
function atualizarResumo(docs) {
  let valorGasto = 0;
  let vendasTotal = 0;
  let lucroAtual = 0;
  let lucroPrevisto = 0;

  docs.forEach((doc) => {
    const p = doc.data();
    const custo = Number(p.custo) || 0;
    const preco = Number(p.preco) || 0;
    const qtdComprada = Number(p.qtdComprada) || 0;
    const qtdVendida = Number(p.qtdVendida) || 0;

    const lucroUnit = (Number(p.lucroUnit) || (preco - custo));
    const lucroTotal = (Number(p.lucroTotal) || (lucroUnit * qtdVendida));

    valorGasto += custo * qtdComprada;
    vendasTotal += preco * qtdVendida;
    lucroAtual += lucroTotal;
    lucroPrevisto += lucroUnit * qtdComprada;
  });

  document.getElementById("valorGasto").textContent = valorGasto.toFixed(2);
  document.getElementById("vendas").textContent = vendasTotal.toFixed(2);
  document.getElementById("lucroAtual").textContent = lucroAtual.toFixed(2);
  document.getElementById("lucroPrevisto").textContent = lucroPrevisto.toFixed(2);
}

// Remover
function removerProduto(id) {
  vendasRef.doc(id).delete().catch((erro) => {
    console.error("Erro ao remover:", erro);
  });
}

// 🔥 Atualização em tempo real (perfeito)
vendasRef.orderBy("createdAt", "asc").onSnapshot((snapshot) => {
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  const docs = [];
  snapshot.forEach((doc) => {
    docs.push(doc);
    tbody.appendChild(renderLinha(doc));
  });

  atualizarResumo(docs);
});
