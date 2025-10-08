import { useEffect, useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import './OutputDisplay.css'

interface OutputDisplayProps {
  output: string;
}

function OutputDisplay({ output }: OutputDisplayProps): JSX.Element {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    if (output) {
      // Configure marked options
      marked.setOptions({
        breaks: true,
        gfm: true
      })

      const rawHtml = marked.parse(output) as string
      const sanitizedHtml = DOMPurify.sanitize(rawHtml)
      setHtml(sanitizedHtml)
    }
  }, [output])

  const handleCopyMarkdown = (): void => {
    navigator.clipboard.writeText(output)
      .then(() => {
        alert('Markdownをクリップボードにコピーしました')
      })
      .catch((err: Error) => {
        console.error('Failed to copy:', err)
      })
  }

  const handleExportMarkdown = (): void => {
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
