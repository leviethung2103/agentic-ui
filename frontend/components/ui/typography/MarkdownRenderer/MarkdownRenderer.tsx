import { type FC } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '../../../../lib/utils'
import { type MarkdownRendererProps } from './types'
import {
  Table,
  TableHead,
  TableHeadCell,
  TableBody,
  TableRow,
  TableCell
} from './styles'
import CodeBlock from '../../CodeBlock'

// Custom components for markdown rendering
const components = {
  // Headings
  h1: ({ node, ...props }: any) => (
    <h1 className="my-4 text-3xl font-bold" {...props} />
  ),
  h2: ({ node, ...props }: any) => (
    <h2 className="my-3 text-2xl font-bold" {...props} />
  ),
  h3: ({ node, ...props }: any) => (
    <h3 className="my-2 text-xl font-bold" {...props} />
  ),
  // Lists
  ol: ({ node, ...props }: any) => (
    <ol className="my-2 list-decimal space-y-1 pl-6" {...props} />
  ),
  ul: ({ node, ...props }: any) => (
    <ul className="my-2 list-disc space-y-1 pl-6" {...props} />
  ),
  li: ({ node, ...props }: any) => <li className="my-1" {...props} />,
  // Code blocks
  code: ({ node, inline, className, children, ...props }: any) => {
    // Handle inline code blocks (single backticks)
    if (inline) {
      return (
        <code
          className={cn('rounded bg-gray-800 px-1.5 py-0.5 text-sm', className)}
          {...props}
        >
          {children}
        </code>
      )
    }

    // Handle code blocks (triple backticks)
    const match = /language-(\w+)/.exec(className || '')
    const language = match ? match[1] : 'plaintext'
    const code = String(children).replace(/\n$/, '')

    // Only render as code block if there are newlines or it's explicitly a code block
    const shouldRenderAsBlock =
      code.includes('\n') || className?.includes('language-')

    return shouldRenderAsBlock ? (
      <CodeBlock language={language} code={code} />
    ) : (
      <code
        className={cn('rounded bg-gray-800 px-1.5 py-0.5 text-sm', className)}
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children }: any) => {
    // The CodeBlock component is already rendered by the code component
    return children
  },
  table: Table,
  thead: TableHead,
  th: TableHeadCell,
  tbody: TableBody,
  tr: TableRow,
  td: TableCell,
  a: ({ node, ...props }: any) => (
    <a
      {...props}
      className="text-brand hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    />
  )
  // Add other custom components as needed
}

const MarkdownRenderer: FC<MarkdownRendererProps> = ({
  children,
  classname,
  inline = false
}) => (
  <ReactMarkdown
    className={cn(
      'prose prose-base md:prose-lg prose-h1:text-2xl prose-p:text-lg dark:prose-invert flex w-full flex-col gap-y-5 rounded-lg',
      classname
    )}
    components={components}
    remarkPlugins={[remarkGfm]}
  >
    {children}
  </ReactMarkdown>
)

export default MarkdownRenderer
