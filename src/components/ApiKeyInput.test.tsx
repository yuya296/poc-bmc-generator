import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ApiKeyInput from './ApiKeyInput'

describe('ApiKeyInput', () => {
  it('renders API key input field', () => {
    const mockOnChange = vi.fn()
    render(<ApiKeyInput apiKey="" onApiKeyChange={mockOnChange} />)

    const input = screen.getByPlaceholderText('sk-or-v1-...')
    expect(input).toBeInTheDocument()
  })

  it('displays the API key value', () => {
    const mockOnChange = vi.fn()
    const testKey = 'sk-or-v1-test-key'
    render(<ApiKeyInput apiKey={testKey} onApiKeyChange={mockOnChange} />)

    const input = screen.getByPlaceholderText('sk-or-v1-...') as HTMLInputElement
    expect(input.value).toBe(testKey)
  })

  it('calls onApiKeyChange when input changes', () => {
    const mockOnChange = vi.fn()
    render(<ApiKeyInput apiKey="" onApiKeyChange={mockOnChange} />)

    const input = screen.getByPlaceholderText('sk-or-v1-...')
    fireEvent.change(input, { target: { value: 'new-key' } })

    expect(mockOnChange).toHaveBeenCalledWith('new-key')
  })

  it('toggles password visibility', () => {
    const mockOnChange = vi.fn()
    render(<ApiKeyInput apiKey="test-key" onApiKeyChange={mockOnChange} />)

    const input = screen.getByPlaceholderText('sk-or-v1-...') as HTMLInputElement
    const toggleButton = screen.getByRole('button')

    // Initially should be password type
    expect(input.type).toBe('password')

    // Click to show
    fireEvent.click(toggleButton)
    expect(input.type).toBe('text')

    // Click to hide again
    fireEvent.click(toggleButton)
    expect(input.type).toBe('password')
  })

  it('renders OpenRouter link', () => {
    const mockOnChange = vi.fn()
    render(<ApiKeyInput apiKey="" onApiKeyChange={mockOnChange} />)

    const link = screen.getByText('OpenRouterでAPIキーを取得')
    expect(link).toHaveAttribute('href', 'https://openrouter.ai/keys')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
