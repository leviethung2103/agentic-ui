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
    <div className="relative my-4 rounded-md overflow-hidden bg-[#1e1e1e] border border-gray-700">
      {language && (
        <div className="flex justify-between items-center px-4 py-2 bg-gray-800 text-gray-400 text-xs">
          <span className="uppercase">{language}</span>
          <button
            ref={copyButtonRef}
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-white transition-colors"
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
      <pre className="p-4 overflow-x-auto text-sm">
        <code 
          ref={codeRef}
          className={`language-${language} font-mono`}
        >
          {code}
        </code>
      </pre>
    </div>
  )
}

export default CodeBlock
