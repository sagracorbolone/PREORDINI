// aggiornaListino.js (Node.js)

const { Client } = require('pg');
const fs = require('fs');

// =========================================================
// CONFIGURAZIONE DATABASE POSTGRESQL
// Modifica questi valori con i tuoi dati reali del database
// =========================================================
const dbConfig = {
    user: 'sagra',     // Il tuo utente PostgreSQL (es. 'postgres')
    host: 'localhost',         // L'host del tuo database (solitamente 'localhost' per DB locali)
    database: 'sagra', // Il nome del tuo database (es. 'sagra_db')
    password: 'plutarco', // La tua password PostgreSQL
    port: 5432,                // Porta di default di PostgreSQL (di solito 5432)
};

async function aggiornaListino() {
    const client = new Client(dbConfig);

    try {
        await client.connect();
        console.log('Connesso al database PostgreSQL.');

        // Query per ottenere le tipologie (categorie)
        const resCategorie = await client.query('SELECT id, descrizione FROM tipologie ORDER BY descrizione');
        const categorie = resCategorie.rows;

        const elencoPrincipale = [];
        for (const cat of categorie) {
            elencoPrincipale.push(cat.descrizione);
        }

        const elencoPietanze = {};

        // Query per ottenere gli articoli per ogni tipologia
        for (const cat of categorie) {
            // MODIFICA QUI: Rimuovi gli zeri dopo la virgola dal prezzo
            // Esempio: 10.00 diventa "10", 12.50 diventa "12.5"
            // Se un prezzo è "10.0", diventa "10." (con il punto decimale)
            // Se vuoi rimuovere anche il punto per gli interi (e.g., "10" invece di "10."), puoi usare:
            // "REPLACE(TRIM(TRAILING '0' FROM prezzo::text), '.', '')" se il risultato ti serve come stringa,
            // altrimenti TO_CHAR(prezzo, 'FM9990') per numeri interi e TO_CHAR(prezzo, 'FM9990.00') per decimali.
            // La soluzione attuale ("TRIM(TRAILING '0' FROM prezzo::text)") è un buon compromesso.
            const resArticoli = await client.query("SELECT id, descrizione, TRIM(TRAILING '0' FROM prezzo::text) as prezzo FROM articoli WHERE id_tipologia = $1 ORDER BY descrizione", [cat.id]);
            elencoPietanze[cat.descrizione] = resArticoli.rows;
        }

        // ====================================================================
        // Generazione del contenuto del file data.js
        // Verranno inclusi i dati prelevati dal DB e le funzioni Data() con i DEBUG logs
        // e le opzioni { expires: 7, path: '/', json: true } per i cookie.
        // ====================================================================
        let dataJsContent = `// data.js - Generato automaticamente da AGGIORNA LISTINO (Data: ${new Date().toISOString()})\n\n`;

        // Dati del listino (popolati dalle query al DB)
        dataJsContent += `var elencoPrincipale = ${JSON.stringify(elencoPrincipale, null, 2)};\n`;
        dataJsContent += `var categorie = ${JSON.stringify(categorie, null, 2)};\n`;
        dataJsContent += `var elencoPietanze = ${JSON.stringify(elencoPietanze, null, 2)};\n\n`;

        // Inserimento della definizione della funzione Data() con i controlli e i console.log
        dataJsContent += `
// ====================================================================
// Le funzioni sottostanti gestiscono i dati dell'ordine lato client
// e includono console.log per il debugging e le opzioni per i cookie.
// ====================================================================

function Data(){
   var riferimentoHashMap = "_hashmap";
   var riferimentoCoperti = "_coperti";

   this.getInstanceHashmap = function(){
      function recreateHashmap(value){
         console.log("DEBUG (data.js): recreateHashmap - input value:", value); // DEBUG
         var hashmap = new HashMap();
         if (value && Array.isArray(value)) { // Assicurati che 'value' sia un array valido
             for(var i = 0; i < value.length; i++){
                // Assicurati che gli oggetti all'interno dell'array abbiano le proprietà key e val
                if (value[i] && typeof value[i].key !== 'undefined' && typeof value[i].val !== 'undefined') {
                    console.log("DEBUG (data.js): recreateHashmap - Putting:", value[i].key, value[i].val); // DEBUG
                    hashmap.put(value[i].key, value[i].val);
                } else {
                    console.warn("WARNING (data.js): recreateHashmap - Invalid item in value array, skipping:", value[i]); // DEBUG
                }
             }
         } else {
             console.warn("WARNING (data.js): recreateHashmap - 'value' is not a valid array or is empty:", value); // DEBUG
         }
         console.log("DEBUG (data.js): recreateHashmap - Recreated hashmap size:", hashmap.size(), "content:", hashmap); // DEBUG
         return hashmap;
      }

      var hashmapCookieValue = $.cookie(riferimentoHashMap);
      console.log("DEBUG (data.js): getInstanceHashmap - Raw hashmap cookie value:", hashmapCookieValue); // DEBUG

      if(typeof hashmapCookieValue !== 'undefined' && hashmapCookieValue !== null && hashmapCookieValue !== ""){  //esiste e non è vuoto
         try {
             var parsedCookie = JSON.parse(hashmapCookieValue);
             console.log("DEBUG (data.js): getInstanceHashmap - Parsed cookie value:", parsedCookie); // DEBUG
             // Assicurati che parsedCookie.value esista e sia un array
             if (parsedCookie && parsedCookie.value && Array.isArray(parsedCookie.value)) {
                 return recreateHashmap(parsedCookie.value);
             } else {
                 console.error("ERROR (data.js): getInstanceHashmap - Parsed cookie does not contain a valid 'value' array. Resetting data.", parsedCookie); // DEBUG
                 // Resetta in caso di struttura del cookie non valida
                 this.deleteAllData();
                 var newHashmap = new HashMap();
                 this.saveInstanceHashmap(newHashmap);
                 return newHashmap;
             }
         } catch (e) {
             console.error("ERROR (data.js): getInstanceHashmap - Error parsing hashmap cookie. Resetting data.", e, "Raw value:", hashmapCookieValue); // DEBUG
             // Se c'è un errore di parsing (es. cookie corrotto), resettiamo.
             this.deleteAllData();
             var newHashmap = new HashMap();
             this.saveInstanceHashmap(newHashmap);
             return newHashmap;
         }
      } else {
         console.log("DEBUG (data.js): getInstanceHashmap - Hashmap cookie not found or empty, creating new hashmap."); // DEBUG
         var hashmap = new HashMap();
         this.saveInstanceHashmap(hashmap);
         return hashmap;
      }
   }

   this.saveInstanceHashmap = function(hashmap){
      console.log("DEBUG (data.js): saveInstanceHashmap - Saving hashmap to cookie. Hashmap object:", hashmap, "Value array to stringify:", hashmap.value); // DEBUG
      $.cookie(
         riferimentoHashMap,
         JSON.stringify(hashmap),
         { expires: 7, path: '/', json: true } // AGGIUNTO json: true
      );
      console.log("DEBUG (data.js): saveInstanceHashmap - Cookie saved. Current cookie value (via $.cookie):", $.cookie(riferimentoHashMap)); // DEBUG
      console.log("DEBUG (data.js): saveInstanceHashmap - Raw document.cookie after save:", document.cookie); // NUOVO DEBUG: Controlla il document.cookie raw
   }

   this.getInstanceCoperti = function(){
      var coperti = $.cookie(riferimentoCoperti);
      console.log("DEBUG (data.js): getInstanceCoperti - Raw coperti cookie value:", coperti); // DEBUG
      if(typeof coperti !== 'undefined' && coperti !== null && coperti !== ""){  //esiste e non è vuoto
         return parseInt(coperti);
      }else{
         console.log("DEBUG (data.js): getInstanceCoperti - Coperti cookie not found or empty, saving 0."); // DEBUG
         this.saveInstanceCoperti(0);
         return 0;
      }
   }

   this.saveInstanceCoperti = function(coperti){
      console.log("DEBUG (data.js): saveInstanceCoperti - Saving coperti to cookie:", coperti); // DEBUG
      $.cookie(
         riferimentoCoperti,
         coperti,
         { expires: 7, path: '/', json: true } // AGGIUNTO json: true
      );
      console.log("DEBUG (data.js): saveInstanceCoperti - Coperti cookie saved. Current cookie value (via $.cookie):", $.cookie(riferimentoCoperti)); // DEBUG
      console.log("DEBUG (data.js): saveInstanceCoperti - Raw document.cookie after save:", document.cookie); // NUOVO DEBUG: Controlla il document.cookie raw
   }

   this.deleteAllData = function(){
      console.log("DEBUG (data.js): deleteAllData - Deleting all order data (hashmap and coperti cookies)."); // DEBUG
      // Specificare il path per la rimozione, deve corrispondere al path con cui è stato salvato
      $.removeCookie(riferimentoHashMap, { path: '/' });
      $.removeCookie(riferimentoCoperti, { path: '/' });
      console.log("DEBUG (data.js): deleteAllData - Cookies removed."); // DEBUG
   }
}

var dataManager = new Data();
`;

        // ====================================================================
        // Scrittura del file data.js nel percorso specificato.
        // Assicurati che il percorso sia corretto per la tua struttura di cartelle.
        // Ho usato i forward slash '/' per la compatibilità con Node.js su Windows.
        // ====================================================================
        const outputPath = 'C:/sagra/web/preordini/preordini_lib/util/data.js'; // AGGIORNA QUESTO PERCORSO SE DIVERSO
        fs.writeFileSync(outputPath, dataJsContent);
        console.log(`File data.js generato e aggiornato con successo in: ${outputPath}`);

    } catch (err) {
        console.error('ERRORE CRITICO: Errore durante l\'aggiornamento del listino:', err);
    } finally {
        // Assicurati di chiudere sempre la connessione al database
        if (client) {
            await client.end();
            console.log('Connessione al database chiusa.');
        }
    }
}

aggiornaListino();