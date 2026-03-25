import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum — DailyEcho',
  description: 'Impressum und rechtliche Informationen zu DailyEcho.',
};

export default function ImpressumPage() {
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

        <h1 className="text-3xl font-bold mb-2">Impressum</h1>
        <p className="text-muted-foreground mb-10 text-sm">
          Angaben gemäß § 5 TMG
        </p>

        <section className="space-y-8 text-sm leading-relaxed">
          {/* Anbieter */}
          <div>
            <h2 className="font-semibold text-base mb-2">Anbieter</h2>
            <p className="text-muted-foreground">
              DailyEcho<br />
              [Vorname Nachname]<br />
              [Straße und Hausnummer]<br />
              [PLZ Ort]<br />
              Deutschland
            </p>
          </div>

          {/* Kontakt */}
          <div>
            <h2 className="font-semibold text-base mb-2">Kontakt</h2>
            <p className="text-muted-foreground">
              E-Mail:{' '}
              <a
                href="mailto:kontakt@dailyecho.app"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                kontakt@dailyecho.app
              </a>
            </p>
          </div>

          {/* Verantwortlich */}
          <div>
            <h2 className="font-semibold text-base mb-2">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p className="text-muted-foreground">
              [Vorname Nachname]<br />
              [Adresse wie oben]
            </p>
          </div>

          {/* EU-Streitschlichtung */}
          <div>
            <h2 className="font-semibold text-base mb-2">EU-Streitschlichtung</h2>
            <p className="text-muted-foreground">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground transition-colors"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              <br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder
              verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>

          {/* Haftungsausschluss */}
          <div>
            <h2 className="font-semibold text-base mb-2">Haftungsausschluss</h2>
            <p className="text-muted-foreground">
              Die Inhalte dieser App wurden mit größtmöglicher Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine
              Gewähr übernehmen. DailyEcho ist kein Ersatz für professionelle medizinische
              oder psychologische Beratung.
            </p>
          </div>
        </section>

        {/* Footer links */}
        <div className="mt-16 pt-8 border-t border-border flex gap-6 text-sm text-muted-foreground">
          <Link href="/datenschutz" className="hover:text-foreground transition-colors">
            Datenschutz
          </Link>
          <Link href="/impressum" className="hover:text-foreground transition-colors font-medium text-foreground">
            Impressum
          </Link>
        </div>
      </div>
    </div>
  );
}
