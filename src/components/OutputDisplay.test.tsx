import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import OutputDisplay from './OutputDisplay'

describe('OutputDisplay', () => {
  beforeEach(() => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(() => Promise.resolve())
      }
    })

    // Mock alert
    global.alert = vi.fn()

    // Mock URL.createObjectURL and revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  it('renders markdown output as HTML', async () => {
    const markdownOutput = '# Hello\n\nThis is **bold** text.'
    render(<OutputDisplay output={markdownOutput} />)

    await waitFor(() => {
      expect(screen.getByText(/Hello/i)).toBeInTheDocument()
    })
  })

  it('renders copy button', () => {
    render(<OutputDisplay output="test output" />)

    expect(screen.getByText('📋 コピー')).toBeInTheDocument()
  })

  it('renders export button', () => {
    render(<OutputDisplay output="test output" />)

    expect(screen.getByText('💾 Markdown保存')).toBeInTheDocument()
  })

  it('copies markdown to clipboard when copy button is clicked', async () => {
    const output = '# Test Output'
    render(<OutputDisplay output={output} />)

    const copyButton = screen.getByText('📋 コピー')
    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(output)
      expect(global.alert).toHaveBeenCalledWith('Markdownをクリップボードにコピーしました')
    })
  })

  it('downloads markdown file when export button is clicked', () => {
    const output = '# Test Output'
    render(<OutputDisplay output={output} />)

    // Mock document.createElement('a').click()
    const mockClick = vi.fn()
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any)

    const exportButton = screen.getByText('💾 Markdown保存')
    fireEvent.click(exportButton)

    expect(mockClick).toHaveBeenCalled()
    expect(mockAnchor.download).toMatch(/analysis_\d+\.md/)
  })

  it('sanitizes HTML to prevent XSS', async () => {
    const maliciousOutput = '<script>alert("xss")</script><p>Safe content</p>'
    render(<OutputDisplay output={maliciousOutput} />)

    await waitFor(() => {
      const outputContent = document.querySelector('.output-content')
      expect(outputContent?.innerHTML).not.toContain('<script>')
      expect(outputContent?.innerHTML).toContain('Safe content')
    })
  })
})
