
# AggiornaListino_ordinabile_persistente_SCROLL_FIX.py
# Fix robusto per lo scroll: bind globale (bind_all) di MouseWheel/Trackpad e Button-4/5 (Linux),
# scrollbar sempre visibile, tasti PgUp/PgDn/Home/End, e aggiornamento scrollregion affidabile.

import psycopg2
import json
import os
from datetime import datetime
import tkinter as tk
from tkinter import messagebox, ttk
import platform

db_config = {
    'user': 'sagra',
    'host': 'localhost',
    'database': 'sagra',
    'password': 'plutarco',
    'port': 5432,
}

OUTPUT_DATA_JS = r'C:/sagra/web/preordini/preordini_lib/util/data.js'
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PREFS_PATH = os.path.join(SCRIPT_DIR, 'ordine_pietanze.json')

# ---------- Utilità persistenza ----------
def load_prefs():
    try:
        with open(PREFS_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"per_category": {}}
    except Exception as e:
        print("ATTENZIONE: impossibile leggere le preferenze:", e)
        return {"per_category": {}}

def save_prefs(per_cat_widgets):
    prefs = {"per_category": {}}
    for cat_id, rows in per_cat_widgets.items():
        prefs["per_category"][str(cat_id)] = {}
        for r in rows:
            p = r['pietanza']
            include = bool(r['var_chk'].get())
            try:
                ord_val = int(r['var_ord'].get())
            except Exception:
                ord_val = None
            prefs["per_category"][str(cat_id)][str(p['id'])] = {
                "order": ord_val,
                "include": include
            }
    try:
        with open(PREFS_PATH, 'w', encoding='utf-8') as f:
            json.dump(prefs, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print("ATTENZIONE: impossibile salvare le preferenze:", e)

def get_pref_order(prefs, cat_id, item_id):
    try:
        val = prefs["per_category"].get(str(cat_id), {}).get(str(item_id), {})
        return val.get("order", None)
    except Exception:
        return None

def get_pref_include(prefs, cat_id, item_id):
    try:
        val = prefs["per_category"].get(str(cat_id), {}).get(str(item_id), {})
        inc = val.get("include", None)
        if inc is None:
            return True
        return bool(inc)
    except Exception:
        return True

# ---------- Widget scrollabile con bind globale ----------
class ScrollableFrame(ttk.Frame):
    def __init__(self, master, **kwargs):
        super().__init__(master, **kwargs)
        self.canvas = tk.Canvas(self, highlightthickness=0)
        self.vsb = ttk.Scrollbar(self, orient="vertical", command=self.canvas.yview)
        self.canvas.configure(yscrollcommand=self.vsb.set)

        self.vsb.pack(side="right", fill="y")
        self.canvas.pack(side="left", fill="both", expand=True)

        self.inner = ttk.Frame(self.canvas)
        self.window_id = self.canvas.create_window((0, 0), window=self.inner, anchor="nw")

        # Scroll più dolce
        self.canvas.configure(yscrollincrement=20)

        # Aggiornamenti di layout
        self.inner.bind("<Configure>", self._on_frame_configure)
        self.canvas.bind("<Configure>", self._on_canvas_configure)

        # Bind globali per lo scroll (funzionano anche se il focus è su Entry o altre widget)
        self._install_global_scroll_bindings()

        # Tasti di navigazione
        for seq in ("<Prior>", "<Next>", "<Home>", "<End>", "<Up>", "<Down>"):
            self.canvas.bind_all(seq, self._on_keys)

    def _on_keys(self, event):
        if event.keysym == "Prior":  # PageUp
            self.canvas.yview_scroll(-1, "page")
        elif event.keysym == "Next": # PageDown
            self.canvas.yview_scroll(1, "page")
        elif event.keysym == "Home":
            self.canvas.yview_moveto(0)
        elif event.keysym == "End":
            self.canvas.yview_moveto(1)
        elif event.keysym == "Up":
            self.canvas.yview_scroll(-1, "units")
        elif event.keysym == "Down":
            self.canvas.yview_scroll(1, "units")

    def _on_frame_configure(self, event=None):
        # Aggiorna la scrollregion quando il contenuto cambia
        self.canvas.configure(scrollregion=self.canvas.bbox("all"))

    def _on_canvas_configure(self, event):
        # Mantieni la larghezza dell'inner pari alla canvas
        self.canvas.itemconfigure(self.window_id, width=event.width)

    # --- Bind globali mousewheel/trackpad ---
    def _install_global_scroll_bindings(self):
        system = platform.system()

        def _on_mousewheel(event):
            # Windows e macOS
            if event.delta:
                self.canvas.yview_scroll(int(-1*(event.delta/120)), "units")

        def _on_mousewheel_linux_up(event):
            self.canvas.yview_scroll(-3, "units")

        def _on_mousewheel_linux_down(event):
            self.canvas.yview_scroll(3, "units")

        if system == "Windows" or system == "Darwin":
            self.canvas.bind_all("<MouseWheel>", _on_mousewheel, add="+")
        else:
            # Linux: Button-4/5
            self.canvas.bind_all("<Button-4>", _on_mousewheel_linux_up, add="+")
            self.canvas.bind_all("<Button-5>", _on_mousewheel_linux_down, add="+")

# ---------- Logica principale ----------
def aggiorna_listino():
    conn = None
    try:
        prefs = load_prefs()

        conn = psycopg2.connect(**db_config)
        cur = conn.cursor()
        print('Connesso al database PostgreSQL.')

        # Categorie in ordine naturale
        cur.execute('SELECT id, descrizione FROM tipologie')
        categorie_rows = cur.fetchall()
        categorie = [{'id': row[0], 'descrizione': row[1]} for row in categorie_rows]

        # Pietanze per categoria (ordine naturale DB)
        all_pietanze = []
        for cat in categorie:
            cur.execute("""
                SELECT 
                    id, 
                    descrizione, 
                    TRIM(TRAILING '.' FROM REPLACE(TRIM(TRAILING '0' FROM prezzo::text), '.', ',')) as prezzo 
                FROM articoli 
                WHERE id_tipologia = %s
            """, (cat['id'],))
            for row in cur.fetchall():
                all_pietanze.append({
                    'id': row[0],
                    'descrizione': row[1],
                    'prezzo': row[2],
                    'id_tipologia': cat['id'],
                    'tipologia_desc': cat['descrizione']
                })

        # --- GUI ---
        root = tk.Tk()
        root.title("Aggiorna Listino — Seleziona Pietanze e Ordine")
        root.minsize(960, 640)

        # Barra superiore (filtra)
        topbar = ttk.Frame(root)
        topbar.pack(fill="x", padx=10, pady=6)

        ttk.Label(topbar, text="Filtra:").pack(side="left")
        filter_var = tk.StringVar()
        filter_entry = ttk.Entry(topbar, textvariable=filter_var, width=30)
        filter_entry.pack(side="left", padx=(6, 12))

        # Area scrollabile
        scroll = ScrollableFrame(root)
        scroll.pack(fill="both", expand=True)
        inner = scroll.inner

        per_cat_widgets = {cat['id']: [] for cat in categorie}

        # Costruzione contenuti
        for cat in categorie:
            lf = ttk.LabelFrame(inner, text=f"[{cat['id']}] {cat['descrizione']}")
            lf.pack(fill="x", expand=True, padx=10, pady=8)

            cat_items = [p for p in all_pietanze if p['id_tipologia'] == cat['id']]
            if not cat_items:
                ttk.Label(lf, text="(Nessuna pietanza)").pack(anchor="w", padx=8, pady=2)
                continue

            header = ttk.Frame(lf)
            header.pack(fill="x", padx=8, pady=(4,2))
            ttk.Label(header, text="Includi", width=8).grid(row=0, column=0, sticky="w")
            ttk.Label(header, text="Ord.", width=6).grid(row=0, column=1, sticky="w")
            ttk.Label(header, text="Descrizione (Prezzo)").grid(row=0, column=2, sticky="w")

            next_default = 1
            for idx, p in enumerate(cat_items):
                rowf = ttk.Frame(lf)
                rowf.pack(fill="x", padx=8, pady=1)

                include_default = get_pref_include(prefs, cat['id'], p['id'])
                var_chk = tk.BooleanVar(value=include_default)
                chk = ttk.Checkbutton(rowf, variable=var_chk)
                chk.grid(row=0, column=0, sticky="w", padx=(0,6))

                saved_order = get_pref_order(prefs, cat['id'], p['id'])
                if isinstance(saved_order, int) and saved_order > 0:
                    ord_val = saved_order
                else:
                    ord_val = next_default
                    next_default += 1

                var_ord = tk.StringVar(value=str(ord_val))
                ent = ttk.Entry(rowf, textvariable=var_ord, width=6, justify="right")
                ent.grid(row=0, column=1, sticky="w", padx=(0,10))

                ttk.Label(rowf, text=f"{p['descrizione']} ({p['prezzo']})").grid(row=0, column=2, sticky="w")

                per_cat_widgets[cat['id']].append({
                    'pietanza': p,
                    'var_chk': var_chk,
                    'var_ord': var_ord,
                    'original_index': idx,
                    'rowf': rowf
                })

        # Filtro live: mostra/nascondi righe senza distruggere il layout
        def apply_filter(*args):
            q = filter_var.get().strip().lower()
            for cat_id, rows in per_cat_widgets.items():
                for r in rows:
                    txt = f"{r['pietanza']['descrizione']} ({r['pietanza']['prezzo']})".lower()
                    visible = (q in txt) if q else True
                    try:
                        if visible:
                            r['rowf'].pack(fill="x", padx=8, pady=1)
                        else:
                            r['rowf'].pack_forget()
                    except Exception:
                        pass
            # aggiornare scrollregion
            inner.update_idletasks()
            scroll.canvas.configure(scrollregion=scroll.canvas.bbox("all"))

        filter_var.trace_add("write", apply_filter)

        # Barra inferiore
        bottombar = ttk.Frame(root)
        bottombar.pack(fill="x", padx=10, pady=8)

        def on_continua():
            save_prefs(per_cat_widgets)

            filtered_elenco_pietanze = {cat['descrizione']: [] for cat in categorie}

            for cat in categorie:
                rows = per_cat_widgets[cat['id']]
                ordered = []
                for r in rows:
                    p = r['pietanza']
                    if not r['var_chk'].get():
                        continue
                    try:
                        ord_val = int(r['var_ord'].get())
                    except Exception:
                        ord_val = 10_000_000
                    ordered.append((ord_val, r['original_index'], p))

                ordered.sort(key=lambda t: (t[0], t[1]))
                for _, __, p in ordered:
                    filtered_elenco_pietanze[next(c['descrizione'] for c in categorie if c['id']==p['id_tipologia'])].append({
                        'id': p['id'],
                        'descrizione': p['descrizione'],
                        'prezzo': p['prezzo']
                    })

            elenco_principale = [cat['descrizione'] for cat in categorie if filtered_elenco_pietanze[cat['descrizione']]]

            data_js_content = f"// data.js - Generato automaticamente (Data: {datetime.now().isoformat()})\n\n"
            data_js_content += f"var elencoPrincipale = {json.dumps(elenco_principale, indent=2, ensure_ascii=False)};\n"
            data_js_content += f"var categorie = {json.dumps(categorie, indent=2, ensure_ascii=False)};\n"
            data_js_content += f"var elencoPietanze = {json.dumps(filtered_elenco_pietanze, indent=2, ensure_ascii=False)};\n\n"
            data_js_content += r"""function Data(){
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
"""
            os.makedirs(os.path.dirname(OUTPUT_DATA_JS), exist_ok=True)
            with open(OUTPUT_DATA_JS, 'w', encoding='utf-8') as f:
                f.write(data_js_content)

            messagebox.showinfo("Completato", f"data.js generato.\nPreferenze salvate in:\n{PREFS_PATH}")
            root.destroy()

        ttk.Button(bottombar, text="CONTINUA", command=on_continua).pack(side="right")
        ttk.Label(bottombar, text="Scroll: rotellina/trackpad, PgUp/PgDn, Home/End.").pack(side="left")

        root.mainloop()

    except psycopg2.Error as e:
        print('ERRORE DB:', e)
        try:
            messagebox.showerror("Errore Database", f"Errore DB:\n{e}")
        except Exception:
            pass
    except Exception as e:
        print('ERRORE:', e)
        try:
            messagebox.showerror("Errore", f"Errore:\n{e}")
        except Exception:
            pass
    finally:
        if conn:
            conn.close()
            print('Connessione al database chiusa.')

if __name__ == "__main__":
    aggiorna_listino()
