const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3002;
const DB_PATH = path.join(__dirname, 'db.json');

// Middleware para parsear JSON
app.use(express.json());

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rotas básicas como o professor mostrou
app.get('/', (req, res) => {
    res.send('Bem-vindo ao ECTo Do API!');
});

app.get('/hello', (req, res) => {
    res.send('API de Tarefas Acadêmicas funcionando!');
});

// CRUD de Tarefas (Atendendo aos requisitos)
// 1. CREATE - Adicionar nova tarefa
app.post('/api/tarefas', (req, res) => {
    const db = getDatabase();
    const novaTarefa = {
        id: Date.now(),
        ...req.body,
        completa: false
    };
    
    db.tarefas.push(novaTarefa);
    saveDatabase(db);
    
    res.status(201).json(novaTarefa);
});

// 2. READ - Listar todas as tarefas
app.get('/api/tarefas', (req, res) => {
    const db = getDatabase();
    res.json(db.tarefas);
});

// 3. READ - Obter uma tarefa específica
app.get('/api/tarefas/:id', (req, res) => {
    const db = getDatabase();
    const tarefa = db.tarefas.find(t => t.id == req.params.id);
    
    if (!tarefa) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    res.json(tarefa);
});

// 4. UPDATE - Atualizar uma tarefa
app.put('/api/tarefas/:id', (req, res) => {
    const db = getDatabase();
    const index = db.tarefas.findIndex(t => t.id == req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    db.tarefas[index] = { ...db.tarefas[index], ...req.body };
    saveDatabase(db);
    
    res.json(db.tarefas[index]);
});

// 5. DELETE - Remover uma tarefa
app.delete('/api/tarefas/:id', (req, res) => {
    const db = getDatabase();
    const index = db.tarefas.findIndex(t => t.id == req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Tarefa não encontrada' });
    }
    
    db.tarefas.splice(index, 1);
    saveDatabase(db);
    
    res.status(204).send();
});

// Rota para disciplinas por semestre (como no exemplo)
app.get('/api/disciplinas/:semestre', (req, res) => {
    const db = getDatabase();
    const disciplinas = db.disciplinas.filter(d => d.semestre == req.params.semestre);
    res.json(disciplinas);
});

// Rota para estatísticas (extra)
app.get('/api/estatisticas', (req, res) => {
    const db = getDatabase();
    const estatisticas = {
        total: db.tarefas.length,
        pendentes: db.tarefas.filter(t => !t.completa).length,
        concluidas: db.tarefas.filter(t => t.completa).length
    };
    res.json(estatisticas);
});

// Todas as outras rotas redirecionam para o frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Funções auxiliares para o "banco de dados"
function getDatabase() {
    if (!fs.existsSync(DB_PATH)) {
        return { tarefas: [], disciplinas: [] };
    }
    return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveDatabase(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log('Rotas disponíveis:');
    console.log('- GET    /api/tarefas');
    console.log('- POST   /api/tarefas');
    console.log('- GET    /api/tarefas/:id');
    console.log('- PUT    /api/tarefas/:id');
    console.log('- DELETE /api/tarefas/:id');
    console.log('- GET    /api/disciplinas/:semestre');
    console.log('- GET    /api/estatisticas');
});