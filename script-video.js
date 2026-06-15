const modalVideo = document.getElementById('modal-video');
const frameVideo = document.getElementById('frame-video');
const textoTranscricaoVideo = document.getElementById('texto-transcricao-video');
const botaoFecharVideo = document.getElementById('fechar-modal-video');
const gatilhosVideo = document.querySelectorAll('.gatilho-video');

// EDITE AQUI: transcricoes de cada video do modal.
const TRANSCRICOES_VIDEO = {};

function montarUrlEmbed(urlBruta) {
  try {
    const url = new URL(urlBruta);
    let idVideo = '';

    if (url.hostname.includes('youtu.be')) {
      idVideo = url.pathname.slice(1);
    } else if (url.hostname.includes('youtube.com')) {
      if (url.pathname.includes('/embed/')) {
        idVideo = url.pathname.split('/embed/')[1];
      } else {
        idVideo = url.searchParams.get('v') || '';
      }
    }

    idVideo = idVideo.split('?')[0].split('&')[0];
    if (!idVideo) return urlBruta;
    return `https://www.youtube.com/embed/${idVideo}?autoplay=1&mute=0&playsinline=1&rel=0&cc_load_policy=1&hl=pt-BR`;
  } catch {
    return urlBruta;
  }
}

function abrirModalVideo(gatilho) {
  const urlVideo = gatilho.dataset.urlVideo;
  const idVideo = gatilho.dataset.idVideo;
  if (!urlVideo) return;

  textoTranscricaoVideo.textContent = TRANSCRICOES_VIDEO[idVideo] || 'Transcricao ainda nao cadastrada para este video.';
  frameVideo.src = montarUrlEmbed(urlVideo);
  modalVideo.classList.add('ativo');
  document.body.classList.add('modal-aberto');
}

function fecharModalVideo() {
  frameVideo.src = '';
  modalVideo.classList.remove('ativo');
  document.body.classList.remove('modal-aberto');
}

gatilhosVideo.forEach((gatilho) => {
  gatilho.addEventListener('click', () => {
    abrirModalVideo(gatilho);
  });
});

botaoFecharVideo.addEventListener('click', fecharModalVideo);

modalVideo.addEventListener('click', (event) => {
  if (event.target === modalVideo) fecharModalVideo();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modalVideo.classList.contains('ativo')) {
    fecharModalVideo();
  }
});
