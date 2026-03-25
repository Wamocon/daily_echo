import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz — DailyEcho',
  description: 'Datenschutzerklärung von DailyEcho gemäß DSGVO.',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          ← Zurück
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-sm shadow">
            🌀
          </div>
          <span className="font-bold text-lg">DailyEcho</span>
        </div>

        <h1 className="text-3xl font-bold mb-2">Datenschutzerklärung</h1>
        <p className="text-muted-foreground mb-10 text-sm">
          Stand: März 2026 · Gemäß DSGVO und BDSG
        </p>

        <section className="space-y-10 text-sm leading-relaxed">
          {/* 1. Verantwortlicher */}
          <div>
            <h2 className="font-semibold text-base mb-2">1. Verantwortlicher</h2>
            <p className="text-muted-foreground">
              Verantwortlicher im Sinne der DSGVO ist:<br /><br />
              DailyEcho · [Vorname Nachname]<br />
              [Straße und Hausnummer] · [PLZ Ort]<br />
              E-Mail:{' '}
              <a
                href="mailto:kontakt@dailyecho.app"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                kontakt@dailyecho.app
              </a>
            </p>
          </div>

          {/* 2. Welche Daten wir erheben */}
          <div>
            <h2 className="font-semibold text-base mb-2">2. Welche Daten wir erheben</h2>
            <p className="text-muted-foreground mb-3">
              Wir erheben nur die Daten, die zur Bereitstellung der App-Funktionalität
              unmittelbar erforderlich sind:
            </p>
            <ul className="text-muted-foreground list-disc list-inside space-y-1">
              <li>E-Mail-Adresse (zur Kontoerstellung und Anmeldung)</li>
              <li>Anzeigename (optional, von dir gewählt)</li>
              <li>Check-in-Einträge (Stimmung, Antworten, Notizen)</li>
              <li>Nutzungsstatistiken (Streaks, XP, Errungenschaften)</li>
              <li>Ziele und Einstellungen</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Wir erheben <strong>keine</strong> Standortdaten, biometrischen Daten oder
              Zahlungsinformationen.
            </p>
          </div>

          {/* 3. Zweck und Rechtsgrundlage */}
          <div>
            <h2 className="font-semibold text-base mb-2">3. Zweck und Rechtsgrundlage</h2>
            <p className="text-muted-foreground mb-3">
              Deine Daten werden ausschließlich verarbeitet, um:
            </p>
            <ul className="text-muted-foreground list-disc list-inside space-y-1">
              <li>dein Konto zu verwalten und die App-Funktionen bereitzustellen (Art. 6 Abs. 1 lit. b DSGVO)</li>
              <li>personalisierte Reflexionen und Auswertungen anzuzeigen (Art. 6 Abs. 1 lit. b DSGVO)</li>
              <li>rechtliche Verpflichtungen zu erfüllen (Art. 6 Abs. 1 lit. c DSGVO)</li>
            </ul>
          </div>

          {/* 4. Datenspeicherung */}
          <div>
            <h2 className="font-semibold text-base mb-2">4. Datenspeicherung</h2>
            <p className="text-muted-foreground">
              Deine Daten werden in der EU bei{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                Supabase
              </a>{' '}
              gespeichert. Supabase ist DSGVO-konform und stellt Standardvertragsklauseln
              (SCCs) bereit. Wir speichern deine Daten nur so lange, wie es für den
              jeweiligen Zweck erforderlich ist. Nach Kontolöschung werden alle
              personenbezogenen Daten innerhalb von 30 Tagen unwiderruflich gelöscht.
            </p>
          </div>

          {/* 5. Weitergabe an Dritte */}
          <div>
            <h2 className="font-semibold text-base mb-2">5. Weitergabe an Dritte</h2>
            <p className="text-muted-foreground">
              Wir geben deine Daten nicht an Dritte weiter, verkaufen sie nicht und nutzen
              sie nicht für Werbezwecke. Eine Weitergabe erfolgt ausschließlich, wenn dies
              gesetzlich vorgeschrieben ist.
            </p>
          </div>

          {/* 6. Cookies und lokale Speicherung */}
          <div>
            <h2 className="font-semibold text-base mb-2">6. Cookies und lokale Speicherung</h2>
            <p className="text-muted-foreground">
              DailyEcho verwendet ausschließlich technisch notwendige Cookies zur
              Sitzungsverwaltung (Authentifizierung). Es werden keine Tracking- oder
              Marketing-Cookies eingesetzt. Einige Daten werden im lokalen Browserspeicher
              (localStorage) gespeichert, um die App-Performance zu verbessern.
            </p>
          </div>

          {/* 7. Deine Rechte */}
          <div>
            <h2 className="font-semibold text-base mb-2">7. Deine Rechte</h2>
            <p className="text-muted-foreground mb-3">
              Gemäß DSGVO hast du jederzeit das Recht auf:
            </p>
            <ul className="text-muted-foreground list-disc list-inside space-y-1">
              <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO)</li>
              <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
              <li>Löschung deiner Daten («Recht auf Vergessenwerden», Art. 17 DSGVO)</li>
              <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Zur Ausübung deiner Rechte wende dich an:{' '}
              <a
                href="mailto:datenschutz@dailyecho.app"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                datenschutz@dailyecho.app
              </a>
            </p>
          </div>

          {/* 8. Beschwerderecht */}
          <div>
            <h2 className="font-semibold text-base mb-2">8. Beschwerderecht</h2>
            <p className="text-muted-foreground">
              Du hast das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren.
              Die zuständige Behörde richtet sich nach deinem Wohnort in Deutschland.
            </p>
          </div>

          {/* 9. Änderungen */}
          <div>
            <h2 className="font-semibold text-base mb-2">9. Änderungen dieser Erklärung</h2>
            <p className="text-muted-foreground">
              Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um
              sie an geänderte Rechtslage oder Änderungen unserer Dienste anzupassen.
              Die jeweils aktuelle Version ist stets in der App abrufbar.
            </p>
          </div>
        </section>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-border flex gap-6 text-sm text-muted-foreground">
          <Link href="/datenschutz" className="hover:text-foreground transition-colors font-medium text-foreground">
            Datenschutz
          </Link>
          <Link href="/impressum" className="hover:text-foreground transition-colors">
            Impressum
          </Link>
        </div>
      </div>
    </div>
  );
}
