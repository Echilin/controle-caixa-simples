// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_DOMINIO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
};

// INICIALIZA FIREBASE
firebase.initializeApp(firebaseConfig);

// BANCO
const db = firebase.firestore();
const vendasRef = db.collection("vendas");

// FUNÇÃO GLOBAL (onclick FUNCIONA)
function adicionarProduto() {
  const nome = document.getElementById("nome").value;
  const custo = parseFloat(document.getElementById("custo").value);
  const preco = parseFloat(document.getElementById("preco").value);
  const qtdComprada = parseInt(document.getElementById("qtdComprada").value);
  const qtdVendida = parseInt(document.getElementById("qtdVendida").value);

  if (!nome || isNaN(custo) || isNaN(preco) || isNaN(qtdComprada) || isNaN(qtdVendida)) {
    alert("Preencha tudo certinho");
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
    alert("Produto adicionado!");
  }).catch((e) => {
    console.error(e);
  });
}

// GARANTE QUE A FUNÇÃO EXISTE
window.adicionarProduto = adicionarProduto;
