async function carregarProdutos() {
  const response = await fetch('/api/produtos');
  if (!response.ok) throw new Error('Erro ao carregar produtos');
  return response.json();
}

async function renderProdutos(categoria = 'all') {
  const container = document.getElementById('lista-produtos');
  if (!container) return;

  try {
    const produtos = await carregarProdutos();
    const filtrados = categoria === 'all'
      ? produtos
      : produtos.filter((produto) => produto.categoria === categoria);

    container.innerHTML = filtrados.length
      ? filtrados.map((produto) => `
        <article class="card ${produto.categoria === 'livros' ? 'featured-product' : ''}">
          <p class="eyebrow">${produto.categoria}</p>
          <h3>${produto.nome}</h3>
          <p>${produto.descricao}</p>
          <p class="text-link">⭐ ${produto.avaliacao || '4.7/5'} • ${produto.veredito || 'Vale a pena'}</p>
          <p><strong>${produto.preco}</strong></p>
          <a class="btn btn-primary" href="produto.html?id=${produto.id}">Ver avaliação completa</a>
        </article>
      `).join('')
      : '<p>Nenhum produto encontrado para esta categoria.</p>';
  } catch (error) {
    container.innerHTML = `<p>Erro ao carregar produtos: ${error.message}</p>`;
  }
}

async function renderProduto(id) {
  const titulo = document.getElementById('produto-titulo');
  const nome = document.getElementById('produto-nome');
  const descricao = document.getElementById('produto-descricao');
  const categoria = document.getElementById('produto-categoria');
  const pontos = document.getElementById('produto-pontos');
  const link = document.getElementById('produto-link');
  const avaliacao = document.getElementById('produto-avaliacao');
  const veredito = document.getElementById('produto-veredito');
  const imagem = document.getElementById('produto-imagem');
  const card = document.querySelector('.product-card');

  if (!titulo || !nome || !descricao || !categoria || !pontos || !link) return;

  try {
    const produtos = await carregarProdutos();
    const produto = produtos.find((item) => String(item.id) === String(id));

    if (!produto) {
      titulo.textContent = 'Produto não encontrado';
      nome.textContent = 'Nenhum item encontrado';
      descricao.textContent = 'O produto solicitado não está disponível no catálogo.';
      return;
    }

    titulo.textContent = produto.nome;
    nome.textContent = produto.nome;
    descricao.textContent = produto.descricao;
    categoria.textContent = produto.categoria;
    pontos.innerHTML = (produto.pontos || []).map((item) => `<li>✔ ${item}</li>`).join('');
    if (avaliacao) avaliacao.textContent = `⭐ ${produto.avaliacao || '4.7/5'}`;
    if (veredito) veredito.textContent = produto.veredito || 'Vale a pena comprar';
    if (imagem) {
      imagem.src = produto.imagem || '';
      imagem.style.display = produto.imagem ? 'block' : 'none';
    }
    if (card) {
      card.classList.toggle('featured-product-detail', produto.categoria === 'livros');
    }
    link.href = produto.link_afiliado;
    link.textContent = `Ver preço na Amazon — ${produto.preco}`;
  } catch (error) {
    titulo.textContent = 'Erro ao carregar';
    nome.textContent = 'Não foi possível carregar o produto';
    descricao.textContent = error.message;
  }
}
