# aggiornaListino.py

import psycopg2
import json
import os
from datetime import datetime
import tkinter as tk
from tkinter import messagebox

# =========================================================
# CONFIGURAZIONE DATABASE POSTGRESQL
# Modifica questi valori con i tuoi dati reali del database
# =========================================================
db_config = {
    'user': 'sagra',     # Il tuo utente PostgreSQL (es. 'postgres')
    'host': 'localhost',         # L'host del tuo database (solitamente 'localhost' per DB locali)
    'database': 'sagra', # Il nome del tuo database (es. 'sagra_db')
    'password': 'plutarco', # La tua password PostgreSQL
    'port': 5432,                # Porta di default di PostgreSQL (di solito 5432)
}

def aggiorna_listino():
    conn = None
    try:
        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()
        print('Connesso al database PostgreSQL.')

        # Query per ottenere le tipologie (categorie)
        cur.execute('SELECT id, descrizione FROM tipologie ORDER BY descrizione')
        categorie_rows = cur.fetchall()
        categorie = [{'id': row[0], 'descrizione': row[1]} for row in categorie_rows]

        all_pietanze = []
        elenco_pietanze_db = {} # Per mantenere la struttura originale come dal DB
        
        # Query per ottenere gli articoli per ogni tipologia
        for cat in categorie:
            cur.execute("SELECT id, descrizione, TRIM(TRAILING '0' FROM prezzo::text) as prezzo FROM articoli WHERE id_tipologia = %s ORDER BY descrizione", (cat['id'],))
            articoli_rows = cur.fetchall()
            current_category_pietanze = []
            for row in articoli_rows:
                pietanza = {'id': row[0], 'descrizione': row[1], 'prezzo': row[2], 'id_tipologia': cat['id'], 'tipologia_desc': cat['descrizione']}
                all_pietanze.append(pietanza)
                current_category_pietanze.append({'id': row[0], 'descrizione': row[1], 'prezzo': row[2]})
            elenco_pietanze_db[cat['descrizione']] = current_category_pietanze

        # --- Finestra di selezione GUI ---
        root = tk.Tk()
        root.title("Seleziona Pietanze da includere nel Listino")
        
        # Frame per i checkbox
        checkbox_frame = tk.Frame(root)
        checkbox_frame.pack(padx=10, pady=10)

        canvas = tk.Canvas(checkbox_frame)
        scrollbar = tk.Scrollbar(checkbox_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = tk.Frame(canvas)

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(
                scrollregion=canvas.bbox("all")
            )
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        selected_pietanze_vars = []
        for pietanza in all_pietanze:
            var = tk.BooleanVar(value=True) # Default: selezionato
            cb = tk.Checkbutton(scrollable_frame, text=f"{pietanza['tipologia_desc']}: {pietanza['descrizione']} ({pietanza['prezzo']})", variable=var)
            cb.pack(anchor='w')
            selected_pietanze_vars.append({'pietanza': pietanza, 'var': var})

        # Funzione per gestire il tasto CONTINUA
        def continua_action():
            root.destroy() # Chiude la finestra GUI

        continua_button = tk.Button(root, text="CONTINUA", command=continua_action)
        continua_button.pack(pady=10)

        root.mainloop()

        # Filtra le pietanze selezionate
        filtered_elenco_pietanze = {}
        for cat in categorie:
            filtered_elenco_pietanze[cat['descrizione']] = []

        for item in selected_pietanze_vars:
            if item['var'].get(): # Se il checkbox è selezionato
                pietanza = item['pietanza']
                # Ricostruisci l'oggetto pietanza come era prima per data.js
                filtered_elenco_pietanze[pietanza['tipologia_desc']].append({
                    'id': pietanza['id'],
                    'descrizione': pietanza['descrizione'],
                    'prezzo': pietanza['prezzo']
                })
        
        # Prepara elencoPrincipale (solo categorie con almeno un articolo selezionato)
        elenco_principale = [cat['descrizione'] for cat in categorie if len(filtered_elenco_pietanze[cat['descrizione']]) > 0]


        # ====================================================================
        # Generazione del contenuto del file data.js con le selezioni
        # ====================================================================
        data_js_content = f"// data.js - Generato automaticamente da AGGIORNA LISTINO (Data: {datetime.now().isoformat()})\n\n"

        # Dati del listino (popolati dalle query al DB)
        data_js_content += f"var elencoPrincipale = {json.dumps(elenco_principale, indent=2)};\n"
        data_js_content += f"var categorie = {json.dumps(categorie, indent=2)};\n" # Le categorie rimangono tutte
        data_js_content += f"var elencoPietanze = {json.dumps(filtered_elenco_pietanze, indent=2)};\n\n"

        # Inserimento della definizione della funzione Data() (rimane invariata)
        data_js_content += """
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
"""

        # ====================================================================
        # Scrittura del file data.js nel percorso specificato.
        # ====================================================================
        output_path = 'C:/sagra/web/preordini/preordini_lib/util/data.js' # AGGIORNA QUESTO PERCORSO SE DIVERSO
        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(data_js_content)
        print(f'File data.js generato e aggiornato con successo in: {output_path}')

    except psycopg2.Error as e:
        print(f'ERRORE CRITICO: Errore durante l\'aggiornamento del listino: {e}')
        messagebox.showerror("Errore Database", f"Si è verificato un errore durante la connessione al database o l'esecuzione delle query:\n{e}")
    except Exception as e:
        print(f'ERRORE CRITICO: Errore generico: {e}')
        messagebox.showerror("Errore", f"Si è verificato un errore inaspettato:\n{e}")
    finally:
        if conn:
            conn.close()
            print('Connessione al database chiusa.')

if __name__ == "__main__":
    aggiorna_listino()