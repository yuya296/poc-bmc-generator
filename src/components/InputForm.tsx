import { useEffect } from 'react'
import type { Template, FormData } from '../types'
import './InputForm.css'

interface InputFormProps {
  template: Template;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
}

function InputForm({ template, formData, onFormDataChange }: InputFormProps): JSX.Element {
  useEffect(() => {
    // Reset form when template changes
    const initialData: FormData = {}
    template.placeholders.forEach((placeholder) => {
      initialData[placeholder.id] = ''
    })
    onFormDataChange(initialData)
  }, [template.id, template.placeholders, onFormDataChange])

  const handleInputChange = (placeholderId: string, value: string): void => {
    onFormDataChange({
      ...formData,
      [placeholderId]: value
    })
  }

  return (
    <div className="input-form">
      {template.placeholders.map((placeholder) => (
        <div key={placeholder.id} className="form-group">
          <label>
            {placeholder.label}
            {placeholder.optional === true && <span className="optional"> (任意)</span>}
          </label>
          {placeholder.type === 'textarea' ? (
            <textarea
              value={formData[placeholder.id] ?? ''}
              onChange={(e): void => handleInputChange(placeholder.id, e.target.value)}
              placeholder={placeholder.placeholder}
              rows={4}
            />
          ) : (
            <input
              type="text"
              value={formData[placeholder.id] ?? ''}
              onChange={(e): void => handleInputChange(placeholder.id, e.target.value)}
              placeholder={placeholder.placeholder}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default InputForm
