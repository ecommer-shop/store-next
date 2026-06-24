'use client'

import { useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { PdfCapture } from '@/lib/pdf-capture'

export function PdfDownloadButton() {
  const { resolvedTheme } = useTheme()
  const [loading, setLoading] = useState(false)

  const downloadPdf = useCallback(async () => {
    if (loading) return
    setLoading(true)

    try {
      const capture = new PdfCapture({
        containerSelector: '[data-pdf-content]',
        pixelRatio: 3,
        isDark: document.documentElement.classList.contains('dark'),
        backgroundColor:
          document.documentElement.classList.contains('dark') ? '#12123F' : '#F1F1F1',
        filename: 'vendedores-ecommer.pdf',
      })
      await capture.toPdf()
    } catch (error) {
      console.error('Error al generar PDF:', error)
    } finally {
      setLoading(false)
    }
  }, [loading])

  return (
    <button
      onClick={downloadPdf}
      disabled={loading}
      className="fixed bottom-6 right-30 z-50 flex items-center gap-2 text-white px-5 py-3 rounded-full shadow-2xl hover:opacity-90 transition-all font-semibold text-sm disabled:opacity-60"
      style={{
        background:
          resolvedTheme === 'light'
            ? 'linear-gradient(135deg, #6BB8FF, #9969F8)'
            : 'linear-gradient(135deg, #9969F8, #6BB8FF)',
      }}
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
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Comparte la página!
        </>
      )}
    </button>
  )
}
