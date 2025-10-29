export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Termini di Servizio</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Accettazione</h2>
          <p className="text-gray-700 leading-relaxed">
            Usando BillKiller accetti questi termini. Se non li accetti, non usare il servizio.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Descrizione servizio</h2>
          <p className="text-gray-700 leading-relaxed">
            BillKiller analizza estratti conto e email per rilevare abbonamenti ricorrenti e mostrare 
            totali mensili/annuali. Suggeriamo alternative più economiche tramite link affiliati.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Account utente</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Devi avere almeno 18 anni</li>
            <li>Fornisci informazioni accurate</li>
            <li>Mantieni la password sicura</li>
            <li>Sei responsabile dell'attività sul tuo account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Piano gratuito e Premium</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            <strong>Gratuito:</strong> fino a 5 abbonamenti visibili, totali mensili/annuali
          </p>
          <p className="text-gray-700 leading-relaxed">
            <strong>Premium (€0,99/mese o €9,99/anno):</strong> abbonamenti illimitati, grafici, 
            trend 12 mesi, export PDF/CSV, backup automatico
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Pagamenti e rimborsi</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Pagamenti tramite Stripe, con IVA UE applicata</li>
            <li>Rinnovo automatico, cancellabile in qualsiasi momento</li>
            <li>Rimborsi: 14 giorni per acquisti entro UE (diritto di recesso)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Uso accettabile</h2>
          <p className="text-gray-700 leading-relaxed mb-2">Non puoi:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Caricare dati di terzi senza consenso</li>
            <li>Fare reverse engineering o scraping</li>
            <li>Usare il servizio per attività illegali</li>
            <li>Sovraccaricare l'infrastruttura</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Link affiliati</h2>
          <p className="text-gray-700 leading-relaxed">
            Alcuni link sono affiliati: guadagniamo una commissione se sottoscrivi tramite noi, 
            senza costi extra per te. Questo ci permette di mantenere il servizio a meno di 1€/mese.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Limitazione responsabilità</h2>
          <p className="text-gray-700 leading-relaxed">
            BillKiller è fornito "as is". Non garantiamo rilevamento perfetto al 100% degli abbonamenti. 
            Non siamo responsabili per decisioni finanziarie prese sulla base dei nostri suggerimenti.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Modifiche e sospensione</h2>
          <p className="text-gray-700 leading-relaxed">
            Possiamo modificare, sospendere o terminare il servizio con preavviso. 
            Possiamo sospendere account che violano questi termini.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Legge applicabile</h2>
          <p className="text-gray-700 leading-relaxed">
            Questi termini sono regolati dalla legge italiana. Foro competente: tribunale di [città].
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contatti</h2>
          <p className="text-gray-700 leading-relaxed">
            Per domande: <a href="mailto:support@billkiller.app" className="text-amber-600 hover:underline">support@billkiller.app</a>
          </p>
          <p className="text-gray-700 mt-2">
            Ultimo aggiornamento: 27 ottobre 2024
          </p>
        </section>
      </div>
    </div>
  )
}
