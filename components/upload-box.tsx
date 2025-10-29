'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, CheckCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
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
      setFile(files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    
    // Animate progress from 0 to 95
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval)
          return 95
        }
        return prev + 1
      })
    }, 60)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Non autenticato')
      
      const filePath = `${user.id}/${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('statements')
        .upload(filePath, file)
      
      if (uploadError) throw uploadError
      
      const { data: source } = await supabase.from('sources').insert([{
        user_id: user.id,
        type: 'statement',
        label: file.name,
        status: 'processing'
      }]).select().single()
      
      if (!source) throw new Error('Failed to create source')
      
      await fetch('/api/process/statement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId: source.id, filePath })
      })
      
      clearInterval(interval)
      setProgress(100)
      
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      console.error(error)
      clearInterval(interval)
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Card className="border-2 border-dashed border-gray-300 hover:border-amber-400 transition-colors">
      <CardContent className="p-8">
        <div
          className={`text-center ${dragActive ? 'bg-amber-50' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!file ? (
            <>
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Carica il tuo estratto conto</h3>
              <p className="text-sm text-gray-600 mb-4">
                Trascina qui il file CSV o PDF oppure clicca per selezionare
              </p>
              <input
                type="file"
                accept=".csv,.pdf"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span>Seleziona File</span>
                </Button>
              </label>
            </>
          ) : uploading ? (
            <>
              <Loader2 className="w-16 h-16 text-amber-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">Analisi in corso...</h3>
              <p className="text-sm text-gray-600 mb-4">
                Stiamo rilevando i tuoi abbonamenti
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">{progress}%</p>
            </>
          ) : (
            <>
              <FileText className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{file.name}</h3>
              <p className="text-sm text-gray-600 mb-4">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleUpload}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Carica
                </Button>
                <Button variant="outline" onClick={() => setFile(null)}>
                  Annulla
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
