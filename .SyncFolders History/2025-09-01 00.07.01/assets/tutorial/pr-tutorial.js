// ===== PREORDINE Tutorial (solo 1 slide con bottone verde) =====
(function(){
  // Prova più nomi/estensioni per robustezza (gestisce anche il refuso .PGN)
  const candidates = [
    "/assets/tutorial/IMG01.PGN",
    "/assets/tutorial/IMG01.PNG",
    "/assets/tutorial/IMG01.png",
    "/assets/tutorial/IMG01.jpg",
    "/assets/tutorial/img1.JPG",
    "/assets/tutorial/img1.jpg",
    "/assets/tutorial/img1.png"
  ];

  function createOverlay(){
    const o = document.createElement('div');
    o.className = 'pr-tut-overlay';
    o.innerHTML = `
      <div class="pr-tut-card" role="dialog" aria-modal="true">
        <div class="pr-tut-figure">
          <img id="pr-tut-image" class="pr-tut-image" alt="Tutorial">
        </div>
        <div class="pr-tut-nav" style="justify-content:center;">
          <button id="pr-tut-start" class="pr-tut-btn pr-tut-btn--start">VAI AL PREORDINE</button>
        </div>
      </div>`;
    return o;
  }

  function mount(){
    const overlay = createOverlay();
    const img = overlay.querySelector('#pr-tut-image');
    const start = overlay.querySelector('#pr-tut-start');

    // Caricamento immagine con fallback
    let i = 0;
    img.onerror = function(){
      i++;
      if(i < candidates.length){
        img.src = candidates[i];
      }
    };
    img.src = candidates[0];

    function close(){
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      overlay.remove();
    }

    start.addEventListener('click', function(){
      // Chiudi overlay
      close();
      // Vai al programma (pagina principale)
      try {
        if (window.$ && $.mobile && typeof $.mobile.changePage === 'function'){
          $.mobile.changePage("#pageprinc");
        }
      } catch(e){ /* no-op */ }
    });

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.appendChild(overlay);
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();