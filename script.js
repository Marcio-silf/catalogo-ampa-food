document.getElementById("uploadExcel").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const produtos = XLSX.utils.sheet_to_json(sheet);

        exibirProdutos(produtos);
    };
    reader.readAsArrayBuffer(file);
});

function exibirProdutos(produtos) {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = ""; // Limpa antes de adicionar novos produtos

    produtos.forEach(produto => {
        const div = document.createElement("div");
        div.classList.add("produto");
        div.innerHTML = `
            <img src="imagens/${produto.Imagem}" alt="${produto.Nome}">
            <h2>${produto["Descrição"] || produto["descrição"] || "Sem descrição disponível"}</h2>`;
         
        catalogo.appendChild(div);
    });
}

