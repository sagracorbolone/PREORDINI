$(document).on("pagecreate",function(event){
   
   var graphicManager = new GraphicManager();
   var dataManager = new Data();  
     
   $(document).on("pagebeforeshow","#pageprinc",function(){
      // --- INIZIO NUOVA LOGICA DI CONTROLLO DATA E CACHE BUSTING (AGGIUNTA QUI) ---
      var ultimaDataCaricata = $.cookie('data_ultima_generazione_listino'); // Legge il cookie dell'ultima data del listino caricato dal browser
      
      // dataGenerazioneListino è la variabile globale che viene da data.js (generata da AggiornaListino.py)
      // Usiamo un fallback a stringa vuota se per qualche motivo non fosse definita (es. file data.js corrotto)
      var dataGenerazioneCorrente = typeof dataGenerazioneListino !== 'undefined' ? dataGenerazioneListino : '';

      // Se non c'è un cookie OPPURE la data memorizzata è DIVERSA dalla data di generazione del listino corrente
      // (Questo significa che il listino sul server è stato aggiornato rispetto all'ultima volta che l'utente ha usato l'app)
      if (!ultimaDataCaricata || ultimaDataCaricata !== dataGenerazioneCorrente) {
          console.log("Rilevato nuovo listino (data di generazione: " + dataGenerazioneCorrente + "). Forzo l'aggiornamento.");
          
          // 1. Elimina tutti i cookie relativi all'ordine precedente
          dataManager.deleteAllData(); // Usa la funzione esistente di Data per pulire i cookie
          // Equivalente a:
          // $.removeCookie('_hashmap', { path: '/' }); 
          // $.removeCookie('_coperti', { path: '/' });

          // 2. Aggiorna il cookie con la data di generazione del listino appena caricato
          // Questo indica che per oggi (o per questa versione del listino) abbiamo caricato i dati "freschi"
          $.cookie('data_ultima_generazione_listino', dataGenerazioneCorrente, { expires: 365, path: '/' }); 

          // 3. Forza il ricaricamento completo della pagina per bypassare la cache
          // Aggiunge un timestamp unico all'URL per assicurarsi che il browser richieda
          // tutti i file (incluso data.js) di nuovo dal server.
          console.log("Ricarico la pagina per assicurare i dati più recenti...");
          window.location.href = window.location.pathname + "?_ts=" + new Date().getTime(); 
          return; // Importante: ferma l'esecuzione del resto del pagebeforeshow per evitare problemi
      }
      // --- FINE NUOVA LOGICA DI CONTROLLO DATA E CACHE BUSTING ---
      
      // Il resto del codice qui sotto viene eseguito solo se la data NON è cambiata
      // o dopo che la pagina è stata ricaricata con i dati freschi.
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
            // RIGA COMMENTATA (ERA RIDONDANTE): hashmap = dataManager.getInstanceHashmap(); 
            for(var i = 0; i < elencoPrincipale.length; i++){
               var pietanze = elencoPietanze[elencoPrincipale[i]];
               for(var j = 0; j < pietanze.length; j++){
                  var id = pietanze[j].id;
                  var quantitaHtml = $("#quantita" + id);
                  // Dopo makeEmpty e saveInstanceHashmap, getInstanceHashmap restituirà un hashmap vuoto,
                  // quindi quantita sarà 0. Questa logica è corretta.
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
       * Funzione originale commentata per coerenza con il resto del tuo codice.
       * generateTextQRCode usa JSON.stringify per una migliore compatibilità.
       * * function generateTextQRCode(hashmap){
       * var nomecliente = $('#nomecliente').val();
       * var numerotavolo = $('#tavolo').val();
       * var numerocoperti = $('#coperti').val();
       * * var obj = 'numerotavolo:::' + numerotavolo + ';;;cliente:::' + encodeURIComponent(nomecliente) + ';;;coperti:::' + numerocoperti + ';;;';   //{numeroTavolo:numerotavolo,cliente:nomecliente,coperti:numerocoperti,righe:[]};
       * var keys = hashmap.keys();
       * for(var i = 0; i < keys.length; i++){
       * obj = obj + 'id:::' + parseInt(keys[i]) + ';;;qta:::' + hashmap.get(keys[i]) + ';;;';
       * }
       * return obj;
       * }
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
      
      // --- MODIFICA DEL PULSANTE "NUOVO ORDINE" (UNIFICATA LA LOGICA CON "ELIMINA ORDINE") ---
      $("#nuovo-ordine-btn").off('click').on('click', function(evt) { // Usiamo .off().on() per sicurezza
         evt.stopImmediatePropagation();
         evt.preventDefault();
         
         // Resetta l'ordine corrente salvato nei cookie
         dataManager.deleteAllData(); // Usa la funzione esistente per pulire i cookie
         // Equivalente a:
         // dataManager.saveInstanceHashmap(new HashMap()); 
         // $.removeCookie('_hashmap', { path: '/' });
         // $.removeCookie('_coperti', { path: '/' });

         // Reindirizza alla pagina principale.
         // La logica di controllo della data in '#pageprinc' si occuperà di forzare un ricaricamento completo
         // se necessario (ma in questo caso, non cambierà il listino se è lo stesso giorno).
         $.mobile.pageContainer.pagecontainer("change", "#pageprinc", {
             transition: "slide",
             reverse: true
         });
      });
      // --- FINE MODIFICA DEL PULSANTE "NUOVO ORDINE" ---
      
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