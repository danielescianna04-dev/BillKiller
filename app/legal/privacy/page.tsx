export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduzione</h2>
          <p className="text-gray-700 leading-relaxed">
            BillKiller ("noi", "nostro") rispetta la tua privacy. Questa policy spiega come raccogliamo, 
            usiamo e proteggiamo i tuoi dati personali in conformità al GDPR (Regolamento UE 2016/679).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Base giuridica</h2>
          <p className="text-gray-700 leading-relaxed">
            Trattiamo i tuoi dati sulla base del tuo <strong>consenso esplicito</strong> (art. 6(1)(a) GDPR) 
            fornito al momento della registrazione e quando colleghi fonti dati (estratti conto, email).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Dati raccolti</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Account:</strong> email, password (hash), piano sottoscritto</li>
            <li><strong>Estratti conto:</strong> transazioni (data, importo, merchant, descrizione)</li>
            <li><strong>Email (opzionale):</strong> metadati di ricevute (mittente, oggetto, data, importo rilevato)</li>
            <li><strong>Tecnici:</strong> IP, user agent, cookie essenziali</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Come usiamo i dati</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Rilevare abbonamenti ricorrenti dalle tue transazioni</li>
            <li>Mostrarti totali mensili/annuali e grafici</li>
            <li>Suggerirti alternative più economiche (affiliate)</li>
            <li>Gestire il tuo account e abbonamento Premium</li>
          </ul>
          <p className="text-gray-700 mt-4">
            <strong>Non vendiamo</strong> i tuoi dati a terzi. I link affiliati sono basati solo su match 
            pubblici dei merchant, senza profilazione esterna.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">5. Conservazione dati</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>File grezzi (CSV/PDF): <strong>cancellati automaticamente dopo 30 giorni</strong></li>
            <li>Transazioni e abbonamenti: conservati finché mantieni l'account attivo</li>
            <li>Puoi eliminare tutto in qualsiasi momento da Impostazioni → "Elimina account"</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Hosting e sicurezza</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Hosting:</strong> server UE (Supabase EU region)</li>
            <li><strong>Cifratura:</strong> TLS in transito, AES-256 at-rest</li>
            <li><strong>Accesso email:</strong> OAuth read-only, scope limitati, disconnessione 1-click</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. I tuoi diritti (GDPR)</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Accesso:</strong> scarica i tuoi dati (export CSV/PDF)</li>
            <li><strong>Rettifica:</strong> modifica abbonamenti rilevati</li>
            <li><strong>Cancellazione:</strong> elimina account e tutti i dati</li>
            <li><strong>Portabilità:</strong> export in formato machine-readable</li>
            <li><strong>Revoca consenso:</strong> disconnetti fonti o elimina account</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Cookie</h2>
          <p className="text-gray-700 leading-relaxed">
            Usiamo solo cookie essenziali per autenticazione e funzionamento del servizio. 
            Nessun cookie di tracking o pubblicità.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Modifiche</h2>
          <p className="text-gray-700 leading-relaxed">
            Possiamo aggiornare questa policy. Ti notificheremo via email per modifiche sostanziali.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">10. Contatti</h2>
          <p className="text-gray-700 leading-relaxed">
            Per domande sulla privacy: <a href="mailto:privacy@billkiller.app" className="text-amber-600 hover:underline">privacy@billkiller.app</a>
          </p>
          <p className="text-gray-700 mt-2">
            Ultimo aggiornamento: 27 ottobre 2024
          </p>
        </section>
      </div>
    </div>
  )
}
