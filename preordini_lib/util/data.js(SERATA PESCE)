// data.js - Generato automaticamente da AGGIORNA LISTINO (Data: 2025-09-20T09:00:52.443318)
var elencoPrincipale = [
  "PIATTO UNICO E PRIMI",
  "SECONDI PIATTI",
  "CONTORNI E VARIE",
  "BEVANDE"
];
var categorie = [
  {
    "id": 1,
    "descrizione": "PIATTO UNICO E PRIMI"
  },
  {
    "id": 3,
    "descrizione": "SECONDI PIATTI"
  },
  {
    "id": 4,
    "descrizione": "CONTORNI E VARIE"
  },
  {
    "id": 5,
    "descrizione": "BEVANDE"
  },
  {
    "id": 6,
    "descrizione": "MENU"
  }
];
var elencoPietanze = {
  "PIATTO UNICO E PRIMI": [
    {
      "id": 54,
      "descrizione": "RISOTTO PESCE",
      "prezzo": "10"
    }
  ],
  "SECONDI PIATTI": [
    {
      "id": 52,
      "descrizione": "GRIGLIATA PESCE",
      "prezzo": "19"
    },
    {
      "id": 18,
      "descrizione": "FRITTO MISTO",
      "prezzo": "13"
    },
    {
      "id": 15,
      "descrizione": "BACCALA' ROSSO",
      "prezzo": "13"
    },
    {
      "id": 19,
      "descrizione": "FORMAGGIO",
      "prezzo": "5.5"
    }
  ],
  "CONTORNI E VARIE": [
    {
      "id": 23,
      "descrizione": "PATATINE FRITTE",
      "prezzo": "3"
    },
    {
      "id": 24,
      "descrizione": "FUNGHI",
      "prezzo": "5.5"
    },
    {
      "id": 25,
      "descrizione": "FAGIOLI",
      "prezzo": "3"
    },
    {
      "id": 26,
      "descrizione": "SUPPL. PANE",
      "prezzo": "0.5"
    },
    {
      "id": 27,
      "descrizione": "SUPPL. POLENTA",
      "prezzo": "0.5"
    }
  ],
  "BEVANDE": [
    {
      "id": 28,
      "descrizione": "ACQUA NAT. 0,50L",
      "prezzo": "1"
    },
    {
      "id": 29,
      "descrizione": "ACQUA FRIZZ. 0,50L",
      "prezzo": "1"
    },
    {
      "id": 36,
      "descrizione": "BICCH. BIRRA 0,40L",
      "prezzo": "4.5"
    },
    {
      "id": 38,
      "descrizione": "COCA-COLA LATTINA 0,33L",
      "prezzo": "2.5"
    },
    {
      "id": 37,
      "descrizione": "ARANCIATA LATTINA 0,33L",
      "prezzo": "2.5"
    },
    {
      "id": 47,
      "descrizione": "THE LATTINA 0,33L",
      "prezzo": "2.5"
    },
    {
      "id": 30,
      "descrizione": "OMBRA ROSSO",
      "prezzo": "1"
    },
    {
      "id": 31,
      "descrizione": "OMBRA BIANCO",
      "prezzo": "1"
    },
    {
      "id": 32,
      "descrizione": "CARAFFA ROSSO 0,5L",
      "prezzo": "3.5"
    },
    {
      "id": 33,
      "descrizione": "CARAFFA BIANCO 0,5L",
      "prezzo": "3.5"
    },
    {
      "id": 34,
      "descrizione": "CARAFFA ROSSO 1L",
      "prezzo": "6"
    },
    {
      "id": 35,
      "descrizione": "CARAFFA BIANCO 1L",
      "prezzo": "6"
    },
    {
      "id": 41,
      "descrizione": "BOTT.PROSECCO DOC",
      "prezzo": "10"
    },
    {
      "id": 40,
      "descrizione": "BOTT.BIANCO 0,75L",
      "prezzo": "8"
    },
    {
      "id": 39,
      "descrizione": "BOTT.ROSSO 0,75L",
      "prezzo": "8"
    }
  ],
  "MENU": []
};


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
