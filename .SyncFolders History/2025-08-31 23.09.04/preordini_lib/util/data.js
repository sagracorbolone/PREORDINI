// data.js - Generato automaticamente (Data: 2025-08-31T22:44:13.471898)

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
      "descrizione": "REGINETTE CINGHIALE",
      "prezzo": "9,"
    },
    {
      "id": 3,
      "descrizione": "GNOCCHI RAGU'",
      "prezzo": "7,"
    },
    {
      "id": 4,
      "descrizione": "GNOCCHI ANATRA",
      "prezzo": "7,"
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
      "prezzo": "9,"
    },
    {
      "id": 7,
      "descrizione": "SALSICCIA",
      "prezzo": "9,"
    },
    {
      "id": 8,
      "descrizione": "MISTO",
      "prezzo": "9,"
    },
    {
      "id": 11,
      "descrizione": "PETTO DI POLLO",
      "prezzo": "8,5"
    },
    {
      "id": 14,
      "descrizione": "STINCO",
      "prezzo": "12,5"
    },
    {
      "id": 13,
      "descrizione": "CAPRIOLO E FUNGHI",
      "prezzo": "13,"
    },
    {
      "id": 15,
      "descrizione": "BACCALA'",
      "prezzo": "13,"
    },
    {
      "id": 16,
      "descrizione": "CALAMARI",
      "prezzo": "11,5"
    },
    {
      "id": 9,
      "descrizione": "COSTATA",
      "prezzo": "20,"
    },
    {
      "id": 10,
      "descrizione": "COSTATA BEN COTTA",
      "prezzo": "20,"
    },
    {
      "id": 18,
      "descrizione": "FRITTO MISTO",
      "prezzo": "12,5"
    },
    {
      "id": 21,
      "descrizione": "STRATAGLIATA",
      "prezzo": "15,"
    },
    {
      "id": 19,
      "descrizione": "FORMAGGIO",
      "prezzo": "5,5"
    },
    {
      "id": 20,
      "descrizione": "FORMAGGIO COTTO",
      "prezzo": "7,5"
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

// Inizializzazione per l'app: index.html chiama initData()
function initData(){
  try {
    if (typeof Data === 'function') { window.dataManager = new Data(); }
    window.elencoPrincipale = elencoPrincipale;
    window.categorie = categorie;
    window.elencoPietanze = elencoPietanze;
  } catch(e) { console.error('Errore in initData():', e); }
}