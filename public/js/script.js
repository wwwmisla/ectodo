// Script responsável por gerenciar as tarefas, disciplinas e estatísticas da aplicação realizando o CRUD (Create, Read, Update, Delete) de tarefas e disciplinas. Ele também lida com a exibição de mensagens e a interação do usuário com o DOM.
document.addEventListener("DOMContentLoaded", () => {
    // URL base da API
    const API_URL = "http://localhost:3000";
    const API_URL_TAREFAS = `${API_URL}/tarefas`;
    const API_URL_DISCIPLINAS = `${API_URL}/disciplinas`;

    // Elementos do DOM
    const tarefaForm = document.getElementById("tarefa-form");
    const tarefasContainer = document.getElementById("tarefas-container");
    const mensagemSemTarefas = document.getElementById("mensagem-sem-tarefa");

    // Filtros
    const filtroSemestre = document.getElementById("filtro-semestre");
    const filtroDisciplina = document.getElementById("filtro-disciplina");
    const filtroCategoria = document.getElementById("filtro-categoria");
    const filtroPrioridade = document.getElementById("filtro-prioridade");

    let filtroStatusAtivo = 'all'; // 'all', 'completo', 'pendente'
    const filtroStatusBtn = document.querySelector('#filtro-status .filtro-dropdown-btn span');

    // Estatísticas
    const totalTarefas = document.getElementById("total-tarefas");
    const tarefasCompletas = document.getElementById("total-concluidas");
    const tarefasPendentes = document.getElementById("total-pendentes");

    // Modal de Edição
    const modalEdicao = document.getElementById("modal-edicao");
    const editarForm = document.getElementById("editar-form");
    const fecharModal = document.getElementById("fechar-modal");
    const cancelarEdicao = document.getElementById("cancelar-edicao");

    // Função para inicializar a aplicação
    async function init() {
        try {
            await carregarDisciplinas();
            await carregarTarefas();
            await atualizarEstatisticas();
            configurarFiltroStatus();
            desabilitarOutrosFiltros();

            console.log("Aplicação inicializada com sucesso!"); // Log de sucesso
        } catch (error) {
            console.error("Erro na inicialização:", error);
            mensagemSemTarefas.textContent =
                "Erro ao carregar tarefas. Recarregue a página."; // Mensagem de erro
            mensagemSemTarefas.classList.remove("hidden");
        }
    }

    // Função para configurar o filtro de status
    function configurarFiltroStatus() {
        const statusBtn = document.querySelector('#filtro-status .filtro-dropdown-btn');
        const statusDropdown = document.querySelector('#filtro-status .filtro-dropdown-content');
        const statusOptions = document.querySelectorAll('.status-option');

        // Configura a abertura do dropdown
        statusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            statusDropdown.classList.toggle('hidden');
        });

        // Configura as opções do dropdown
        statusOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                filtroStatusAtivo = option.getAttribute('data-status');

                // Atualiza o texto do botão
                if (filtroStatusAtivo === 'all') {
                    filtroStatusBtn.textContent = 'Status';
                } else if (filtroStatusAtivo === 'pendente') {
                    filtroStatusBtn.textContent = 'Pendentes';
                } else {
                    filtroStatusBtn.textContent = 'Concluídos';
                }

                // Fecha o dropdown
                statusDropdown.classList.add('hidden');

                // Recarrega as tarefas com o novo filtro
                carregarTarefas();
            });
        });

        // Fecha o dropdown ao clicar fora
        document.addEventListener('click', () => {
            statusDropdown.classList.add('hidden');
        });
    }

    // Função para desabilitar os outros filtros
    function desabilitarOutrosFiltros() {
        const outrosFiltros = ['semestre', 'disciplina', 'categoria', 'prioridade'];

        outrosFiltros.forEach(filtro => {
            const btn = document.querySelector(`#filtro-${filtro} .filtro-dropdown-btn`);
            if (btn) {
                btn.style.cursor = 'not-allowed';
                btn.style.opacity = '0.6';
                btn.disabled = true;

                // Remove o event listener de clique apenas dos outros filtros
                btn.replaceWith(btn.cloneNode(true));
            }
        });
    }

    // Carregar disciplinas no select
    async function carregarDisciplinas(
        semestreSelecionado,
        targetSelect = "disciplina"
    ) {
        const disciplinas = await lerDisciplinas();
        const selectDisciplina = document.getElementById(targetSelect);

        // Limpa as opções anteriores
        selectDisciplina.innerHTML =
            targetSelect === "disciplina"
                ? '<option value="">Selecione uma disciplina</option>'
                : '<option value="">Selecione o semestre primeiro</option>';

        // Se não tem semestre selecionado, mantém vazio
        if (!semestreSelecionado) {
            selectDisciplina.disabled = true;
            return;
        }

        // Filtra por semestre e adiciona ao select
        disciplinas
            .filter((d) => d.semestre == semestreSelecionado)
            .forEach((disciplina) => {
                const option = document.createElement("option");
                option.value = disciplina.id;
                option.textContent = disciplina.nome;
                selectDisciplina.appendChild(option);
            });

        // Ativa o select
        selectDisciplina.disabled = false;
        selectDisciplina.classList.remove("bg-gray-100");
    }

    // Carregar tarefas no DOM
    async function carregarTarefas() {
        try {
            let url = new URL(API_URL_TAREFAS);

            // Adiciona parâmetros de filtro à URL
            if (filtroStatusAtivo !== 'all') {
                if (filtroStatusAtivo === 'pendente') {
                    url.searchParams.append('completa', 'false'); // localhost:3000/tarefas?completa=false
                } else if (filtroStatusAtivo === 'completo') {
                    url.searchParams.append('completa', 'true'); // localhost:3000/tarefas?completa=true
                }
            }

            const resposta = await fetch(url);
            let tarefas = await resposta.json();

            // Ordenação local 
            tarefas.sort((a, b) => {
                if (a.completa && !b.completa) return 1;    // Concluídas depois
                if (!a.completa && b.completa) return -1;   // Pendentes antes
                return new Date(a.dataEntrega) - new Date(b.dataEntrega); // Por data
            });

            tarefasContainer.innerHTML = "";

            if (tarefas.length === 0) {
                mensagemSemTarefas.textContent = filtroStatusAtivo === 'all'
                    ? "Nenhuma tarefa encontrada. Crie sua primeira tarefa!"
                    : `Nenhuma tarefa ${filtroStatusAtivo === 'pendente' ? 'pendente' : 'concluída'} encontrada.`;
                mensagemSemTarefas.classList.remove("hidden");
                return;
            } else {
                mensagemSemTarefas.classList.add("hidden");
                tarefas.forEach((tarefa) => {
                    const tarefaElement = criarElementoTarefa(tarefa);
                    tarefasContainer.appendChild(tarefaElement);
                });
            }

            atualizarEstatisticas(); // Atualiza as estatísticas após carregar as tarefas
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
        }
    }

    // Função básica para criar tarefas (POST - CREATE) | Esta função envia uma requisição POST para criar uma nova tarefa no servidor
    async function criarTarefa(dados) {
        try {
            const resposta = await fetch(API_URL_TAREFAS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dados),
            });
            return await resposta.json(); // Retorna a tarefa criada
        } catch (error) {
            console.error("Erro ao criar tarefa:", error); // Log erro no console
        }
    }

    // Função para ler tarefas (GET - READ) | Esta função envia uma requisição GET para obter todas as tarefas do servidor
    async function lerTarefas() {
        try {
            const resposta = await fetch(API_URL_TAREFAS);
            return await resposta.json();
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error); // Log erro no console
        }
    }

    // Função para ler disciplinas (GET - READ) | Esta função envia uma requisição GET para obter todas as disciplinas do servidor
    async function lerDisciplinas() {
        try {
            const resposta = await fetch(API_URL_DISCIPLINAS);
            return await resposta.json();
        } catch (error) {
            console.error("Erro ao carregar disciplinas:", error); // Log erro no console
        }
    }

    // Função para deletar tarefas (DELETE - DELETE) | Esta função envia uma requisição DELETE para remover uma tarefa do servidor
    async function deletarTarefa(id) {
        if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

        try {
            await fetch(`${API_URL_TAREFAS}/${id}`, { method: "DELETE" });
            console.log("Tarefa excluída com sucesso!");

            await carregarTarefas(); // Recarrega todas as tarefas
            atualizarEstatisticas();
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
        }
    }

    // Vinculando ao formulário
    async function adicionarTarefa(event) {
        event.preventDefault();

        // Campos
        const titulo = document.getElementById("titulo").value.trim();
        const descricao = document.getElementById("descricao").value.trim();

        // Validação simples
        if (titulo.length < 6) {
            alert("O título deve ter pelo menos 6 caracteres");
            document.getElementById("titulo").focus();
            return;
        }

        const dados = {
            titulo:
                titulo.charAt(0).toUpperCase() +
                titulo.slice(1), // Capitaliza o primeiro caractere
            descricao: descricao.charAt(0).toUpperCase() +
                descricao.slice(1), // Capitaliza o primeiro caractere
            semestre: document.getElementById("semestre").value,
            disciplina:
                document.getElementById("disciplina").options[
                    document.getElementById("disciplina").selectedIndex
                ].text,
            categoria: document.getElementById("categoria").value,
            prioridade: document.getElementById("prioridade").value,
            dataEntrega: document.getElementById("dataEntrega").value,
            completa: false,
        };

        const tarefa = await criarTarefa(dados); // Chama a função para criar a tarefa
        tarefaForm.reset(); // Limpa o formulário
        console.log("Tarefa criada:", tarefa);
        carregarTarefas(); // Recarrega as tarefas após a criação
    }

    // Alternar status da tarefa (PUT - UPDATE)
    async function atualizarStatusTarefa(id, status) {
        try {
            await fetch(`${API_URL_TAREFAS}/${id}`, {
                method: "PATCH", // Usando PATCH para atualizar apenas o status
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ completa: status }),
            });

            carregarTarefas(); // Recarrega as tarefas após a mudança de status
            atualizarEstatisticas(); // Atualiza as estatísticas após a mudança de status
        } catch (error) {
            console.error("Erro ao atualizar status da tarefa:", error);
        }
    }

    // Criar elemento HTML para uma tarefa
    function criarElementoTarefa(tarefa) {
        const tarefaElement = document.createElement("div");
        tarefaElement.className =
            "border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out";
        tarefaElement.dataset.id = tarefa.id; // Adiciona o ID da tarefa como atributo de dados

        // Prioridade
        let prioridadeClasses = {
            bg: "bg-gray-100",
            text: "text-gray-800",
        };
        switch (tarefa.prioridade) {
            case "urgente":
                prioridadeClasses = {
                    bg: "bg-red-100",
                    text: "text-red-800",
                };
                break;
            case "alta":
                prioridadeClasses = {
                    bg: "bg-orange-100",
                    text: "text-orange-800",
                };
                break;
            case "media":
                prioridadeClasses = {
                    bg: "bg-yellow-100",
                    text: "text-yellow-800",
                };
                break;
            case "baixa":
                prioridadeClasses = {
                    bg: "bg-green-100",
                    text: "text-green-800",
                };
                break;
            default:
                break;
        }

        // Data formatada
        const dataFormatada = tarefa.dataEntrega
            ? new Date(tarefa.dataEntrega).toLocaleDateString("pt-BR")
            : "Sem data definida";

        tarefaElement.innerHTML = `
            <table class="w-full table-auto border-separate border-spacing-y-3">
                <tbody>
                    <tr class="rounded-lg">
                        <!-- Checkbox -->
                        <td class="align-top px-3 pt-3">
                            <label class="inline-flex items-center cursor-pointer">
                                <input type="checkbox" ${tarefa.completa ? "checked" : ""} 
                                    class="hidden peer checkbox-status" 
                                    title="Marcar tarefa como concluída">
                                <div class="relative h-6 w-6 rounded-full border-2 border-gray-300 peer-checked:border-universidade-accent
                                            peer-checked:bg-universidade-accent transition-all duration-200
                                            flex items-center justify-center peer-hover:scale-110">
                                    ${tarefa.completa ? `
                                        <i class="fas fa-check text-white text-xs absolute"></i>
                                    ` : ''}
                                </div>
                            </label>
                        </td>

                        <!-- Conteúdo -->
                        <td class="align-top w-full px-2 pt-3">
                        <h3 class="text-lg font-medium ${tarefa.completa ? "line-through text-blue-600" : "text-blue-600"
            }">
                            ${tarefa.titulo}
                        </h3>
                        ${tarefa.descricao
                ? `<p class="text-gray-600 mt-1">${tarefa.descricao}</p>`
                : ""
            }

                        <div class="flex flex-wrap gap-2 text-sm mt-2 -ml-12">
                            ${tarefa.disciplina
                ? `
                            <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                                <i class="fas fa-book mr-1"></i> ${tarefa.disciplina} - ${tarefa.semestre}º
                            </span>`
                : ""
            }
                            
                            ${tarefa.categoria
                ? `
                            <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                                <i class="fas fa-tag mr-1"></i> ${tarefa.categoria}
                            </span>`
                : ""
            }

                            <span class="${prioridadeClasses.bg} ${prioridadeClasses.text} px-2 py-1 rounded-full">
                                <i class="fas fa-exclamation-circle mr-1.5 text-xs"></i>
                                ${tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}
                            </span>

                            <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                            <i class="far fa-calendar-alt mr-1"></i> ${dataFormatada}
                            </span>
                        </div>
                        </td>

                        <!-- Botões -->
                        <td class="align-top flex px-2 pt-3 whitespace-nowrap">
                        <button class="text-blue-600 hover:text-blue-800 btn-editar mr-2" title="Editar tarefa">
                            <i class="fas fa-edit text-lg"></i>
                        </button>
                        <button class="text-red-600 hover:text-red-800 btn-deletar" title="Deletar tarefa">
                            <i class="fas fa-trash-alt text-lg"></i>
                        </button>
                        </td>
                    </tr>
                </tbody>
        </table>
        `;

        // Adiciona eventos aos botões e checkbox
        tarefaElement
            .querySelector(".btn-editar")
            .addEventListener("click", () => abrirModalEdicao(tarefa));
        tarefaElement
            .querySelector(".btn-deletar")
            .addEventListener("click", () => deletarTarefa(tarefa.id));
        tarefaElement
            .querySelector(".checkbox-status")
            .addEventListener("change", (e) => {
                const status = e.target.checked;
                atualizarStatusTarefa(tarefa.id, status);
            });

        return tarefaElement;
    }

    // Editar tarefa (PUT - UPDATE)
    async function editarTarefa(event) {
        event.preventDefault();

        const salvarBtn = document.querySelector(
            '#editar-form button[type="submit"]'
        );
        salvarBtn.disabled = true;
        salvarBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

        const id = document.getElementById("editar-id").value;
        const tarefaEditada = {
            titulo: document.getElementById("editar-titulo").value,
            descricao: document.getElementById("editar-descricao").value,
            semestre: document.getElementById("editar-semestre").value,
            disciplina:
                document.getElementById("editar-disciplina").options[
                    document.getElementById("editar-disciplina").selectedIndex
                ].text,
            categoria: document.getElementById("editar-categoria").value,
            prioridade: document.getElementById("editar-prioridade").value,
            dataEntrega: document.getElementById("editar-data").value,
            completa: document.getElementById("editar-completa").checked,
        };

        try {
            const response = await fetch(`${API_URL_TAREFAS}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tarefaEditada),
            });

            if (!response.ok) console.log("Erro ao editar tarefa");

            console.log("Tarefa editada com sucesso!");
            modalEdicao.classList.add("hidden"); // Fecha o modal
            carregarTarefas(); // Recarrega as tarefas após a edição
            atualizarEstatisticas(); // Atualiza as estatísticas
        } catch (error) {
            console.error("Erro ao editar tarefa:", error); // Log erro no console
        } finally {
            // Restaurar o botão
            salvarBtn.disabled = false;
            salvarBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Salvar Alterações';
        }
    }

    // Abrir modal de edição
    async function abrirModalEdicao(tarefa) {
        // Preencher o modal com os dados da tarefa
        document.getElementById("editar-id").value = tarefa.id;
        document.getElementById("editar-titulo").value = tarefa.titulo;
        document.getElementById("editar-descricao").value = tarefa.descricao || "";
        document.getElementById("editar-semestre").value = tarefa.semestre;

        // Seleciona a disciplina correta no select
        // Carrega as disciplinas para o semestre selecionado
        await carregarDisciplinas(tarefa.semestre, "editar-disciplina");

        // Seleciona a disciplina correta no select
        const disciplinaSelect = document.getElementById("editar-disciplina");
        if (disciplinaSelect) {
            for (let i = 0; i < disciplinaSelect.options.length; i++) {
                // Normaliza os textos para comparação (remove diferenças de capitalização) e remove espaços + compara se são iguais
                // Se o texto da opção for igual ao texto da disciplina da tarefa, seleciona a opção
                if (disciplinaSelect.options[i].text.toLowerCase().trim() === tarefa.disciplina.toLowerCase().trim()) {
                    disciplinaSelect.selectedIndex = i;
                    break;
                }
            }
        }

        document.getElementById("editar-categoria").value = tarefa.categoria;
        document.getElementById("editar-prioridade").value = tarefa.prioridade;

        // Formata a data para o formato correto
        const dataEntrega = tarefa.dataEntrega
            ? new Date(tarefa.dataEntrega).toISOString().split("T")[0]
            : "";
        document.getElementById("editar-data").value = dataEntrega;

        document.getElementById("editar-completa").checked = tarefa.completa;

        modalEdicao.classList.remove("hidden"); // Abre o modal
    }

    // Event Listeners
    tarefaForm.addEventListener("submit", adicionarTarefa);
    editarForm.addEventListener("submit", editarTarefa);
    // Event listener para semestre (formulário principal)
    document.getElementById("semestre").addEventListener("change", (e) => {
        const semestreSelecionado = e.target.value;
        carregarDisciplinas(semestreSelecionado, "disciplina");
    });
    // Event listener para semestre (modal de edição)
    document.getElementById("editar-semestre").addEventListener("change", (e) => {
        const semestreSelecionado = e.target.value;
        carregarDisciplinas(semestreSelecionado, "editar-disciplina");
    });

    // Atualizar estatísticas (Total, Completas e Pendentes)
    async function atualizarEstatisticas(tarefasFiltradas = null) {
        try {
            let tarefas = tarefasFiltradas || await lerTarefas();
            const total = tarefas.length;
            const completas = tarefas.filter((t) => t.completa).length;
            const pendentes = total - completas;

            totalTarefas.textContent = `${total}`;
            tarefasCompletas.textContent = `${completas}`;
            tarefasPendentes.textContent = `${pendentes}`;
        } catch (error) {
            console.error("Erro ao atualizar estatísticas:", error);
        }
    }

    // Modal
    fecharModal.addEventListener("click", () =>
        modalEdicao.classList.add("hidden")
    );
    cancelarEdicao.addEventListener("click", () =>
        modalEdicao.classList.add("hidden")
    );
    modalEdicao.addEventListener("click", (e) => {
        if (e.target === modalEdicao) modalEdicao.classList.add("hidden");
    });

    // Inicialização
    init(); // Chama a função de inicialização
});
