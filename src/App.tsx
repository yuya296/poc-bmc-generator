import { useState, useEffect, useCallback } from 'react'
import TemplateSelector from './components/TemplateSelector'
import InputForm from './components/InputForm'
import OutputDisplay from './components/OutputDisplay'
import ApiKeyInput from './components/ApiKeyInput'
import type { Template, FormData, ChatCompletionResponse, OpenRouterError, SavedResult } from './types'
import './App.css'

function App(): JSX.Element {
  const [apiKey, setApiKey] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [formData, setFormData] = useState<FormData>({})
  const [output, setOutput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key')
    if (savedApiKey !== null) {
      setApiKey(savedApiKey)
    }
  }, [])

  const handleApiKeyChange = (key: string): void => {
    setApiKey(key)
    localStorage.setItem('openrouter_api_key', key)
  }

  const handleTemplateSelect = (template: Template): void => {
    setSelectedTemplate(template)
    setFormData({})
    setOutput('')
    setError('')
  }

  const handleFormDataChange = useCallback((data: FormData): void => {
    setFormData(data)
  }, [])

  const generatePrompt = (template: Template, data: FormData): string => {
    let prompt = template.promptTemplate

    // Replace placeholders with actual data
    template.placeholders.forEach((placeholder) => {
      const value = data[placeholder.id] ?? ''

      if (placeholder.optional === true && value === '') {
        // Remove optional sections if empty
        prompt = prompt.replace(new RegExp(`\\{${placeholder.id}\\}`, 'g'), '')
      } else if (placeholder.optional === true && value !== '') {
        // Include optional section with label
        prompt = prompt.replace(
          new RegExp(`\\{${placeholder.id}\\}`, 'g'),
          `## ${placeholder.label}\n${value}\n\n`
        )
      } else {
        // Required fields - just replace the placeholder
        prompt = prompt.replace(new RegExp(`\\{${placeholder.id}\\}`, 'g'), value)
      }
    })

    return prompt
  }

  const handleGenerate = async (): Promise<void> => {
    if (apiKey === '') {
      setError('OpenRouter APIキーを入力してください')
      return
    }

    if (selectedTemplate === null) {
      setError('テンプレートを選択してください')
      return
    }

    setLoading(true)
    setError('')

    try {
      const prompt = generatePrompt(selectedTemplate, formData)

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json() as OpenRouterError
        throw new Error(errorData.error?.message ?? 'API呼び出しに失敗しました')
      }

      const data = await response.json() as ChatCompletionResponse
      const result = data.choices[0]?.message?.content ?? ''

      setOutput(result)

      // Save to localStorage with limit (keep only last 10 results)
      const savedData: SavedResult = {
        template: selectedTemplate.id,
        formData,
        output: result,
        timestamp: new Date().toISOString()
      }

      // Get all existing result keys
      const resultKeys = Object.keys(localStorage)
        .filter(key => key.startsWith('result_'))
        .sort()

      // Remove oldest results if we have 10 or more
      if (resultKeys.length >= 10) {
        const keysToRemove = resultKeys.slice(0, resultKeys.length - 9)
        keysToRemove.forEach(key => localStorage.removeItem(key))
      }

      localStorage.setItem(`result_${Date.now()}`, JSON.stringify(savedData))

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'エラーが発生しました'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>🧠 AI対話型ビジネスモデル設計ツール</h1>
          <p>AIと対話しながらビジネスフレームワークを構築</p>
        </div>
      </header>

      <main className="container">
        <ApiKeyInput apiKey={apiKey} onApiKeyChange={handleApiKeyChange} />

        <div className="main-content">
          <section className="template-section">
            <h2>📋 フレームワークを選択</h2>
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateSelect={handleTemplateSelect}
            />
          </section>

          {selectedTemplate !== null && (
            <>
              <section className="input-section">
                <h2>✍️ 入力フォーム</h2>
                <InputForm
                  template={selectedTemplate}
                  formData={formData}
                  onFormDataChange={handleFormDataChange}
                />
                <div className="actions">
                  <button
                    className="btn-primary"
                    onClick={(): void => { void handleGenerate() }}
                    disabled={loading || apiKey === ''}
                  >
                    {loading ? '生成中...' : 'AI生成開始'}
                  </button>
                </div>
                {error !== '' && <div className="error">{error}</div>}
              </section>

              {(loading || output !== '') && (
                <section className="output-section">
                  <h2>📊 生成結果</h2>
                  {loading ? (
                    <div className="loading">
                      <div className="spinner"></div>
                      <p>AIが分析中...</p>
                    </div>
                  ) : (
                    <OutputDisplay output={output} />
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Powered by OpenRouter • サーバーレス構成</p>
        </div>
      </footer>
    </div>
  )
}

export default App
