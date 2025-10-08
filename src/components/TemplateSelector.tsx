import { useState, useEffect } from 'react'
import type { Template } from '../types'
import './TemplateSelector.css'

const TEMPLATE_FILES: readonly string[] = [
  'bmc.json',
  'swot.json',
  '3c.json',
  'user-story-map.json'
] as const

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onTemplateSelect: (template: Template) => void;
}

function TemplateSelector({ selectedTemplate, onTemplateSelect }: TemplateSelectorProps): JSX.Element {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTemplates = async (): Promise<void> => {
      try {
        const loadedTemplates = await Promise.all(
          TEMPLATE_FILES.map(async (file): Promise<Template> => {
            const response = await fetch(`/templates/${file}`)
            if (!response.ok) {
              throw new Error(`Failed to load ${file}`)
            }
            return await response.json() as Template
          })
        )
        setTemplates(loadedTemplates)
      } catch (err: unknown) {
        console.error('Failed to load templates:', err)
        setError('テンプレートの読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    void loadTemplates()
  }, [])

  if (loading) {
    return <div className="loading">テンプレート読み込み中...</div>
  }

  if (error !== null) {
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
          onClick={(): void => onTemplateSelect(template)}
        >
          <h3>{template.name}</h3>
          <p>{template.description}</p>
        </div>
      ))}
    </div>
  )
}

export default TemplateSelector
