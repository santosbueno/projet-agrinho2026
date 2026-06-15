const modalNoticia = document.getElementById('modal-noticia');
const imagemModalNoticia = document.getElementById('imagem-modal-noticia');
const tituloModalNoticia = document.getElementById('titulo-modal-noticia');
const botaoFecharNoticia = document.getElementById('fechar-modal-noticia');
const botaoLerNoticia = document.getElementById('botao-ler-noticia');
const botaoLinkNoticia = document.getElementById('botao-link-noticia');
const gatilhosNoticia = document.querySelectorAll('.gatilho-noticia');

// EDITE AQUI: coloque o texto completo que deve ser lido para cada noticia.
const TEXTOS_NOTICIAS = {
  teste1:`Olá somente um texte de voz`,
  teste2:`Olá texto de voz dois`,
  conselho: `O Conselho Municipal de Desenvolvimento Rural Sustentável e Solidário realizou uma reunião 
ordinária em conjunto com a Secretaria de Agricultura e Abastecimento, com foco na discussão de ações 
e estratégias voltadas ao fortalecimento do meio rural.

Durante o encontro, foram debatidas iniciativas que buscam melhorar as condições de trabalho, ampliar o 
apoio aos produtores e promover o desenvolvimento sustentável no campo, sempre alinhadas às necessidades 
da agricultura local.

O diálogo permanente entre o Conselho e o poder público reforça o compromisso com a construção de 
políticas públicas eficientes, garantindo mais oportunidades, qualidade de vida e valorização para 
quem vive e produz no meio rural`

};

let textoNoticiaAtivo = '';
let urlNoticiaAtiva = '';

function pararLeituraNoticia() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  botaoLerNoticia.textContent = 'Ler notícia';
}

function abrirModalNoticia(gatilho) {
  const titulo = gatilho.dataset.tituloNoticia || 'Notícia';
  const imagem = gatilho.dataset.imagemNoticia || '';
  const idNoticia = gatilho.dataset.idNoticia || '';
  const urlNoticia = gatilho.dataset.urlNoticia || '';

  tituloModalNoticia.textContent = titulo;
  imagemModalNoticia.src = imagem;
  imagemModalNoticia.alt = titulo;
  textoNoticiaAtivo = TEXTOS_NOTICIAS[idNoticia] || '';
  urlNoticiaAtiva = urlNoticia;

  modalNoticia.classList.add('ativo');
  document.body.classList.add('modal-aberto');
}

function fecharModalNoticia() {
  pararLeituraNoticia();
  modalNoticia.classList.remove('ativo');
  document.body.classList.remove('modal-aberto');
  imagemModalNoticia.src = '';
  imagemModalNoticia.alt = '';
  tituloModalNoticia.textContent = '';
  urlNoticiaAtiva = '';
}

function lerNoticia() {
  if (!('speechSynthesis' in window)) {
    alert('Leitura por voz não suportada neste navegador.');
    return;
  }

  if (!textoNoticiaAtivo.trim()) {
    alert('Adicione o texto da notícia no arquivo script-noticias.js (objeto TEXTOS_NOTICIAS).');
    return;
  }

  pararLeituraNoticia();
  const leitura = new SpeechSynthesisUtterance(textoNoticiaAtivo);
  leitura.lang = 'pt-BR';
  leitura.rate = 1;
  leitura.pitch = 1;

  leitura.onstart = () => {
    botaoLerNoticia.textContent = 'Lendo...';
  };

  leitura.onend = () => {
    botaoLerNoticia.textContent = 'Ler notícia';
  };

  window.speechSynthesis.speak(leitura);
}

function abrirNoticiaCompleta() {
  if (!urlNoticiaAtiva.trim()) {
    alert('Adicione a URL da notícia no data-url-noticia do botão no index.html.');
    return;
  }

  window.open(urlNoticiaAtiva, '_blank', 'noopener');
}

gatilhosNoticia.forEach((gatilho) => {
  gatilho.addEventListener('click', () => abrirModalNoticia(gatilho));
});

botaoLerNoticia.addEventListener('click', lerNoticia);
botaoLinkNoticia.addEventListener('click', abrirNoticiaCompleta);
botaoFecharNoticia.addEventListener('click', fecharModalNoticia);

modalNoticia.addEventListener('click', (event) => {
  if (event.target === modalNoticia) fecharModalNoticia();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalNoticia.classList.contains('ativo')) {
    fecharModalNoticia();
  }
});
