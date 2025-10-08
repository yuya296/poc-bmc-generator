import { useState } from 'react'
import './ApiKeyInput.css'

function ApiKeyInput({ apiKey, onApiKeyChange }) {
  const [showKey, setShowKey] = useState(false)

  return (
    <section className="api-key-section">
      <h2>🔑 OpenRouter APIキー設定</h2>
      <div className="api-key-input-group">
        <input
          type={showKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          placeholder="sk-or-v1-..."
          className="api-key-input"
        />
        <button
          className="btn-toggle"
          onClick={() => setShowKey(!showKey)}
          type="button"
        >
          {showKey ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      <p className="api-key-note">
        ℹ️ APIキーはlocalStorageに保存されます。サーバーには送信されません。
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenRouterでAPIキーを取得
        </a>
      </p>
    </section>
  )
}

export default ApiKeyInput
