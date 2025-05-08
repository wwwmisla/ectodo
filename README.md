# ECTo Do

***ECTo Do*** é um aplicativo de gerenciamento de tarefas acadêmicas desenvolvido para ajudar estudantes da Escola de Ciências e Tecnologia (ECT/UFRN) a organizarem suas disciplinas, trabalhos e prazos.

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

## 🛠️ Tecnologias Utilizadas

### Front-end
- HTML5
- CSS3 (com Tailwind CSS)
- JavaScript

### Back-end
- Node.js
- JSON Server

## 📂 Estrutura do Projeto

```bash
to-do-list/
├── server/                 # Tudo relacionado ao servidor proxy/back-end
│   ├── server.js           # Proxy (Express) + servidor de arquivos estáticos
│   └── db/                 # Dados simulados
│       └── db.json         # "Banco de dados" do json-server (CRUD)
│
├── public/                 # Front-end puro (arquivos estáticos)
│   ├── assets/
│   │   └── favicon/        # Ícones da aplicação (aba do navegador)
│   ├── css/
│   │   ├── input.css       # CSS base 
│   │   └── styles.css      # CSS compilado pelo Tailwind (output final)
│   ├── js/
│   │   └── script.js       # Lógica JavaScript (eventos, fetch, etc.)
│   └── index.html          # HTML principal (Single-Page Application)
│
├── package.json            # Configuração do projeto: dependências e scripts (npm start, npm run dev)
├── package-lock.json       # Versões exatas das dependências (gerado automaticamente)
├── postcss.config.js       # Configuração do PostCSS (processador de CSS para Tailwind)
├── tailwind.config.js      # Configura temas, cores e plugins do Tailwind CSS
├── .gitignore              # Arquivos/pastas ignorados pelo Git (ex: node_modules)
└── README.md               # Documentação do projeto: como instalar, usar e deployar
```