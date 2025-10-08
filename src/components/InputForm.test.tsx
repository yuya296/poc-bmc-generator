import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import InputForm from './InputForm'
import type { Template } from '../types'

describe('InputForm', () => {
  const mockTemplate: Template = {
    id: 'test',
    name: 'Test Template',
    description: 'Test',
    promptTemplate: 'Template',
    placeholders: [
      {
        id: 'field1',
        label: 'Field 1',
        type: 'text',
        placeholder: 'Enter field 1',
        optional: false
      },
      {
        id: 'field2',
        label: 'Field 2',
        type: 'textarea',
        placeholder: 'Enter field 2',
        optional: true
      }
    ]
  }

  it('renders all placeholder fields', () => {
    const mockOnChange = vi.fn()
    render(<InputForm template={mockTemplate} formData={{}} onFormDataChange={mockOnChange} />)

    expect(screen.getByText('Field 1')).toBeInTheDocument()
    expect(screen.getByText('Field 2')).toBeInTheDocument()
  })

  it('marks optional fields', () => {
    const mockOnChange = vi.fn()
    render(<InputForm template={mockTemplate} formData={{}} onFormDataChange={mockOnChange} />)

    expect(screen.getByText('(任意)')).toBeInTheDocument()
  })

  it('renders text input for text type', () => {
    const mockOnChange = vi.fn()
    render(<InputForm template={mockTemplate} formData={{}} onFormDataChange={mockOnChange} />)

    const input = screen.getByPlaceholderText('Enter field 1')
    expect(input.tagName).toBe('INPUT')
  })

  it('renders textarea for textarea type', () => {
    const mockOnChange = vi.fn()
    render(<InputForm template={mockTemplate} formData={{}} onFormDataChange={mockOnChange} />)

    const textarea = screen.getByPlaceholderText('Enter field 2')
    expect(textarea.tagName).toBe('TEXTAREA')
  })

  it('updates form data when input changes', () => {
    const mockOnChange = vi.fn()
    render(<InputForm template={mockTemplate} formData={{}} onFormDataChange={mockOnChange} />)

    const input = screen.getByPlaceholderText('Enter field 1')
    fireEvent.change(input, { target: { value: 'test value' } })

    expect(mockOnChange).toHaveBeenCalledWith({ field1: 'test value' })
  })

  it('displays existing form data', () => {
    const mockOnChange = vi.fn()
    const formData = {
      field1: 'existing value',
      field2: 'existing text'
    }
    render(<InputForm template={mockTemplate} formData={formData} onFormDataChange={mockOnChange} />)

    const input = screen.getByPlaceholderText('Enter field 1') as HTMLInputElement
    const textarea = screen.getByPlaceholderText('Enter field 2') as HTMLTextAreaElement

    expect(input.value).toBe('existing value')
    expect(textarea.value).toBe('existing text')
  })
})
