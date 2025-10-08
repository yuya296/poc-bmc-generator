/**
 * Template placeholder definition
 */
export interface Placeholder {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
  optional?: boolean;
}

/**
 * Template definition structure
 */
export interface Template {
  id: string;
  name: string;
  description: string;
  placeholders: Placeholder[];
  promptTemplate: string;
}

/**
 * Form data for template inputs
 */
export interface FormData {
  [key: string]: string;
}

/**
 * OpenRouter API message structure
 */
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * OpenRouter API request body
 */
export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
}

/**
 * OpenRouter API response structure
 */
export interface ChatCompletionResponse {
  choices: Array<{
    message?: {
      content?: string;
    };
  }>;
}

/**
 * OpenRouter API error response
 */
export interface OpenRouterError {
  error?: {
    message?: string;
  };
}

/**
 * Saved result data structure
 */
export interface SavedResult {
  template: string;
  formData: FormData;
  output: string;
  timestamp: string;
}
