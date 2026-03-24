# Lessons Learned

## L001 — app/page.tsx vs (app)/page.tsx Route-Konflikt
**Problem:** `app/page.tsx` und `app/(app)/page.tsx` lösen beide `/` auf.  
Next.js wählt `app/page.tsx` → das `(app)/layout.tsx` (AuthGuard, StoreProvider) greift **nie** auf `/`.  
Folge: `isInitialized` bleibt `false` → ewiger Ladescreen.

**Regel:** Wenn Route Groups verwendet werden, darf keine `app/page.tsx` auf derselben URL existieren.  
Wenn Redirect aus `app/page.tsx` nötig ist → Dashboard auf eine eigene URL verschieben (z.B. `/home`).

**Fix angewendet:** Dashboard → `(app)/home/page.tsx`, `app/page.tsx` redirectet auf `/home`.

---

## L002 — "Verification Before Done" ernstnehmen
**Problem:** Build-Grün ≠ App funktioniert. `npm run build` prüft keine Runtime-Logik (z.B. StoreProvider nicht gemountet).  
**Regel:** Nach Layoutänderungen immer Dev-Server starten und manuell `/` aufrufen, bevor Task als done markiert wird.

---

## L003 — copilot-instructions.md Verstöße
**Problem:** Task Management sieht `tasks/todo.md` vor — stattdessen wurde nur das interne Todo-Tool genutzt.  
Nach User-Korrekturen: `tasks/lessons.md` sofort anlegen/updaten (nicht vergessen).  
**Regel:** Nach jeder User-Korrektur → Lektion hier eintragen, bevor weitergearbeitet wird.
