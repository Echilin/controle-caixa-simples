function adicionar() {
  const descricao = document.getElementById("descricao").value;
  const valor = document.getElementById("valor").value;

  if (!descricao || !valor) return;

  const item = document.createElement("li");
  item.textContent = `${descricao} - R$ ${valor}`;

  document.getElementById("lista").appendChild(item);

  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
}
