// data.js - Generato automaticamente da AGGIORNA LISTINO (Data: 2025-07-20T11:32:48.074267)

var elencoPrincipale = [
  "BEVANDE",
  "CONTORNI E VARIE",
  "PIATTO UNICO E PRIMI",
  "SECONDI PIATTI"
];
var categorie = [
  {
    "id": 5,
    "descrizione": "BEVANDE"
  },
  {
    "id": 4,
    "descrizione": "CONTORNI E VARIE"
  },
  {
    "id": 6,
    "descrizione": "MENU"
  },
  {
    "id": 1,
    "descrizione": "PIATTO UNICO E PRIMI"
  },
  {
    "id": 3,
    "descrizione": "SECONDI PIATTI"
  }
];
var elencoPietanze = {
  "BEVANDE": [
    {
      "id": 29,
      "descrizione": "ACQUA FRIZZ. 0,50L",
      "prezzo": "1"
    },
    {
      "id": 28,
      "descrizione": "ACQUA NAT. 0,50L",
      "prezzo": "1"
    },
    {
      "id": 37,
      "descrizione": "ARANCIATA LATTINA 0,33L",
      "prezzo": "2.5"
    },
    {
      "id": 36,
      "descrizione": "BICCH. BIRRA 0,40L",
      "prezzo": "4.5"
    },
    {
      "id": 31,
      "descrizione": "BICCH. VINO BIANCO",
      "prezzo": "1"
    },
    {
      "id": 30,
      "descrizione": "BICCH. VINO ROSSO",
      "prezzo": "1"
    },
    {
      "id": 40,
      "descrizione": "BOTT.BIANCO SELEZ.",
      "prezzo": "8"
    },
    {
      "id": 41,
      "descrizione": "BOTT.PROSECCO DOC",
      "prezzo": "10"
    },
    {
      "id": 39,
      "descrizione": "BOTT.ROSSO SELEZ",
      "prezzo": "8"
    },
    {
      "id": 33,
      "descrizione": "CARAFFA BIANCO 0,5L",
      "prezzo": "3.5"
    },
    {
      "id": 35,
      "descrizione": "CARAFFA BIANCO 1L",
      "prezzo": "6"
    },
    {
      "id": 32,
      "descrizione": "CARAFFA ROSSO 0,5L",
      "prezzo": "3.5"
    },
    {
      "id": 34,
      "descrizione": "CARAFFA ROSSO 1L",
      "prezzo": "6"
    },
    {
      "id": 38,
      "descrizione": "COCA-COLA LATTINA 0,33L",
      "prezzo": "2.5"
    },
    {
      "id": 47,
      "descrizione": "THE LATTINA 0,33L",
      "prezzo": "2.5"
    }
  ],
  "CONTORNI E VARIE": [
    {
      "id": 25,
      "descrizione": "FAGIOLI",
      "prezzo": "3"
    },
    {
      "id": 24,
      "descrizione": "FUNGHI",
      "prezzo": "5.5"
    },
    {
      "id": 23,
      "descrizione": "PATATINE",
      "prezzo": "3"
    },
    {
      "id": 26,
      "descrizione": "SUPPL. PANE",
      "prezzo": "0.5"
    },
    {
      "id": 27,
      "descrizione": "SUPPL.POLENTA",
      "prezzo": "0.5"
    }
  ],
  "MENU": [],
  "PIATTO UNICO E PRIMI": [
    {
      "id": 4,
      "descrizione": "GNOCCHI ANATRA",
      "prezzo": "6.5"
    },
    {
      "id": 3,
      "descrizione": "GNOCCHI RAGU'",
      "prezzo": "6.5"
    },
    {
      "id": 2,
      "descrizione": "PASTA CINGHIALE",
      "prezzo": "8"
    }
  ],
  "SECONDI PIATTI": [
    {
      "id": 15,
      "descrizione": "BACCALA'",
      "prezzo": "12"
    },
    {
      "id": 16,
      "descrizione": "CALAMARI",
      "prezzo": "10.5"
    },
    {
      "id": 13,
      "descrizione": "CAPRIOLO E FUNGHI",
      "prezzo": "13"
    },
    {
      "id": 6,
      "descrizione": "COSTA",
      "prezzo": "8.5"
    },
    {
      "id": 9,
      "descrizione": "COSTATA",
      "prezzo": "18"
    },
    {
      "id": 10,
      "descrizione": "COSTATA BEN COTTA",
      "prezzo": "18"
    },
    {
      "id": 19,
      "descrizione": "FORMAGGIO",
      "prezzo": "5.5"
    },
    {
      "id": 20,
      "descrizione": "FORMAGGIO COTTO",
      "prezzo": "7"
    },
    {
      "id": 18,
      "descrizione": "FRITTO MISTO",
      "prezzo": "12.5"
    },
    {
      "id": 22,
      "descrizione": "GALLETTO ALLA BRACE",
      "prezzo": "10"
    },
    {
      "id": 8,
      "descrizione": "MISTO",
      "prezzo": "8.5"
    },
    {
      "id": 11,
      "descrizione": "PETTO DI POLLO",
      "prezzo": "8.5"
    },
    {
      "id": 7,
      "descrizione": "SALSICCIA",
      "prezzo": "8.5"
    },
    {
      "id": 14,
      "descrizione": "STINCO",
      "prezzo": "12"
    },
    {
      "id": 21,
      "descrizione": "STRATAGLIATA",
      "prezzo": "14"
    },
    {
      "id": 12,
      "descrizione": "TRIPPE",
      "prezzo": "8"
    }
  ]
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
