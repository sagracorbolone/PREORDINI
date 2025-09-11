
import psycopg2, json, os
from datetime import datetime
import tkinter as tk
from tkinter import ttk, messagebox

DB = dict(user='sagra', host='localhost', database='sagra', password='plutarco', port=5432)
OUTPUT = r'C:/sagra/web/preordini/preordini_lib/util/data.js'
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PREFS = os.path.join(SCRIPT_DIR, 'ordine_pietanze.json')

JS_BLOCK = r"""

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

def build_js(elencoPrincipale, categorie, elencoPietanze):
    lines = []
    lines.append("// data.js - Generato automaticamente da AGGIORNA LISTINO (Data: %s)\n" % datetime.now().isoformat())
    lines.append("var elencoPrincipale = " + json.dumps(elencoPrincipale, ensure_ascii=False, indent=2) + ";\n")
    lines.append("var categorie = " + json.dumps(categorie, ensure_ascii=False, indent=2) + ";\n")
    lines.append("var elencoPietanze = " + json.dumps(elencoPietanze, ensure_ascii=False, indent=2) + ";\n")
    lines.append(JS_BLOCK)
    return "\n".join(lines)

def main():
    conn = psycopg2.connect(**DB); cur = conn.cursor()
    cur.execute('SELECT id, descrizione FROM tipologie')
    cats = [{'id': r[0], 'descrizione': r[1]} for r in cur.fetchall()]

    items = []
    for c in cats:
        cur.execute("""
            SELECT id, descrizione, TRIM(TRAILING '.' FROM REPLACE(TRIM(TRAILING '0' FROM prezzo::text), '.', ',')) as prezzo
            FROM articoli WHERE id_tipologia=%s
        """, (c['id'],))
        for r in cur.fetchall():
            prezzo = r[2]
            if isinstance(prezzo,str) and prezzo.endswith(','):
                prezzo = prezzo[:-1]
            items.append({'id': r[0], 'descrizione': r[1], 'prezzo': prezzo, 'id_tipologia': c['id']})
    conn.close()

    # GUI
    root = tk.Tk(); root.title("Aggiorna Listino — formato compatibile"); root.minsize(900, 600)
    canvas = tk.Canvas(root, highlightthickness=0); vsb = ttk.Scrollbar(root, orient="vertical", command=canvas.yview)
    canvas.configure(yscrollcommand=vsb.set); vsb.pack(side="right", fill="y"); canvas.pack(side="left", fill="both", expand=True)
    inner = ttk.Frame(canvas); canvas.create_window((0,0), window=inner, anchor="nw")
    inner.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

    # prefs
    try:
        with open(PREFS, 'r', encoding='utf-8') as f:
            prefs = json.load(f)
    except:
        prefs = {"per_category": {}}

    per_cat_widgets = {c['id']: [] for c in cats}
    for c in cats:
        lf = ttk.LabelFrame(inner, text=f"[{c['id']}] {c['descrizione']}"); lf.pack(fill="x", expand=True, padx=10, pady=8)
        header = ttk.Frame(lf); header.pack(fill="x", padx=8, pady=(4,2))
        ttk.Label(header, text="Includi", width=8).grid(row=0, column=0, sticky="w")
        ttk.Label(header, text="Ord.", width=6).grid(row=0, column=1, sticky="w")
        ttk.Label(header, text="Descrizione (Prezzo)").grid(row=0, column=2, sticky="w")
        nxt = 1
        for idx, p in enumerate([x for x in items if x['id_tipologia']==c['id']]):
            row = ttk.Frame(lf); row.pack(fill="x", padx=8, pady=1)
            include_default = prefs.get("per_category", {}).get(str(c['id']), {}).get(str(p['id']), {}).get("include")
            include_default = True if include_default is None else bool(include_default)
            var_chk = tk.BooleanVar(value=include_default); ttk.Checkbutton(row, variable=var_chk).grid(row=0, column=0, sticky="w", padx=(0,6))

            saved_order = prefs.get("per_category", {}).get(str(c['id']), {}).get(str(p['id']), {}).get("order")
            ord_val = saved_order if (isinstance(saved_order,int) and saved_order>0) else nxt
            if not isinstance(saved_order,int) or saved_order<=0: nxt += 1
            var_ord = tk.StringVar(value=str(ord_val)); ttk.Entry(row, textvariable=var_ord, width=6, justify="right").grid(row=0, column=1, sticky="w", padx=(0,10))

            ttk.Label(row, text=f"{p['descrizione']} ({p['prezzo']})").grid(row=0, column=2, sticky="w")
            per_cat_widgets[c['id']].append({'pietanza':p,'var_chk':var_chk,'var_ord':var_ord,'idx':idx})

    def on_save():
        elencoPietanze = {c['descrizione']: [] for c in cats}
        for c in cats:
            rows = per_cat_widgets[c['id']]
            ord_rows = []
            for r in rows:
                if not r['var_chk'].get(): continue
                try: ov = int(r['var_ord'].get())
                except: ov = 10_000_000
                ord_rows.append((ov, r['idx'], r['pietanza']))
            ord_rows.sort(key=lambda t: (t[0], t[1]))
            for _,__,p in ord_rows:
                elencoPietanze[c['descrizione']].append({'id': p['id'], 'descrizione': p['descrizione'], 'prezzo': p['prezzo']})
        elencoPrincipale = [c['descrizione'] for c in cats if elencoPietanze[c['descrizione']]]

        # scrivi JS
        js = build_js(elencoPrincipale, cats, elencoPietanze)
        os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
        with open(OUTPUT, 'w', encoding='utf-8') as f:
            f.write(js)

        # salva preferenze
        prefs = {"per_category": {}}
        for c in cats:
            prefs["per_category"][str(c['id'])] = {}
            for r in per_cat_widgets[c['id']]:
                p = r['pietanza']
                try: ov = int(r['var_ord'].get())
                except: ov = None
                prefs["per_category"][str(c['id'])][str(p['id'])] = {"order": ov, "include": bool(r['var_chk'].get())}
        with open(PREFS, 'w', encoding='utf-8') as f:
            json.dump(prefs, f, ensure_ascii=False, indent=2)

        messagebox.showinfo("Completato", f"data.js generato in:\n{OUTPUT}")
        root.destroy()

    ttk.Button(root, text="CONTINUA", command=on_save).pack(pady=10)
    root.mainloop()

if __name__ == "__main__":
    main()
