import { useEffect } from 'react'
import './InputForm.css'

function InputForm({ template, formData, onFormDataChange }) {
  useEffect(() => {
    // Reset form when template changes
    const initialData = {}
    template.placeholders.forEach((placeholder) => {
      initialData[placeholder.id] = ''
    })
    onFormDataChange(initialData)
  }, [template.id])

  const handleInputChange = (placeholderId, value) => {
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
            {placeholder.optional && <span className="optional"> (任意)</span>}
          </label>
          {placeholder.type === 'textarea' ? (
            <textarea
              value={formData[placeholder.id] || ''}
              onChange={(e) => handleInputChange(placeholder.id, e.target.value)}
              placeholder={placeholder.placeholder}
              rows={4}
            />
          ) : (
            <input
              type="text"
              value={formData[placeholder.id] || ''}
              onChange={(e) => handleInputChange(placeholder.id, e.target.value)}
              placeholder={placeholder.placeholder}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default InputForm
