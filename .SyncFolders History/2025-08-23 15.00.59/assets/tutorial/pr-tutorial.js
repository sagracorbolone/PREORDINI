
// ===== PREORDINE Tutorial (V3, isolato e non invasivo) =====
(function(){
  const slides = [
    { img: "/assets/tutorial/img1.JPG",text: "BENVENUTO NELLA NOSTRA APP PRE ORDINE ! Con questa app puoi preparare il tuo ordine direttamente dallo smartphone, dicendo addio ai menù cartacei. Ricorda che questo serve per preparare la comanda, che verrà finalizzata e pagata in cassa" },
    { img: "/assets/tutorial/img2.JPG", text: "INIZIA DAI TUOI DATI : Inserisci il tuo Nome, il Numero del Tavolo e il Numero di Commensali." },
    { img: "/assets/tutorial/img3.JPG", text: "SFOGLIA IL MENU': Usa i pulsanti “+” e “–” per aprire e chiudere le varie categorie (Bevande, Contorni, ecc.).SCEGLI COSA ORDINARE: Accanto a ogni piatto, premi “+” per aggiungere un'unità o “–” per rimuoverla" },
    { img: "/assets/tutorial/img4.JPG", text: "CONTROLLA IL TUO ORDINE: Una volta terminato, premi VEDI RESOCONTO per visualizzare il riepilogo con i prezzi. Per ricominciare da capo, puoi premere ELIMINA ORDINE." },
    { img: "/assets/tutorial/img5.JPG", text: "MODIFICA O CONFERMA: Dopo aver controllato il riepilogo, puoi tornare indietro per aggiungere o togliere qualcosa con MODIFICA ORDINE, oppure procedere premendo CONFERMA ORDINE." },
    { img: "/assets/tutorial/img6.JPG", text: "VAI ALLA CASSA: Quando è il tuo turno, recati alle casse e mostra il QR code che apparirà sullo schermo. Il nostro staff verificherà la disponibilità dei piatti scelti e potrai completare l'ordine e pagare." }
  ];

  function candidatesFor(src){
    const exts = [".jpg",".JPG",".jpeg",".JPEG",".png",".PNG"];
    const base = src.replace(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/,"");
    return [src, ...exts.map(e => base+e)];
  }

  function createOverlay(){
    const o = document.createElement('div');
    o.className = 'pr-tut-overlay';
    o.innerHTML = `
      <div class="pr-tut-card" role="dialog" aria-modal="true" aria-labelledby="pr-tut-title">
        <div id="pr-tut-title" class="pr-tut-title">Guida (1/6)</div>
        <div id="pr-tut-text" class="pr-tut-text"></div>
        <div class="pr-tut-figure">
          <img id="pr-tut-image" class="pr-tut-image" alt="Tutorial">
        </div>
        <div class="pr-tut-nav">
          <button id="pr-tut-back" class="pr-tut-btn pr-tut-btn--secondary">INDIETRO</button>
          <button id="pr-tut-skip" class="pr-tut-btn pr-tut-btn--ghost">SALTA</button>
          <button id="pr-tut-next" class="pr-tut-btn pr-tut-btn--primary">AVANTI</button>
        </div>
      </div>`;
    return o;
  }

  function mount(){
    const overlay = createOverlay();
    const img = overlay.querySelector('#pr-tut-image');
    const title = overlay.querySelector('#pr-tut-title');
    const text = overlay.querySelector('#pr-tut-text');
    const back = overlay.querySelector('#pr-tut-back');
    const next = overlay.querySelector('#pr-tut-next');
    const skip = overlay.querySelector('#pr-tut-skip');
    let i = 0;

    function setImageWithFallback(src){
      const list = candidatesFor(src);
      let k = 0;
      img.onerror = function(){ k++; if(k<list.length) img.src = list[k]; };
      img.src = list[0];
    }

    function render(){
      const total = slides.length;
      const s = slides[i];
      title.textContent = `Guida (${i+1}/${total})`;
      text.textContent = s.text;
      setImageWithFallback(s.img);
      back.hidden = (i === 0);
      next.textContent = (i === total-1) ? "VAI AL MENÙ" : "AVANTI";
    }

    function close(){
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      overlay.remove();
    }

    back.addEventListener('click', () => { if(i>0){ i--; render(); } });
    next.addEventListener('click', () => {
      if(i < slides.length-1){ i++; render(); }
      else { close(); }
    });
    skip.addEventListener('click', close);

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.appendChild(overlay);
    render();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
