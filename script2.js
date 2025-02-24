document.addEventListener("DOMContentLoaded", function () {
    carregarExcelAutomaticamente();
});

function carregarExcelAutomaticamente() {
    const caminhoDoArquivo = "catalogo_produtos.xlsx"; // Caminho relativo ao arquivo Excel

    fetch(caminhoDoArquivo)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Arquivo não encontrado ou erro na rede");
            }
            return response.arrayBuffer();
        })
        .then((data) => {
            const workbook = XLSX.read(new Uint8Array(data), { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const produtos = XLSX.utils.sheet_to_json(sheet);
            exibirProdutosPorDepartamento(produtos);
        })
        .catch((error) => {
            console.error("Erro ao carregar o arquivo Excel:", error);
        });
}

function exibirProdutosPorDepartamento(produtos) {
    const catalogo = document.getElementById("catalogo");
    catalogo.innerHTML = ""; // Limpa antes de adicionar novos produtos

    // Agrupa produtos por departamento
    const produtosPorDepartamento = produtos.reduce((acc, produto) => {
        const departamento = produto.Departamento || "Outros";
        if (!acc[departamento]) {
            acc[departamento] = [];
        }
        acc[departamento].push(produto);
        return acc;
    }, {});

    // Exibe os produtos por departamento
    for (const [departamento, produtos] of Object.entries(produtosPorDepartamento)) {
        const divDepartamento = document.createElement("div");
        divDepartamento.classList.add("departamento");

        const tituloDepartamento = document.createElement("h2");
        tituloDepartamento.textContent = departamento;
        divDepartamento.appendChild(tituloDepartamento);

        const divProdutos = document.createElement("div");
        divProdutos.classList.add("produtos-container");

        produtos.forEach((produto) => {
            const divProduto = document.createElement("div");
            divProduto.classList.add("produto");
            divProduto.innerHTML = `
                <img src="imagens/${produto.Imagem}" alt="${produto.Nome}">
                <h3>${produto.Nome}</h3>
                <p>${produto.Descrição || "Sem descrição disponível"}</p>`;
            divProdutos.appendChild(divProduto);
        });

        divDepartamento.appendChild(divProdutos);
        catalogo.appendChild(divDepartamento);
    }
}