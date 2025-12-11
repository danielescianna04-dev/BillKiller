'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [failedFilePath, setFailedFilePath] = useState<string | null>(null)
  const [sendingReport, setSendingReport] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    const allowedTypes = ['text/csv', 'application/pdf', 'application/vnd.ms-excel']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv')) {
      setMessage('Formato file non supportato. Usa CSV o PDF.')
      return
    }
    
    if (selectedFile.size > maxSize) {
      setMessage('File troppo grande. Massimo 10MB.')
      return
    }
    
    setFile(selectedFile)
    setMessage('')
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setMessage('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non autenticato')
      
      // Ensure user exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single()
      
      if (!existingUser) {
        await supabase.from('users').insert({
          id: user.id,
          email: user.email!,
          plan: 'free'
        })
      }
      
      // Upload file to Supabase Storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('statements')
        .upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      // Create source record
      const { data: sourceData, error: sourceError } = await supabase
        .from('sources')
        .insert([{
          user_id: user.id,
          type: 'statement',
          label: file.name,
          status: 'processing'
        }])
        .select()
        .single()
      
      if (sourceError) throw sourceError
      
      setUploading(false)
      setProcessing(true)
      
      // Trigger processing
      await processStatement(sourceData.id, uploadData.path)
      
      setProcessing(false)
      setMessage('File elaborato con successo! Controlla la dashboard.')
      setFile(null)
      
    } catch (error: any) {
      setUploading(false)
      setProcessing(false)
      setMessage(error.message)
    }
  }

  // Real processing function
  const processStatement = async (sourceId: string, filePath: string) => {
    const response = await fetch('/api/process/statement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId, filePath })
    })

    if (!response.ok) {
      throw new Error('Elaborazione fallita')
    }

    const result = await response.json()
    
    // Check if no transactions were found
    if (result.transactions === 0) {
      setFailedFilePath(filePath)
      setMessageType('error')
      throw new Error('Non siamo riusciti a leggere il tuo estratto conto.')
    }
    
    setMessageType('success')
    return result
  }

  const handleSendReport = async () => {
    if (!failedFilePath) return
    
    setSendingReport(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const response = await fetch('/api/report-failed-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filePath: failedFilePath,
          userEmail: user?.email 
        })
      })
      
      if (response.ok) {
        setMessage('✅ Segnalazione inviata! Ti contatteremo entro 24h per aggiungere il supporto per la tua banca.')
        setMessageType('success')
        setFailedFilePath(null)
      } else {
        throw new Error('Invio fallito')
      }
    } catch (error) {
      setMessage('Errore nell\'invio. Contattaci a support@billkiller.com')
      setMessageType('error')
    } finally {
      setSendingReport(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Carica estratto conto</h1>
        <p className="text-gray-600">
          Carica il file CSV o PDF del tuo estratto conto per trovare abbonamenti nascosti.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seleziona file</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Trascina il file qui o clicca per selezionare
            </h3>
            <p className="text-gray-600 mb-4">
              Supportiamo CSV e PDF fino a 10MB
            </p>
            <input
              type="file"
              accept=".csv,.pdf"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById('file-upload')?.click()}
              type="button"
            >
              Seleziona file
            </Button>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium">{file.name}</div>
                  <div className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            </div>
          )}

          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              messageType === 'success'
                ? 'bg-green-100 border border-green-300' 
                : 'bg-red-100 border border-red-300'
            }`}>
              <div className="flex items-start space-x-2">
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-700 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-700 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={messageType === 'success' ? 'text-green-700' : 'text-red-700'}>
                    {message}
                  </p>
                  {failedFilePath && (
                    <Button 
                      onClick={handleSendReport}
                      disabled={sendingReport}
                      className="mt-3 bg-amber-600 hover:bg-amber-700"
                      size="sm"
                    >
                      {sendingReport ? 'Invio in corso...' : '📧 Invia segnalazione automatica'}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {(uploading || processing) && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {uploading ? 'Caricamento file...' : 'Elaborazione in corso...'}
                </span>
                <span className="text-sm text-gray-500">
                  {uploading ? '50%' : '75%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500 animate-pulse"
                  style={{ width: uploading ? '50%' : '75%' }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {uploading ? 'Upload del file in corso...' : 'Analisi transazioni e rilevamento abbonamenti...'}
              </p>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <Button 
              onClick={handleUpload} 
              disabled={!file || uploading || processing}
              className="flex-1"
            >
              {uploading ? 'Caricamento...' : processing ? 'Elaborazione...' : 'Carica ed elabora'}
            </Button>
            {file && (
              <Button 
                variant="outline" 
                onClick={() => {setFile(null); setMessage('')}}
                disabled={uploading || processing}
              >
                Annulla
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formati supportati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div>
              <strong>CSV:</strong> Estratti conto da tutte le principali banche italiane 
              (Intesa Sanpaolo, UniCredit, BNL, Poste Italiane, ecc.)
            </div>
            <div>
              <strong>PDF:</strong> Estratti conto in formato PDF (elaborazione automatica)
            </div>
            <div className="text-gray-600">
              I tuoi dati vengono elaborati in server UE e cancellati automaticamente dopo 30 giorni.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
