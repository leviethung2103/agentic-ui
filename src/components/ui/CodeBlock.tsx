'use client'

import { FC, useEffect, useRef } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark-dimmed.css'

type CodeBlockProps = {
  language?: string
  code: string
}

const CodeBlock: FC<CodeBlockProps> = ({ language = 'plaintext', code }) => {
  const codeRef = useRef<HTMLElement>(null)
  const copyButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      // Apply syntax highlighting
      hljs.highlightElement(codeRef.current)
    }
  }, [code, language])

  const handleCopy = async () => {
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
      const button = copyButtonRef.current
      if (button) {
        const originalText = button.textContent
        button.textContent = 'Copied!'
        button.classList.add('text-green-400')
        setTimeout(() => {
          if (button) {
            button.textContent = originalText
            button.classList.remove('text-green-400')
          }
        }, 2000)
      }
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="relative my-6 overflow-hidden rounded-lg border border-gray-700 bg-[#1e1e1e] shadow-lg">
      {language && (
        <div className="flex items-center justify-between border-b border-gray-700 bg-gray-800/80 px-5 py-3 text-xs text-gray-300">
          <span className="font-medium uppercase tracking-wider text-gray-400">
            {language}
          </span>
          <button
            ref={copyButtonRef}
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-gray-700 px-3 py-1.5 text-gray-300 transition-colors duration-200 hover:bg-gray-600 hover:text-white"
            aria-label="Copy code"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </button>
        </div>
      )}
      <pre className="m-0 overflow-x-auto text-sm leading-relaxed">
        <code
          ref={codeRef}
          className={`language-${language} block p-5 font-mono`}
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            lineHeight: '1.5',
            tabSize: 2
          }}
        >
          {code}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlock
