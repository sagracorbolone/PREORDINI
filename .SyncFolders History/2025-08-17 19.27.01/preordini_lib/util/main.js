$(document).on("mobileinit", function () {
    // Disabilita il preloading e l'ajax per jQuery Mobile per evitare problemi con il caricamento delle pagine
    $.mobile.ajaxEnabled = false;
    $.mobile.linkBindingEnabled = false;
    $.mobile.hashListeningEnabled = false;
    $.mobile.pushStateEnabled = false;
});

$(document).on("pagecreate",function(event){
   
   var graphicManager = new GraphicManager();
   var dataManager = new Data();  
     
   $(document).on("pagebeforeshow","#pageprinc",function(){
      
      $("#lista").empty().append(
         graphicManager.generateMenu(
            dataManager.getInstanceHashmap()
         )
      ).collapsibleset();
      
      $("#lista").trigger("create");
      
      graphicManager.setButtonPlusMinus();
      
      $("#resoconto-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         var hashmap = dataManager.getInstanceHashmap();
         if(hashmap.isEmpty()){
            graphicManager.generatePopup(
               "#popup-ordine",
               {value: false}
            );
            $("#popup-ordine").popup("open");
         }
         else{
            dataManager.saveInstanceHashmap(hashmap);
            $.mobile.pageContainer.pagecontainer("change", "#pageres", {});
         }
      });
      
      $("#elimina-ordine-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         var txt;
         var dataElimina = {value: true, state: 0};
         
         var hashmap = dataManager.getInstanceHashmap();
         if(!hashmap.isEmpty()){
            dataElimina.state = 1;
            hashmap.makeEmpty();
            dataManager.saveInstanceHashmap(hashmap);
            hashmap = dataManager.getInstanceHashmap();
            for(var i = 0; i < elencoPrincipale.length; i++){
               var pietanze = elencoPietanze[elencoPrincipale[i]];
               for(var j = 0; j < pietanze.length; j++){
                  var id = pietanze[j].id;
                  var quantitaHtml = $("#quantita" + id);
                  var quantita = hashmap.contains(id) ? hashmap.get(id) : 0;
                  quantitaHtml.html(quantita + "");
               }
            }   
         }

         graphicManager.generatePopup(
            "#popup-ordine",
            dataElimina
         );
         
         $("#popup-ordine").popup( "open");

      });   
   });
   
   $(document).on("pagebeforeshow","#pageres",function(){ 
      var hashmap = dataManager.getInstanceHashmap();
      if(hashmap.isEmpty()){
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
         return;
      }
		var dict = {};
	  dict['nomecliente'] =  $('#nomecliente').val();
	  dict['coperti'] = $('#coperti').val();
	  dict['tavolo'] = $('#tavolo').val();
	  
      $("#resoconto").html(
         graphicManager.generateResoconto(
            hashmap, dict
         )
      );
      $("#modifica-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
      });
      $("#conferma-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         $.mobile.pageContainer.pagecontainer("change", "#pageqrcode", {});
      });
   });
   
   $(document).on("pagebeforeshow","#pageqrcode",function(){ 
      /**
      function generateTextQRCode(hashmap){
		 var nomecliente = $('#nomecliente').val();
		 var numerotavolo = $('#tavolo').val();
		 var numerocoperti = $('#coperti').val();
		 
         var obj = 'numerotavolo:::' + numerotavolo + ';;;cliente:::' + encodeURIComponent(nomecliente) + ';;;coperti:::' + numerocoperti + ';;;';    //{numeroTavolo:numerotavolo,cliente:nomecliente,coperti:numerocoperti,righe:[]};
         var keys = hashmap.keys();
         for(var i = 0; i < keys.length; i++){
			obj = obj + 'id:::' + parseInt(keys[i]) + ';;;qta:::' + hashmap.get(keys[i]) + ';;;';

         }
         return obj;
      }
	  */
	  function generateTextQRCode(hashmap){
		 var nomecliente = $('#nomecliente').val();
		 var numerotavolo = $('#tavolo').val();
		 var numerocoperti = $('#coperti').val();
		 
         var obj = {numeroTavolo:numerotavolo,cliente:nomecliente,coperti:numerocoperti,righe:[]};
         var keys = hashmap.keys();
         for(var i = 0; i < keys.length; i++){
            obj.righe.push({id:parseInt(keys[i]),qta:hashmap.get(keys[i])});
         }
         return encodeURIComponent(JSON.stringify(obj));
      }
      
      var hashmap = dataManager.getInstanceHashmap();
      
      if(hashmap.isEmpty()){
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
         return;
      }
      
      $("#nuovo-ordine-btn").click(function(evt) {
         evt.stopImmediatePropagation();
         evt.preventDefault();
         dataManager.saveInstanceHashmap(new HashMap());
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {});
      });
      
      $("#qrcode").html("");
      var qrcode = new QRCode(
         document.getElementById("qrcode"),
         {
            width: 100,
            height: 100,
            useSVG: true
         }
      );
         
      var qrCodeManager = new QRCodeManager(qrcode);
      qrCodeManager.clear();
      qrCodeManager.makeQRCode(generateTextQRCode(hashmap));
   });

});
function initializeMainApplication() {
    console.log("Inizializzazione applicazione principale...");

    // --- INIZIO: IL TUO CODICE MAIN.JS ESISTENTE ORIGINALE VA QUI SOTTO ---
    // Questo è un ESEMPIO, devi incollare il tuo vero codice!
    /*
    // Esempio di campi input che potrebbero essere generati dal tuo codice originale
    $('#user-input-fields').html(`
        <label for="nome">Inserisci il tuo nome:</label>
        <input type="text" name="nome" id="nome" value="" placeholder="Il tuo nome">
        <label for="table_number">Inserisci il numero del tavolo:</label>
        <input type="number" name="table_number" id="table_number" value="" placeholder="Numero del tavolo">
        <label for="num_people">Quanti siete?</label>
        <input type="number" name="num_people" id="num_people" value="" placeholder="Numero di persone">
    `).enhanceWithin(); // Importante per applicare gli stili JQM ai nuovi elementi

    // Supponendo che tu avessi una funzione 'init()' nel tuo main.js originale
    // che costruiva il listino e altre cose, chiamala qui.
    // SE HAI UNA FUNZIONE 'init()' CHIAMALA QUI
    init();

    // Rilega gli eventi dei pulsanti principali se il tuo codice originale lo faceva
    $("#resoconto-btn").off("click").on("click", function () {
        // La tua logica originale per il resoconto
        console.log("Pulsante Vedi resoconto cliccato!");
        $.mobile.changePage("#pageres");
    });

    $("#elimina-ordine-btn").off("click").on("click", function () {
        // La tua logica originale per eliminare l'ordine
        console.log("Pulsante Elimina ordine cliccato!");
        dataManager.deleteAllData(); // Esempio
        $("#lista").empty(); // Pulisci la lista visiva
        // Forse un refresh della pagina principale o della lista
        // window.location.reload(true); // Ricarica completa della pagina
    });

    $("#modifica-btn").off("click").on("click", function () {
        console.log("Pulsante Modifica Ordine cliccato!");
        $.mobile.changePage("#pageprinc");
    });

    $("#conferma-btn").off("click").on("click", function () {
        console.log("Pulsante Conferma Ordine cliccato!");
        // Il tuo codice per generare il QR code
        // generateQrCode(); // Esempio se hai questa funzione
        $.mobile.changePage("#pageqrcode");
    });

    $("#nuovo-ordine-btn").off("click").on("click", function () {
        console.log("Pulsante Nuovo Ordine cliccato!");
        dataManager.deleteAllData(); // Rimuovi i dati dell'ordine precedente
        $.mobile.changePage("#pageprinc", { transition: "slide", reverse: true });
        // Potresti voler ricaricare completamente la pagina per un nuovo inizio
        // window.location.reload(true);
    });
    */
    // --- FINE: IL TUO CODICE MAIN.JS ESISTENTE ORIGINALE FINISCE QUI SOPRA ---

    // Assicurati che elementi aggiunti dinamicamente vengano stilizzati da JQM
    // $('#pageprinc').enhanceWithin(); 
}


$(document).ready(function () {
    // Array delle immagini del tutorial e le loro descrizioni
    // *** PERCORSO IMMAGINI FINALMENTE CORRETTO ***
    // Se il tuo index.html è in 'C:\sagra\web\preordini\index.html'
    // e hai avviato il server da 'C:\sagra\web',
    // allora il percorso per le immagini è RELATIVO A index.html.
    // Se le immagini sono in 'C:\sagra\web\preordini\assets\tutorial\',
    // allora il percorso da index.html è 'assets/tutorial/imgX.jpg'.
    // NON USARE /preordini/assets/tutorial/ perchè il browser lo concatena male.
    const tutorialImages = [
        { src: "assets/tutorial/img1.jpg", description: "Benvenuto! Questa è la schermata principale dell'app." },
        { src: "assets/tutorial/img2.jpg", description: "Per ordinare, tocca gli elementi del menù." },
        { src: "assets/tutorial/img3.jpg", description: "Utilizza i pulsanti per aggiungere o rimuovere quantità." },
        { src: "assets/tutorial/img4.jpg", description: "Tocca 'Vedi resoconto' per controllare il tuo ordine." },
        { src: "assets/tutorial/img5.jpg", description: "Conferma l'ordine e ricevi il tuo QR Code!" }
    ];
    let currentImageIndex = 0; // Inizia dalla prima immagine

    function updateTutorialContent() {
        if (tutorialImages.length === 0) {
            console.warn("Nessuna immagine definita per il tutorial.");
            $.mobile.changePage("#pageprinc", { transition: "none" });
            return;
        }

        const currentImage = tutorialImages[currentImageIndex];
        $('#tutorial-image').attr('src', currentImage.src);
        $('#tutorial-description').text(currentImage.description);
        $('#tutorial-title').text(`Guida (${currentImageIndex + 1}/${tutorialImages.length})`);

        // Gestione visibilità pulsanti INDETRO/AVANTI
        if (currentImageIndex === 0) {
            $('#prev-tutorial-btn').hide();
        } else {
            $('#prev-tutorial-btn').show();
        }

        // Gestione testo e icona pulsante AVANTI/FINISCI
        if (currentImageIndex === tutorialImages.length - 1) {
            $('#next-tutorial-btn').text('FINISCI').removeClass('ui-icon-carat-r').addClass('ui-icon-check');
        } else {
            $('#next-tutorial-btn').text('AVANTI').removeClass('ui-icon-check').addClass('ui-icon-carat-r');
        }
        
        // Forziamo il refresh solo se il pulsante è già stato inizializzato da jQuery Mobile
        // e la pagina corrente è quella del tutorial.
        if ($('#next-tutorial-btn').hasClass('ui-btn') && $.mobile.activePage.attr("id") === "page-tutorial") {
             $('#next-tutorial-btn').button('refresh');
             $('#prev-tutorial-btn').button('refresh'); 
        }
    }

    var tutorialSeen = $.cookie('tutorial_images_seen'); // Controlla se il cookie esiste

    // Evento che si attiva quando qualsiasi pagina di jQuery Mobile è stata completamente mostrata
    $(document).on("pagecontainershow", function(e, ui) {
        // Se la pagina appena mostrata è la pagina principale
        if (ui.toPage.attr("id") === "pageprinc") {
            // Esegui il codice di inizializzazione dell'applicazione principale
            initializeMainApplication();
        }
        // Se la pagina appena mostrata è la pagina del tutorial
        else if (ui.toPage.attr("id") === "page-tutorial") {
            updateTutorialContent(); // Carica la prima immagine e aggiorna i pulsanti
        }
    });

    if (!tutorialSeen) {
        // Se il tutorial non è stato ancora visto in questa sessione
        // jQuery Mobile cambierà pagina e poi attiverà "pagecontainershow" che chiamerà updateTutorialContent
        $.mobile.changePage("#page-tutorial", { transition: "none" }); 
        
        // Gestisce il click sul pulsante "AVANTI"
        $('#next-tutorial-btn').on('click', function() {
            if (currentImageIndex < tutorialImages.length - 1) {
                currentImageIndex++;
                updateTutorialContent();
            } else {
                // Tutorial finito
                $.cookie('tutorial_images_seen', true, { expires: null }); // Imposta il cookie per la sessione corrente
                $.mobile.changePage("#pageprinc", { transition: "slide" });
            }
        });

        // Gestisce il click sul pulsante "INDIETRO"
        $('#prev-tutorial-btn').on('click', function() {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateTutorialContent();
            }
        });

        // Gestisce il click sul pulsante "SALTA"
        $('#skip-tutorial-btn').on('click', function() {
            $.cookie('tutorial_images_seen', true, { expires: null }); // Imposta il cookie
            $.mobile.changePage("#pageprinc", { transition: "slide" });
        });

    } else {
        // Se il tutorial è già stato visto in questa sessione, vai direttamente alla pagina principale
        // jQuery Mobile cambierà pagina e poi attiverà "pagecontainershow" che chiamerà initializeMainApplication
        $.mobile.changePage("#pageprinc", { transition: "none" });
    }

}); // Fine di $(document).ready


// ===== Tutorial a 6 slide (V2) =====
$(function () {
  const slides = [
    { base: "img1", text: "ISTRUZIONI : Questo programma permette di compilare un preordine con il proprio smartphone e si pone come alternativa al classico foglietto con il listino da compilare a mano. Prendi il numero del salta coda , compila il tuo preordine dallo smartphone e quando esce il tuo numero recati in cassa e mostra il QRcode che visualizzi a schermo per validare l’ordine , controllare che siano disponibili tutte le pietanze da te scelte e per effettuare il pagamento. Ora il tuo ordine verrà trasmesso alla cucina ." },
    { base: "img2", text: "Compila i campi NOME , NUMERO TAVOLO , NUMERO COMMENSALI" },
    { base: "img3", text: "Seleziona la categoria (BEVANDE, CONTORNI E VARIE , ecc) schiacciando il tasto “+” per aprire il menù a tendina e poi con i tasti “+” e “-” incrementa o riduci il numero di pietanze/bibite fino a completamento dell’ordine ." },
    { base: "img4", text: "Schiaccia il tasto “VEDI RESOCONTO” per visualizzare il riepilogo del tuo ordine valorizzato” oppure il tasto “ELIMINA ORDINE” per azzerare le quantità di tutte le pietanze selezionate in precedenza ." },
    { base: "img5", text: "Dopo aver verificato il riepilogo dell’ordine puoi selezionare “MODIFICA ORDINE” per togliere o aggiungere pietanze/bibite oppure “CONFERMA ORDINE”" },
    { base: "img6", text: "Quando sarà il tuo turno recati alle casse e mostra il QRcode per finalizzare il tuo ordine " }
  ];

  function candidatesFor(base) {
    const folder = "/assets/tutorial/"; // ROOT-RELATIVE per Netlify
    const names = [
      base + ".jpg", base + ".JPG", base + ".jpeg", base + ".JPEG",
      base.charAt(0).toUpperCase() + base.slice(1) + ".jpg",
      base.charAt(0).toUpperCase() + base.slice(1) + ".JPG",
      base.charAt(0).toUpperCase() + base.slice(1) + ".jpeg",
      base.charAt(0).toUpperCase() + base.slice(1) + ".JPEG"
    ];
    return names.map(n => folder + n);
  }

  let i = 0;
  const $img = $("#tutorial-image");
  const $title = $("#tutorial-title");
  const $desc = $("#tutorial-description");
  const $prev = $("#prev-tutorial-btn");
  const $next = $("#next-tutorial-btn");
  const $skip = $("#skip-tutorial-btn");

  function setImageWithFallback(base) {
    const list = candidatesFor(base);
    let idx = 0;
    function tryNext() {
      if (idx >= list.length) return;
      $img.off("error").on("error", function () {
        idx++;
        if (idx < list.length) $img.attr("src", list[idx]);
      });
      $img.attr("src", list[idx]);
    }
    tryNext();
  }

  function render() {
    const total = slides.length;
    const s = slides[i];
    $title.text(`Guida (${i+1}/${total})`);
    $desc.text(s.text);
    setImageWithFallback(s.base);
    if (i === 0) { $prev.attr("hidden", "hidden"); } else { $prev.removeAttr("hidden"); }
    $next.text(i === total - 1 ? "VAI AL MENÙ" : "AVANTI");
  }

  $prev.on("click", function(){ if (i>0){ i--; render(); } });
  $next.on("click", function(){
    if (i < slides.length - 1) { i++; render(); }
    else { $.mobile.changePage("#pageprinc", { transition: "slide" }); }
  });
  $skip.on("click", function(){ $.mobile.changePage("#pageprinc", { transition: "slide" }); });

  // Mostra sempre il tutorial ad ogni apertura
  $.mobile.changePage("#page-tutorial", { transition: "none" });

  $(document).on("pagecontainershow", function(e, ui){
    if (ui.toPage && ui.toPage.attr("id") === "page-tutorial") { i = 0; render(); }
  });

  // Log utile per capire perché un'immagine non si carica
  window.__logTutorial = function(){ console.log("img.src =", $img.attr("src")); };
});
