to-do-list/
├── server/                 # Tudo relacionado ao servidor proxy/back-end
│   ├── server.js           # Proxy (Express) + servidor de arquivos estáticos
│   └── db/                 # Dados simulados
│       └── db.json         # "Banco de dados" do json-server (CRUD automático)
│
├── public/                 # Front-end puro (arquivos estáticos)
│   ├── assets/
│   │   └── favicon.ico     # Ícone da aplicação (aba do navegador)
│   ├── css/
│   │   ├── input.css       # CSS base (onde você escreve suas classes)
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