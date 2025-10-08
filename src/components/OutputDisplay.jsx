import { useEffect, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import './OutputDisplay.css'

function OutputDisplay({ output }) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    if (output) {
      // Configure marked options
      marked.setOptions({
        breaks: true,
        gfm: true
      })

      const rawHtml = marked.parse(output)
      const sanitizedHtml = DOMPurify.sanitize(rawHtml)
      setHtml(sanitizedHtml)
    }
  }, [output])

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(output)
    alert('Markdownをクリップボードにコピーしました')
  }

  const handleExportMarkdown = () => {
    const blob = new Blob([output], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analysis_${Date.now()}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="output-display">
      <div className="output-actions">
        <button className="btn-secondary" onClick={handleCopyMarkdown}>
          📋 コピー
        </button>
        <button className="btn-secondary" onClick={handleExportMarkdown}>
          💾 Markdown保存
        </button>
      </div>
      <div
        className="output-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

export default OutputDisplay
