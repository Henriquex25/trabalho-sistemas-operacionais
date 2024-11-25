window.addEventListener("DOMContentLoaded", () => {
    renderizarListaTarefas();
});

function renderizarListaTarefas() {
    const lista = pegarLista();
    const tbody = document.querySelector("tbody");

    tbody.innerHTML = "";

    for (let [index, tarefa] of lista.entries()) {
        tbody.innerHTML += `
            <tr>
                <td>${tarefa.id}</td>
                <td>${tarefa.nome}</td>
                <td>${tarefa.descricao}</td>
                <td class="status-${tarefa.status}">${tarefa.status}</td>
                <td>
                    <button class="botao-editar" onclick="abrirModalEditarTarefa(${index})">Editar</button>
                    <button class="botao-deletar" onclick="deletarTarefa(${index})">Deletar</button>
                    <button class="${
                        tarefa.status === "pendente" ? "botao-concluir" : "botao-concluída"
                    }" onclick="concluirTarefa(${index})">Concluir</button>
                </td>
            </tr>
        `;
    }
}

function salvarItem(list) {
    localStorage.setItem("list", JSON.stringify(list));
}

function pegarLista() {
    return JSON.parse(localStorage.getItem("list")) ?? [];
}

function criarTarefa() {
    const nome = document.getElementById("input-nome-tarefa");
    const descricao = document.getElementById("input-descricao-tarefa");

    if (!nome.value) {
        alert("Por favor, preencha o campo nome da tarefa");
        return;
    }

    if (!descricao.value) {
        alert("Por favor, preencha o campo descrição");
        return;
    }

    const lista = pegarLista();
    const ultimaTarefa = lista[lista.length - 1];

    lista.push({
        id: (ultimaTarefa?.id ?? 0) + 1,
        nome: nome.value,
        descricao: descricao.value,
        status: "pendente",
    });

    salvarItem(lista);

    nome.value = "";
    descricao.value = "";

    fecharModal();
    renderizarListaTarefas();
}

function abrirModalEditarTarefa(index) {
    abrirModal("Editar tarefa", index);

    const tarefa = pegarLista()[index];

    const nome = document.getElementById("input-nome-tarefa");
    const descricao = document.getElementById("input-descricao-tarefa");

    nome.value = tarefa.nome;
    descricao.value = tarefa.descricao;
}

function editarTarefa() {
    const nome = document.getElementById("input-nome-tarefa");
    const descricao = document.getElementById("input-descricao-tarefa");
    const form = document.getElementById("formulario-tarefa");
    const index = form.dataset.index;

    if (index) {
        const lista = pegarLista();

        lista[index] = {
            ...lista[index],
            nome: nome.value,
            descricao: descricao.value,
        };

        salvarItem(lista);

        fecharModal();
        renderizarListaTarefas();
    }
}

function deletarTarefa(index) {
    if (!confirm("Tem certeza que deseja deletar essa tarefa?")) {
        return;
    }

    const lista = pegarLista();

    lista.splice(index, 1);

    salvarItem(lista);
    renderizarListaTarefas();
}

function concluirTarefa(index) {
    if (!confirm("Tem certeza que deseja deletar essa tarefa?")) {
        return;
    }

    const lista = pegarLista();

    lista[index] = {
        ...lista[index],
        status: "concluída",
    };

    salvarItem(lista);
    renderizarListaTarefas();
}

function salvarTarefa(event) {
    event.preventDefault();

    const tituloModal = document.getElementById("titulo-modal");

    if (tituloModal.innerText === "Adicionar Tarefa") {
        criarTarefa();

        return;
    }

    editarTarefa();
}

function abrirModal(titulo, index = null) {
    const modal = document.querySelector("div.modal");
    const tituloModal = document.getElementById("titulo-modal");
    const botaoSalvar = document.getElementById("botao-modal-salvar");
    const form = document.getElementById("formulario-tarefa");

    if (titulo === "Adicionar Tarefa") {
        tituloModal.style.color = "#3b82f6";
        botaoSalvar.style.backgroundColor = "#3b82f6";
        form.dataset.action = "criar";
        form.dataset.index = "";
    }

    if (titulo === "Editar tarefa") {
        tituloModal.style.color = "#eab308";
        botaoSalvar.style.backgroundColor = "#eab308";
        form.dataset.action = "editar";
        form.dataset.index = index;
    }

    tituloModal.innerText = titulo;
    modal.style.display = "flex";
}

function fecharModal() {
    const modal = document.querySelector("div.modal");
    const nome = document.getElementById("input-nome-tarefa");
    const descricao = document.getElementById("input-descricao-tarefa");

    nome.value = "";
    descricao.value = "";
    modal.style.display = "none";
}
