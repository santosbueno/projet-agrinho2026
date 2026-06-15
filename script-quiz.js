const formularioQuiz = document.getElementById('formulario-quiz');
const etapas = Array.from(document.querySelectorAll('.etapa-quiz'));
const indicadorPasso = document.getElementById('passo-quiz');
const indicadorTotal = document.getElementById('total-quiz');
const caixaResultado = document.getElementById('resultado-quiz');
const caixaAcoes = document.getElementById('acoes-quiz');
const botaoReiniciar = document.getElementById('botao-reiniciar-quiz');

const modalQuiz = document.getElementById('modal-quiz');
const botaoAbrirQuiz = document.getElementById('botao-abrir-quiz');
const botaoFecharQuiz = document.getElementById('fechar-modal-quiz');

const MENSAGENS_RESULTADO = [
  'Que bom! Voce acertou tudo e mostrou dominio do tema.',
  'Excelente! Quase la. Reveja os pontos sobre sustentabilidade.',
  'Bom esforco. Vale revisar as secoes de noticias e feira.',
  'Vamos tentar de novo. Releia o conteudo e tente novamente.'
];

function atualizarIndicadorPasso(indiceEtapa) {
  if (!indicadorPasso || !indicadorTotal) return;
  indicadorPasso.textContent = String(indiceEtapa + 1);
  indicadorTotal.textContent = String(etapas.length);
}

function obterOpcaoSelecionada(etapa) {
  const input = etapa.querySelector('input:checked');
  if (!input) return null;
  return input.closest('.opcao-quiz');
}

function atualizarEstiloSelecao(etapa) {
  const opcoes = etapa.querySelectorAll('.opcao-quiz');
  opcoes.forEach((opcao) => opcao.classList.remove('selecionado'));
  const selecionada = obterOpcaoSelecionada(etapa);
  if (selecionada) selecionada.classList.add('selecionado');
}

function atualizarBotaoProximo(etapa) {
  const botaoProximo = etapa.querySelector('.botao-proximo-quiz');
  if (!botaoProximo) return;
  const temSelecionada = Boolean(obterOpcaoSelecionada(etapa));
  botaoProximo.disabled = !temSelecionada;
}

function definirEtapaAtiva(indiceEtapa) {
  etapas.forEach((etapa, index) => {
    etapa.classList.toggle('ativo', index === indiceEtapa);
  });
  atualizarIndicadorPasso(indiceEtapa);
  const etapaAtiva = etapas[indiceEtapa];
  if (etapaAtiva) {
    atualizarEstiloSelecao(etapaAtiva);
    atualizarBotaoProximo(etapaAtiva);
  }
}

function calcularPontuacao() {
  let corretas = 0;
  etapas.forEach((etapa) => {
    const selecionada = obterOpcaoSelecionada(etapa);
    if (selecionada && selecionada.dataset.correta === 'true') {
      corretas += 1;
    }
  });
  return corretas;
}

function mostrarResultado() {
  const total = etapas.length;
  const corretas = calcularPontuacao();
  let mensagem = MENSAGENS_RESULTADO[3];
  if (corretas === total) mensagem = MENSAGENS_RESULTADO[0];
  else if (corretas >= total - 1) mensagem = MENSAGENS_RESULTADO[1];
  else if (corretas >= Math.ceil(total / 2)) mensagem = MENSAGENS_RESULTADO[2];

  caixaResultado.textContent = `Voce acertou ${corretas} de ${total}. ${mensagem} Deseja reiniciar?`;
  caixaAcoes.classList.remove('oculto');
  formularioQuiz.classList.add('finalizado');
  indicadorPasso.textContent = String(total);
}

function reiniciarQuiz() {
  formularioQuiz.reset();
  etapas.forEach((etapa) => {
    const opcoes = etapa.querySelectorAll('.opcao-quiz');
    opcoes.forEach((opcao) => opcao.classList.remove('selecionado'));
    const botaoProximo = etapa.querySelector('.botao-proximo-quiz');
    if (botaoProximo) botaoProximo.disabled = true;
  });
  caixaResultado.textContent = '';
  caixaAcoes.classList.add('oculto');
  formularioQuiz.classList.remove('finalizado');
  definirEtapaAtiva(0);
}

if (formularioQuiz) {
  formularioQuiz.addEventListener('submit', (event) => {
    event.preventDefault();
  });
}

etapas.forEach((etapa, index) => {
  const inputs = etapa.querySelectorAll('input');
  inputs.forEach((input) => {
    input.addEventListener('change', () => {
      atualizarEstiloSelecao(etapa);
      atualizarBotaoProximo(etapa);
    });
  });

  const botaoProximo = etapa.querySelector('.botao-proximo-quiz');
  if (botaoProximo) {
    botaoProximo.addEventListener('click', () => {
      if (index === etapas.length - 1) {
        mostrarResultado();
      } else {
        definirEtapaAtiva(index + 1);
      }
    });
  }
});

if (botaoReiniciar) {
  botaoReiniciar.addEventListener('click', reiniciarQuiz);
}

function abrirModalQuiz() {
  if (!modalQuiz) return;
  modalQuiz.classList.add('ativo');
  document.body.classList.add('modal-aberto');
  definirEtapaAtiva(0);
}

function fecharModalQuiz() {
  if (!modalQuiz) return;
  modalQuiz.classList.remove('ativo');
  document.body.classList.remove('modal-aberto');
}

if (botaoAbrirQuiz) {
  botaoAbrirQuiz.addEventListener('click', abrirModalQuiz);
}

if (botaoFecharQuiz) {
  botaoFecharQuiz.addEventListener('click', fecharModalQuiz);
}

if (modalQuiz) {
  modalQuiz.addEventListener('click', (event) => {
    if (event.target === modalQuiz) fecharModalQuiz();
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalQuiz && modalQuiz.classList.contains('ativo')) {
    fecharModalQuiz();
  }
});
