import { useState, useEffect } from 'react'
import './TemplateSelector.css'

const TEMPLATE_FILES = [
  'bmc.json',
  'swot.json',
  '3c.json',
  'user-story-map.json'
]

function TemplateSelector({ selectedTemplate, onTemplateSelect }) {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const loadedTemplates = await Promise.all(
          TEMPLATE_FILES.map(async (file) => {
            const response = await fetch(`/templates/${file}`)
            return await response.json()
          })
        )
        setTemplates(loadedTemplates)
      } catch (error) {
        console.error('Failed to load templates:', error)
        setError('テンプレートの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    loadTemplates()
  }, [])

  if (loading) {
    return <div className="loading">テンプレート読み込み中...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="template-selector">
      {templates.map((template) => (
        <div
          key={template.id}
          className={`template-card ${
            selectedTemplate?.id === template.id ? 'selected' : ''
          }`}
          onClick={() => onTemplateSelect(template)}
        >
          <h3>{template.name}</h3>
          <p>{template.description}</p>
        </div>
      ))}
    </div>
  )
}

export default TemplateSelector
