import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import TemplateSelector from './TemplateSelector'
import type { Template } from '../types'

// Mock fetch
const mockTemplates: Template[] = [
  {
    id: 'bmc',
    name: 'ビジネスモデルキャンバス',
    description: 'BMC説明',
    promptTemplate: 'template',
    placeholders: []
  },
  {
    id: 'swot',
    name: 'SWOT分析',
    description: 'SWOT説明',
    promptTemplate: 'template',
    placeholders: []
  }
]

global.fetch = vi.fn()

describe('TemplateSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows loading state initially', () => {
    ;(global.fetch as any).mockImplementation(() => new Promise(() => {}))

    const mockOnSelect = vi.fn()
    render(<TemplateSelector selectedTemplate={null} onTemplateSelect={mockOnSelect} />)

    expect(screen.getByText('テンプレート読み込み中...')).toBeInTheDocument()
  })

  it('renders templates after loading', async () => {
    ;(global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('bmc.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockTemplates[0]
        })
      }
      if (url.includes('swot.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockTemplates[1]
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({})
      })
    })

    const mockOnSelect = vi.fn()
    render(<TemplateSelector selectedTemplate={null} onTemplateSelect={mockOnSelect} />)

    await waitFor(() => {
      expect(screen.queryByText('テンプレート読み込み中...')).not.toBeInTheDocument()
    })

    expect(screen.getByText('ビジネスモデルキャンバス')).toBeInTheDocument()
    expect(screen.getByText('SWOT分析')).toBeInTheDocument()
  })

  it('shows error when fetch fails', async () => {
    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

    const mockOnSelect = vi.fn()
    render(<TemplateSelector selectedTemplate={null} onTemplateSelect={mockOnSelect} />)

    await waitFor(() => {
      expect(screen.getByText('テンプレートの読み込みに失敗しました')).toBeInTheDocument()
    })
  })

  it('calls onTemplateSelect when template is clicked', async () => {
    ;(global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('bmc.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockTemplates[0]
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({})
      })
    })

    const mockOnSelect = vi.fn()
    render(<TemplateSelector selectedTemplate={null} onTemplateSelect={mockOnSelect} />)

    await waitFor(() => {
      expect(screen.getByText('ビジネスモデルキャンバス')).toBeInTheDocument()
    })

    const templateCard = screen.getByText('ビジネスモデルキャンバス').closest('.template-card')
    if (templateCard) {
      fireEvent.click(templateCard)
      expect(mockOnSelect).toHaveBeenCalledWith(mockTemplates[0])
    }
  })

  it('highlights selected template', async () => {
    ;(global.fetch as any).mockImplementation((url: string) => {
      if (url.includes('bmc.json')) {
        return Promise.resolve({
          ok: true,
          json: async () => mockTemplates[0]
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({})
      })
    })

    const mockOnSelect = vi.fn()
    render(<TemplateSelector selectedTemplate={mockTemplates[0]} onTemplateSelect={mockOnSelect} />)

    await waitFor(() => {
      expect(screen.getByText('ビジネスモデルキャンバス')).toBeInTheDocument()
    })

    const templateCard = screen.getByText('ビジネスモデルキャンバス').closest('.template-card')
    expect(templateCard).toHaveClass('selected')
  })
})
