'use client'

import { useState } from 'react'
import { toCanvas } from 'html-to-image'
import jsPDF from 'jspdf'

export function PdfDownloadButton() {
  const [loading, setLoading] = useState(false)

  const downloadPdf = async () => {
    if (loading) return
    setLoading(true)

    try {
      const element = document.querySelector('main.flex-col')
      if (!element) return

      const canvas = await toCanvas(element as HTMLElement, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [210, (canvas.height * 210) / canvas.width],
      })

      pdf.addImage(imgData, 'PNG', 0, 0, 210, (canvas.height * 210) / canvas.width)
      pdf.save('vendedores-ecommer.pdf')
    } catch (error) {
      console.error('Error al generar PDF:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={downloadPdf}
      disabled={loading}
      className="fixed bottom-6 right-30 z-50 flex items-center gap-2 text-white px-5 py-3 rounded-full shadow-2xl hover:opacity-90 transition-all font-semibold text-sm disabled:opacity-60"
      style={{ background: 'linear-gradient(135deg, #9969F8, #6BB8FF)' }}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generando...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Comparte la página!
        </>
      )}
    </button>
  )
}
