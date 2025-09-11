/* ===== Tutorial Onboarding (PREORDINE) ===== */
(function(){
  // Configura qui il percorso immagini
  const slides = [
    { img: "preordini/assets/tutoria/img1.JPG",
      text: "ISTRUZIONI : Questo programma permette di compilare un preordine con il proprio smartphone e si pone come alternativa al classico foglietto con il listino da compilare a mano. Prendi il numero del salta coda , compila il tuo preordine dallo smartphone e quando esce il tuo numero recati in cassa e mostra il QRcode che visualizzi a schermo per validare l’ordine , controllare che siano disponibili tutte le pietanze da te scelte e per effettuare il pagamento. Ora il tuo ordine verrà trasmesso alla cucina ." },
    { img: "preordini/assets/tutoria/img2.JPG",
      text: "Compila i campi NOME , NUMERO TAVOLO , NUMERO COMMENSALI" },
    { img: "preordini/assets/tutoria/img3.JPG",
      text: "Seleziona la categoria (BEVANDE, CONTORNI E VARIE , ecc) schiacciando il tasto “+” per aprire il menù a tendina e poi con i tasti “+” e “-” incrementa o riduci il numero di pietanze/bibite fino a completamento dell’ordine ." },
    { img: "preordini/assets/tutoria/img4.JPG",
      text: "Schiaccia il tasto “VEDI RESOCONTO” per visualizzare il riepilogo del tuo ordine valorizzato” oppure il tasto “ELIMINA ORDINE” per azzerare le quantità di tutte le pietanze selezionate in precedenza ." },
    { img: "preordini/assets/tutoria/img5.JPG",
      text: "Dopo aver verificato il riepilogo dell’ordine puoi selezionare “MODIFICA ORDINE” per togliere o aggiungere pietanze/bibite oppure “CONFERMA ORDINE”" },
    { img: "preordini/assets/tutoria/img6.JPG",
      text: "Quando sarà il tuo turno recati alle casse e mostra il QRcode per finalizzare il tuo ordine " }
  ];

  // Crea DOM overlay
  const $overlay = document.createElement('div');
  $overlay.id = 'tutorialOverlay';
  $overlay.className = 'tutorial-overlay';
  $overlay.setAttribute('role','dialog');
  $overlay.setAttribute('aria-modal','true');
  $overlay.innerHTML = `
    <div class="tutorial-card">
      <div class="tutorial-header" id="tutHeader">Benvenuto 👋</div>
      <div id="tutorialText" class="tutorial-text"></div>
      <div class="tutorial-figure">
        <img id="tutorialImage" class="tutorial-image" alt="Tutorial">
      </div>
      <div class="tutorial-nav">
        <button id="btnBack" class="tbtn tbtn-secondary">INDIETRO</button>
        <button id="btnNext" class="tbtn tbtn-primary">AVANTI</button>
        <button id="btnSkip" class="tbtn tbtn-ghost">SALTA</button>
      </div>
    </div>`;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.appendChild($overlay);

    const $text = document.getElementById('tutorialText');
    const $img  = document.getElementById('tutorialImage');
    const $back = document.getElementById('btnBack');
    const $next = document.getElementById('btnNext');
    const $skip = document.getElementById('btnSkip');

    let idx = 0;

    function setImageWithFallback(src) {
      const candidates = [src];
      try {
        const withoutExt = src.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/,'');      
        candidates.push(withoutExt + '.jpg', withoutExt + '.JPG', withoutExt + '.jpeg', withoutExt + '.JPEG', withoutExt + '.png', withoutExt + '.PNG');
      } catch(e){}
      let i = 0;
      function tryNext() {
        if (i >= candidates.length) return;
        $img.onerror = () => { i++; tryNext(); };
        $img.src = candidates[i];
      }
      tryNext();
    }

    function render() {
      const last = slides.length - 1;
      const s = slides[idx];
      $text.textContent = s.text;
      setImageWithFallback(s.img);
      $back.hidden = (idx === 0);
      $next.textContent = (idx === last) ? 'VAI AL MENÙ' : 'AVANTI';
    }

    function closeTutorial() {
      $overlay.style.display = 'none';
    }

    $back.addEventListener('click', () => { if (idx > 0) { idx--; render(); } });
    $next.addEventListener('click', () => { if (idx < slides.length - 1) { idx++; render(); } else { closeTutorial(); } });
    $skip.addEventListener('click', closeTutorial);

    render(); // avvio automatico ogni volta
  });
})();
