import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import App from './App'

// Mock all components to isolate App logic
vi.mock('./components/TemplateSelector', () => ({
  default: ({ onTemplateSelect }: any) => (
    <div data-testid="template-selector">
      <button onClick={() => onTemplateSelect({
        id: 'bmc',
        name: 'BMC',
        description: 'Test',
        promptTemplate: 'test',
        placeholders: []
      })}>
        Select Template
      </button>
    </div>
  )
}))

vi.mock('./components/InputForm', () => ({
  default: () => <div data-testid="input-form">Input Form</div>
}))

vi.mock('./components/OutputDisplay', () => ({
  default: () => <div data-testid="output-display">Output Display</div>
}))

vi.mock('./components/ApiKeyInput', () => ({
  default: ({ apiKey, onApiKeyChange }: any) => (
    <div data-testid="api-key-input">
      <input
        data-testid="api-key-field"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
      />
    </div>
  )
}))

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the app header', () => {
    render(<App />)

    expect(screen.getByText('🧠 AI対話型ビジネスモデル設計ツール')).toBeInTheDocument()
    expect(screen.getByText('AIと対話しながらビジネスフレームワークを構築')).toBeInTheDocument()
  })

  it('renders the footer', () => {
    render(<App />)

    expect(screen.getByText(/Powered by OpenRouter/)).toBeInTheDocument()
  })

  it('renders API key input', () => {
    render(<App />)

    expect(screen.getByTestId('api-key-input')).toBeInTheDocument()
  })

  it('renders template selector', () => {
    render(<App />)

    expect(screen.getByTestId('template-selector')).toBeInTheDocument()
  })

  it('loads API key from localStorage on mount', () => {
    localStorage.setItem('openrouter_api_key', 'test-key')

    render(<App />)

    const apiKeyField = screen.getByTestId('api-key-field') as HTMLInputElement
    expect(apiKeyField.value).toBe('test-key')
  })

  it('saves API key to localStorage when changed', () => {
    render(<App />)

    const apiKeyField = screen.getByTestId('api-key-field') as HTMLInputElement
    apiKeyField.value = 'new-test-key'
    apiKeyField.dispatchEvent(new Event('change', { bubbles: true }))

    expect(localStorage.getItem('openrouter_api_key')).toBe('new-test-key')
  })

  it('does not show input form before template selection', () => {
    render(<App />)

    expect(screen.queryByTestId('input-form')).not.toBeInTheDocument()
  })

  it('shows input form after template selection', async () => {
    render(<App />)

    const selectButton = screen.getByText('Select Template')
    selectButton.click()

    await waitFor(() => {
      expect(screen.getByTestId('input-form')).toBeInTheDocument()
    })
  })
})
