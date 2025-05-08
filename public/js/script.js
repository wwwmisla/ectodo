document.addEventListener('DOMContentLoaded', () => {
    // URL base da API
    const API_URL = 'http://localhost:3000';
    const API_URL_TAREFAS = `${API_URL}/tarefas`;
    const API_URL_DISCIPLINAS = `${API_URL}/disciplinas`;

    // Elementos do DOM
    const tarefaForm = document.getElementById('tarefa-form');
    const tarefasContainer = document.getElementById('tarefas-container');
    const mensagemSemTarefas = document.getElementById('mensagem-sem-tarefa');

    // Filtros
    const filtroSemestre = document.getElementById('filtro-semestre');
    const filtroDisciplina = document.getElementById('filtro-disciplina');
    const filtroCategoria = document.getElementById('filtro-categoria');
    const filtroPrioridade = document.getElementById('filtro-prioridade');
    const filtroStatus = document.getElementById('filtro-status');

    // Estatísticas
    const totalTarefas = document.getElementById('total-tarefas');
    const tarefasCompletas = document.getElementById('total-concluidas');
    const tarefasPendentes = document.getElementById('total-pendentes');

    // Modal de Edição
    const modalEdicao = document.getElementById('modal-edicao');
    const editarForm = document.getElementById('editar-form');
    const fecharModal = document.getElementById('fechar-modal');
    const cancelarEdicao = document.getElementById('cancelar-edicao');

    // Função para inicializar a aplicação
    async function init() {
        try {
            await carregarDisciplinas();
            await carregarTarefas();
            await atualizarEstatisticas();

            console.log('Aplicação inicializada com sucesso!'); // Log de sucesso
        } catch (error) {
            console.error('Erro na inicialização:', error);
            mensagemSemTarefas.textContent = 'Erro ao carregar tarefas. Recarregue a página.'; // Mensagem de erro
            mensagemSemTarefas.classList.remove('hidden');
        }
    }

    // Carregar disciplinas no select
    async function carregarDisciplinas(semestreSelecionado) {
        const disciplinas = await lerDisciplinas();
        const selectDisciplina = document.getElementById('disciplina');

        // Limpa as opções anteriores
        selectDisciplina.innerHTML = '<option value="">Selecione uma disciplina</option>';

        // Filtra por semestre e adiciona ao select
        disciplinas
            .filter(d => d.semestre == semestreSelecionado)
            .forEach(disciplina => {
                const option = document.createElement('option');
                option.value = disciplina.id;
                option.textContent = disciplina.nome;
                selectDisciplina.appendChild(option);
            });

        // Ativa o select
        selectDisciplina.disabled = false;
        selectDisciplina.classList.remove('bg-gray-100'); // Remove a classe de desabilitado
    }

    // Carregar tarefas no DOM
    async function carregarTarefas() {
        try {
            // Construir URL com filtros
            let url = API_URL_TAREFAS;
            const resposta = await fetch(url); // Faz a requisição com os filtros
            const tarefas = await resposta.json(); // Converte a resposta em JSON

            tarefasContainer.innerHTML = ''; // Limpa o container de tarefas

            if (tarefas.length === 0) {
                mensagemSemTarefas.classList.remove('hidden'); // Exibe mensagem se não houver tarefas
                return;
            } else {
                mensagemSemTarefas.classList.add('hidden'); // Esconde mensagem se houver tarefas
                tarefas.forEach(tarefa => {
                    const tarefaElement = criarElementoTarefa(tarefa); // Cria o elemento da tarefa
                    tarefasContainer.appendChild(tarefaElement); // Adiciona ao container

                    tarefaElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // Rola para a tarefa recém-criada
                });
                atualizarEstatisticas(); // Atualiza as estatísticas
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error); // Loga erro no consoleF
        }
    }

    // Função básica para criar tarefas (POST - CREATE) | Esta função envia uma requisição POST para criar uma nova tarefa no servidor
    async function criarTarefa(dados) {
        try {
            const resposta = await fetch(API_URL_TAREFAS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });
            return await resposta.json(); // Retorna a tarefa criada
        }
        catch (error) {
            console.error('Erro ao criar tarefa:', error); // Log erro no console
        }
    }

    // Função para ler tarefas (GET - READ) | Esta função envia uma requisição GET para obter todas as tarefas do servidor
    async function lerTarefas() {
        try {
            const resposta = await fetch(API_URL_TAREFAS);
            return await resposta.json();
        } catch (error) {
            console.error('Erro ao carregar tarefas:', error); // Log erro no console
        }
    }

    // Função para ler disciplinas (GET - READ) | Esta função envia uma requisição GET para obter todas as disciplinas do servidor
    async function lerDisciplinas() {
        try {
            const resposta = await fetch(API_URL_DISCIPLINAS);
            return await resposta.json();
        } catch (error) {
            console.error('Erro ao carregar disciplinas:', error); // Log erro no console
        }
    }

    // Função para deletar tarefas (DELETE - DELETE) | Esta função envia uma requisição DELETE para remover uma tarefa do servidor
    async function deletarTarefa(id) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

        try {
            await fetch(`${API_URL_TAREFAS}/${id}`, { method: 'DELETE' });
            console.log('Tarefa excluída com sucesso!');

            await carregarTarefas(); // Recarrega todas as tarefas
            atualizarEstatisticas();
        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
        }
    }

    // Vinculando ao formulário
    async function adicionarTarefa(event) {
        event.preventDefault();

        const dados = {
            titulo: document.getElementById('titulo').value,
            descricao: document.getElementById('descricao').value,
            semestre: document.getElementById('semestre').value,
            disciplina: document.getElementById('disciplina').options[document.getElementById('disciplina').selectedIndex].text,
            categoria: document.getElementById('categoria').value,
            prioridade: document.getElementById('prioridade').value,
            dataEntrega: document.getElementById('dataEntrega').value,
            completa: false
        };

        const tarefa = await criarTarefa(dados); // Chama a função para criar a tarefa
        tarefaForm.reset(); // Limpa o formulário
        console.log('Tarefa criada:', tarefa);
        carregarTarefas(); // Recarrega as tarefas após a criação
    }

    // Alternar status da tarefa (PUT - UPDATE)
    async function atualizarStatusTarefa(id, status) {
        try {
            await fetch(`${API_URL_TAREFAS}/${id}`, {
                method: 'PATCH', // Usando PATCH para atualizar apenas o status
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completa: status })
            });

            atualizarEstatisticas(); // Atualiza as estatísticas após a mudança de status
        } catch (error) {
            console.error('Erro ao atualizar status da tarefa:', error);
        }
    }

    // Criar elemento HTML para uma tarefa
    function criarElementoTarefa(tarefa) {
        const tarefaElement = document.createElement('div');
        tarefaElement.className = 'border border-gray-300 rounded-lg p-4 mb-4 shadow-md bg-white hover:bg-gray-50 transition duration-200 ease-in-out';
        tarefaElement.dataset.id = tarefa.id; // Adiciona o ID da tarefa como atributo de dados

        // Determinar classes de prioridade
        let prioridadeClasse = 'bg-gray-200'; // Classe padrão
        if (tarefa.prioridade === 'alta') prioridadeClasse
            = 'bg-red-200';
        else if (tarefa.prioridade === 'media') prioridadeClasse = 'bg-yellow-200';
        else if (tarefa.prioridade === 'baixa') prioridadeClasse = 'bg-green-200';

        // Data formatada
        const dataFormatada = tarefa.dataEntrega ? new Date(tarefa.dataEntrega).toLocaleDateString('pt-BR') : 'Sem data definida';

        tarefaElement.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex items-center">
                    <input type="checkbox" ${tarefa.completa ? 'checked' : ''}
                        class="h-5 w-5 text-universidade-accent rounded focus:ring-universidade-accent mr-3 checkbox-status" title="Marcar tarefa como concluída">
                    <div>
                        <h3 class="text-lg font-medium ${tarefa.completa ? 'line-through text-gray-400' : 'text-gray-800'}">
                            ${tarefa.titulo}
                        </h3>
                        ${tarefa.descricao ? `<p class="text-gray-600 mt-1">${tarefa.descricao}</p>` : ''}
                    </div>
                </div>
                <div class="flex space-x-2">
                    <button class="text-universidade-accent hover:text-blue-700 btn-editar" title="Editar tarefa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="text-red-500 hover:text-red-700 btn-deletar" title="Deletar tarefa">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            
            <div class="mt-3 flex flex-wrap gap-2 text-sm">
                ${tarefa.disciplina ? `
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                        <i class="fas fa-book mr-1"></i>${tarefa.disciplina}
                    </span>
                ` : ''}
                
                ${tarefa.categoria ? `
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                        <i class="fas fa-tag mr-1"></i>${tarefa.categoria}
                    </span>
                ` : ''}
                
                <span class="px-2 py-1 ${prioridadeClasse} rounded-full">
                    <i class="fas fa-exclamation-circle mr-1"></i>${tarefa.prioridade.charAt(0).toUpperCase() + tarefa.prioridade.slice(1)}
                </span>
                
                <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                    <i class="far fa-calendar-alt mr-1"></i>${dataFormatada}
                </span>
            </div>
        `;

        // Adiciona eventos aos botões e checkbox
        // tarefaElement.querySelector('.btn-editar').addEventListener('click', () => abrirModalEdicao(tarefa));
        tarefaElement.querySelector('.btn-deletar').addEventListener('click', () => deletarTarefa(tarefa.id));
        tarefaElement.querySelector('.checkbox-status').addEventListener('change', (e) => {
            const status = e.target.checked;
            atualizarStatusTarefa(tarefa.id, status);
        });

        return tarefaElement;
    }

    // Abrir modal de edição
    async function abrirModalEdicao(tarefa) {
        document.getElementById('editar-id').value = tarefa.id;
        document.getElementById('editar-titulo').value = tarefa.titulo;
        document.getElementById('editar-descricao').value = tarefa.descricao || '';

        // Selecionar disciplina
        const editarDisciplina = document.getElementById('editar-disciplina');
        for (let i = 0; i < editarDisciplina.options.length; i++) {
            if (editarDisciplina.options[i].text === tarefa.disciplina) {
                editarDisciplina.selectedIndex = i;
                break;
            }
        }

        document.getElementById('editar-categoria').value = tarefa.categoria;
        document.getElementById('editar-prioridade').value = tarefa.prioridade;
        document.getElementById('editar-data').value = tarefa.dataEntrega;
        document.getElementById('editar-completa').checked = tarefa.completa;

        modalEdicao.classList.remove('hidden');
    }

    // Event Listeners
    tarefaForm.addEventListener('submit', adicionarTarefa);
    const selectSemestre = document.getElementById('semestre');
    selectSemestre.addEventListener('change', (e) => {
        const semestreSelecionado = e.target.value;
        if (semestreSelecionado) {
            carregarDisciplinas(semestreSelecionado);
        } else {
            // Se resetar o semestre, desativa o select de disciplinas
            const selectDisciplina = document.getElementById('disciplina');
            selectDisciplina.innerHTML = '<option value="">Selecione o semestre primeiro</option>';
            selectDisciplina.disabled = true;
        }
    });

    // Atualizar estatísticas (Total, Completas e Pendentes)
    async function atualizarEstatisticas() {
        try {
            const tarefas = await lerTarefas();
            const total = tarefas.length;
            const completas = tarefas.filter(t => t.completa).length;
            const pendentes = total - completas;

            totalTarefas.textContent = `${total}`;
            tarefasCompletas.textContent = `${completas}`;
            tarefasPendentes.textContent = `${pendentes}`;
        }
        catch (error) {
            console.error('Erro ao atualizar estatísticas:', error);
        }
    }

    // Modal
    fecharModal.addEventListener('click', () => modalEdicao.classList.add('hidden'));
    cancelarEdicao.addEventListener('click', () => modalEdicao.classList.add('hidden'));
    modalEdicao.addEventListener('click', (e) => {
        if (e.target === modalEdicao) modalEdicao.classList.add('hidden');
    });

    // Inicialização 
    init(); // Chama a função de inicialização
});