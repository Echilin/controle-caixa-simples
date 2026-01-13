const vendasRef = db.collection("vendas");

// Adicionar produto
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
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    limparInputs();
    atualizarTabela();
  }).catch((erro) => {
    console.error("Erro ao salvar:", erro);
  });
}

// Limpa inputs
function limparInputs() {
  document.getElementById("nome").value = "";
  document.getElementById("custo").value = "";
  document.getElementById("preco").value = "";
  document.getElementById("qtdComprada").value = "";
  document.getElementById("qtdVendida").value = "";
}

// Atualiza tabela
function atualizarTabela() {
  const tbody = document.querySelector("#tabela tbody");
  tbody.innerHTML = "";

  let valorGasto = 0;
  let vendasTotal = 0;
  let lucroAtual = 0;
  let lucroPrevisto = 0;

  vendasRef.orderBy("timestamp", "asc").get().then(snapshot => {
    snapshot.forEach(doc => {
      const p = doc.data();

      valorGasto += p.custo * p.qtdComprada;
      vendasTotal += p.preco * p.qtdVendida;
      lucroAtual += p.lucroTotal;
      lucroPrevisto += p.lucroUnit * p.qtdComprada;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.nome}</td>
        <td>R$ ${p.custo.toFixed(2)}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.qtdComprada}</td>
        <td>${p.qtdVendida}</td>
        <td>R$ ${p.lucroUnit.toFixed(2)}</td>
        <td>R$ ${p.lucroTotal.toFixed(2)}</td>
        <td>
          <button class="delete" onclick="removerProduto('${doc.id}')">❌</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById("valorGasto").textContent = valorGasto.toFixed(2);
    document.getElementById("vendas").textContent = vendasTotal.toFixed(2);
    document.getElementById("lucroAtual").textContent = lucroAtual.toFixed(2);
    document.getElementById("lucroPrevisto").textContent = lucroPrevisto.toFixed(2);
  });
}

// Remover produto
function removerProduto(id) {
  vendasRef.doc(id).delete().then(() => {
    atualizarTabela();
  });
}

// Carrega ao abrir
window.onload = atualizarTabela;
