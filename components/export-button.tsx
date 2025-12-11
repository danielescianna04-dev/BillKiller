'use client'

import { Button } from '@/components/ui/button'
import { Download, FileText } from 'lucide-react'
import { useState } from 'react'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async (format: 'csv' | 'pdf') => {
    setLoading(true)
    try {
      const response = await fetch(`/api/export?format=${format}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `abbonamenti.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        const error = await response.json()
        console.error('Export error:', error)
        alert(error.error || 'Errore durante l\'export')
      }
    } catch (err) {
      console.error('Export error:', err)
      alert('Errore durante l\'export')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button onClick={() => handleExport('csv')} variant="outline" size="sm" className="gap-2" disabled={loading}>
        <Download className="w-4 h-4" />
        CSV
      </Button>
      <Button onClick={() => handleExport('pdf')} variant="outline" size="sm" className="gap-2" disabled={loading}>
        <FileText className="w-4 h-4" />
        PDF
      </Button>
    </div>
  )
}
