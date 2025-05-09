# ECTo Do

## 📝 Descrição do Projeto

**_ECTo Do_** é um aplicativo de gerenciamento de tarefas acadêmicas desenvolvido para ajudar estudantes da Escola de Ciências e Tecnologia (ECT/UFRN) a organizarem suas disciplinas, trabalhos e prazos.

## ✨ Funcionalidades

- ✅ **CRUD completo** de tarefas
- 🔍 **Filtros avançados** por:
  - 📅 Semestre
  - 📚 Disciplina
  - ⚠️ Prioridade
  - 🏷️ Categoria
  - 📌 Status
- 📊 **Estatísticas** de desempenho
- 🎨 Interface **responsiva** e acessível

## ✅ Requisitos Atendidos

| Requisito                    | Implementação                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| **_CRUD_** completo          | Create **_(POST)_**, Read **_(GET)_**, Update **_(PUT/PATCH)_**, Delete **_(DELETE)_** |
| Comunicação cliente-servidor | Uso do `fetch()` para todas as operações                                               |
| Formatação com CSS           | Tailwind CSS para estilização responsiva                                               |
| Múltiplos eventos JavaScript | `DOMContentLoaded`, `submit`, `change`, `click`                                        |
| Validação de formulários     | Validação no cliente antes do envio                                                    |

## 📂 Estrutura do Projeto

```bash
to-do-list/
├── public/                 # Front-end puro (arquivos estáticos)
│   ├── assets/
│   │   └── favicon/        # Ícones da aplicação (aba do navegador)
│   ├── css/
│   │   ├── input.css       # CSS base
│   │   └── styles.css      # CSS compilado pelo Tailwind (output final)
│   ├── js/
│   │   └── script.js       # Lógica JavaScript (eventos, fetch, etc.)
│   └── index.html          # HTML principal (Single-Page Application)
├── server/                 # Tudo relacionado ao servidor proxy/back-end
│   ├── server.js           # Proxy (Express) + servidor de arquivos estáticos
│   └── db/                 # Dados simulados
│       └── db.json         # "Banco de dados" do json-server (CRUD)
├── .gitignore              # Arquivos/pastas ignorados pelo Git (ex: node_modules)
├── LICENSE                 # Licença
├── package.json            # Configuração do projeto: dependências e scripts (npm start, npm run dev)
├── package-lock.json       # Versões exatas das dependências (gerado automaticamente)
├── postcss.config.js       # Configuração do PostCSS (processador de CSS para Tailwind)
├── README.md               # Documentação do projeto: como instalar, usar e deployar
└── tailwind.config.js      # Configura temas, cores e plugins do Tailwind CSS
```

## 🛠️ Tecnologias Utilizadas

#### Front-end (Interface gráfica)

- HTML5
- CSS3 (com Tailwind CSS)
- JavaScript

#### Back-end (Servidor WEB)

- Node.js
- JSON Server

## ✨ Funcionalidades Implementadas

- Operações CRUD

  - Criação de novas tarefas acadêmicas
  - Leitura e listagem de tarefas
  - Atualização de tarefas existentes
  - Exclusão de tarefas

- Filtros Avançados

  - Por status (Todos/Pendentes/Concluídos)

- Outras Features

  - Estatísticas de desempenho

  - Interface responsiva

- Validação de formulários

- Modal de edição

## 🔍 Detalhamento Técnico

#### Comunicação Cliente-Servidor

```javascript
// Exemplo de uso do fetch()
async function carregarTarefas() {
  const resposta = await fetch("http://localhost:3000/tarefas");
  return await resposta.json();
}
```

#### Validação de formulário

```javascript
// Validação antes do envio
if (titulo.length < 6) {
  alert("O título deve ter pelo menos 6 caracteres");
  return;
}
```

#### Eventos JavaScript

- DOMContentLoaded: Inicialização da aplicação

- submit: Envio de formulários

- change: Atualização de filtros e status

- click: Interações com botões

## 📝 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👩‍💻 Desenvolvedora

[Misla Wislaine](https://github.com/wwwmisla)


Espero que o projeto te ajude e inspire a criar mais coisas legais! ✨