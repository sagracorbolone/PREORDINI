
// ===== PREORDINE Tutorial (V3, isolato e non invasivo) =====
(function(){
  const slides = [
    {
      img: "/assets/tutorial/img1.JPG",
      text: `APP PREORDINE: Questa app NON sostituisce l'ordine ma ti consente di compilare il pre-ordine comodamente dal tuo smartphone evitando di doverlo fare manualmente con il classico foglietto cartaceo del menù.
VANTAGGI: Riduzione del tempo di permanenza in cassa. Annulla il rischio di commettere errori di copiatura da parte del cassiere.`
    },
    { img: "/assets/tutorial/img2.JPG", text: "Compila i campi NOME, NUMERO TAVOLO e NUMERO COMMENSALI" },
    { img: "/assets/tutorial/img3.JPG", text: "Seleziona la categoria (es. BEVANDE, CONTORNI E VARIE, ecc.) premendo “+” o “-” per aprire o chiudere il menù a tendina di categoria. Poi premi “+” o “-” accanto alle pietanze per incrementarle o ridurle di 1 unità. Procedi fino a completamento dell’ordine." },
    { img: "/assets/tutorial/img4.JPG", text: "Premi VEDI RESOCONTO per visualizzare il riepilogo del tuo ordine valorizzato oppure ELIMINA ORDINE per azzerare la quantità di tutte le pietanze selezionate in precedenza." },
    { img: "/assets/tutorial/img5.JPG", text: "Dopo aver verificato il riepilogo dell’ordine puoi selezionare MODIFICA ORDINE per togliere o aggiungere pietanze/bibite oppure CONFERMA ORDINE per procedere." },
    { img: "/assets/tutorial/img6.JPG", text: "Quando sarà il tuo turno, recati alle casse e mostra il QR code per finalizzare l'ordine. Il cassiere verificherà la disponibilità di tutte le pietanze da te scelte e potrai procedere con il pagamento." }
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
