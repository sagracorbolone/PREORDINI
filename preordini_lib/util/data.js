// data.js - Generato automaticamente (Data: 2025-08-31T22:20:22.193074)

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
      "id": 2,
      "descrizione": "PASTA CINGHIALE",
      "prezzo": "8,"
    },
    {
      "id": 3,
      "descrizione": "GNOCCHI RAGU'",
      "prezzo": "6,5"
    },
    {
      "id": 4,
      "descrizione": "GNOCCHI ANATRA",
      "prezzo": "6,5"
    }
  ],
  "SECONDI PIATTI": [
    {
      "id": 12,
      "descrizione": "TRIPPE",
      "prezzo": "8,"
    },
    {
      "id": 6,
      "descrizione": "COSTA",
      "prezzo": "8,5"
    },
    {
      "id": 7,
      "descrizione": "SALSICCIA",
      "prezzo": "8,5"
    },
    {
      "id": 8,
      "descrizione": "MISTO",
      "prezzo": "8,5"
    },
    {
      "id": 11,
      "descrizione": "PETTO DI POLLO",
      "prezzo": "8,5"
    },
    {
      "id": 14,
      "descrizione": "STINCO",
      "prezzo": "12,"
    },
    {
      "id": 13,
      "descrizione": "CAPRIOLO E FUNGHI",
      "prezzo": "13,"
    },
    {
      "id": 15,
      "descrizione": "BACCALA'",
      "prezzo": "12,"
    },
    {
      "id": 16,
      "descrizione": "CALAMARI",
      "prezzo": "10,5"
    },
    {
      "id": 9,
      "descrizione": "COSTATA",
      "prezzo": "18,"
    },
    {
      "id": 10,
      "descrizione": "COSTATA BEN COTTA",
      "prezzo": "18,"
    },
    {
      "id": 21,
      "descrizione": "STRATAGLIATA",
      "prezzo": "14,"
    },
    {
      "id": 18,
      "descrizione": "FRITTO MISTO",
      "prezzo": "12,5"
    },
    {
      "id": 19,
      "descrizione": "FORMAGGIO",
      "prezzo": "5,5"
    },
    {
      "id": 20,
      "descrizione": "FORMAGGIO COTTO",
      "prezzo": "7,"
    }
  ],
  "CONTORNI E VARIE": [
    {
      "id": 23,
      "descrizione": "PATATINE",
      "prezzo": "3,"
    },
    {
      "id": 24,
      "descrizione": "FUNGHI",
      "prezzo": "5,5"
    },
    {
      "id": 25,
      "descrizione": "FAGIOLI",
      "prezzo": "3,"
    },
    {
      "id": 26,
      "descrizione": "SUPPL. PANE",
      "prezzo": "0,5"
    },
    {
      "id": 27,
      "descrizione": "SUPPL.POLENTA",
      "prezzo": "0,5"
    }
  ],
  "BEVANDE": [
    {
      "id": 28,
      "descrizione": "ACQUA NAT. 0,50L",
      "prezzo": "1,"
    },
    {
      "id": 29,
      "descrizione": "ACQUA FRIZZ. 0,50L",
      "prezzo": "1,"
    },
    {
      "id": 36,
      "descrizione": "BICCH. BIRRA 0,40L",
      "prezzo": "4,5"
    },
    {
      "id": 38,
      "descrizione": "COCA-COLA LATTINA 0,33L",
      "prezzo": "2,5"
    },
    {
      "id": 37,
      "descrizione": "ARANCIATA LATTINA 0,33L",
      "prezzo": "2,5"
    },
    {
      "id": 30,
      "descrizione": "BICCH. VINO ROSSO",
      "prezzo": "1,"
    },
    {
      "id": 31,
      "descrizione": "BICCH. VINO BIANCO",
      "prezzo": "1,"
    },
    {
      "id": 32,
      "descrizione": "CARAFFA ROSSO 0,5L",
      "prezzo": "3,5"
    },
    {
      "id": 33,
      "descrizione": "CARAFFA BIANCO 0,5L",
      "prezzo": "3,5"
    },
    {
      "id": 47,
      "descrizione": "THE LATTINA 0,33L",
      "prezzo": "2,5"
    },
    {
      "id": 34,
      "descrizione": "CARAFFA ROSSO 1L",
      "prezzo": "6,"
    },
    {
      "id": 35,
      "descrizione": "CARAFFA BIANCO 1L",
      "prezzo": "6,"
    },
    {
      "id": 41,
      "descrizione": "BOTT.PROSECCO DOC",
      "prezzo": "10,"
    },
    {
      "id": 40,
      "descrizione": "BOTT.BIANCO SELEZ.",
      "prezzo": "8,"
    },
    {
      "id": 39,
      "descrizione": "BOTT.ROSSO SELEZ",
      "prezzo": "8,"
    }
  ],
  "MENU": []
};

function Data(){
   var riferimentoHashMap = "_hashmap";
   var riferimentoCoperti = "_coperti";

   this.getInstanceHashmap = function(){
      function recreateHashmap(value){
         var hashmap = new HashMap();
         if (value && Array.isArray(value)) {
             for(var i = 0; i < value.length; i++){
                if (value[i] && typeof value[i].key !== 'undefined' && typeof value[i].val !== 'undefined') {
                    hashmap.put(value[i].key, value[i].val);
                }
             }
         }
         return hashmap;
      }
      var hashmapCookieValue = $.cookie(riferimentoHashMap);
      if(typeof hashmapCookieValue !== 'undefined' && hashmapCookieValue !== null && hashmapCookieValue !== ""){
         try {
             var parsedCookie = JSON.parse(hashmapCookieValue);
             if (parsedCookie && parsedCookie.value && Array.isArray(parsedCookie.value)) {
                 return recreateHashmap(parsedCookie.value);
             } else {
                 this.deleteAllData();
                 var newHashmap = new HashMap();
                 this.saveInstanceHashmap(newHashmap);
                 return newHashmap;
             }
         } catch (e) {
             this.deleteAllData();
             var newHashmap = new HashMap();
             this.saveInstanceHashmap(newHashmap);
             return newHashmap;
         }
      } else {
         var hashmap = new HashMap();
         this.saveInstanceHashmap(hashmap);
         return hashmap;
      }
   }

   this.saveInstanceHashmap = function(hashmap){
      $.cookie(riferimentoHashMap, JSON.stringify(hashmap), { expires: 7, path: '/', json: true });
   }

   this.getInstanceCoperti = function(){
      var coperti = $.cookie(riferimentoCoperti);
      if(typeof coperti !== 'undefined' && coperti !== null && coperti !== ""){
         return parseInt(coperti);
      }else{
         this.saveInstanceCoperti(0);
         return 0;
      }
   }

   this.saveInstanceCoperti = function(coperti){
      $.cookie(riferimentoCoperti, coperti, { expires: 7, path: '/', json: true });
   }

   this.deleteAllData = function(){
      $.removeCookie(riferimentoHashMap, { path: '/' });
      $.removeCookie(riferimentoCoperti, { path: '/' });
   }
}
