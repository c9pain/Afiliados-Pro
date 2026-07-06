const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const produtosPath = path.join(__dirname, '..', 'data', 'produtos.json');

function lerProdutos() {
  return JSON.parse(fs.readFileSync(produtosPath, 'utf8'));
}

function salvarProdutos(produtos) {
  fs.writeFileSync(produtosPath, JSON.stringify(produtos, null, 2));
}

app.get('/api/produtos', (req, res) => {
  res.json(lerProdutos());
});

app.get('/api/produto/:id', (req, res) => {
  const produtos = lerProdutos();
  const produto = produtos.find((item) => String(item.id) === String(req.params.id));
  if (!produto) {
    return res.status(404).json({ message: 'Produto não encontrado' });
  }
  res.json(produto);
});

app.post('/api/produtos', (req, res) => {
  const produtos = lerProdutos();
  const novoProduto = {
    id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
    nome: req.body.nome,
    descricao: req.body.descricao,
    preco: req.body.preco,
    categoria: req.body.categoria,
    link_afiliado: req.body.link_afiliado,
    pontos: ['Novo item', 'Em análise']
  };

  produtos.push(novoProduto);
  salvarProdutos(produtos);

  res.status(201).json({ message: 'Produto salvo com sucesso', produto: novoProduto });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.get('/categoria.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'categoria.html'));
});

app.get('/produto.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'produto.html'));
});

app.get('/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'blog.html'));
});

app.get('/admin/painel.html', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin', 'painel.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
