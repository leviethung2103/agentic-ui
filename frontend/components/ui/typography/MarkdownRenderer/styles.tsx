'use client'

import { FC, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '../../../../lib/utils'

import type {
  UnorderedListProps,
  OrderedListProps,
  EmphasizedTextProps,
  ItalicTextProps,
  StrongTextProps,
  BoldTextProps,
  DeletedTextProps,
  UnderlinedTextProps,
  HorizontalRuleProps,
  BlockquoteProps,
  AnchorLinkProps,
  HeadingProps,
  ImgProps,
  ParagraphProps,
  TableHeaderCellProps,
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
  PreparedTextProps
} from './types'

import { HEADING_SIZES } from '../Heading/constants'
import { PARAGRAPH_SIZES } from '../Paragraph/constants'

const filterProps = (props: object) => {
  const newProps = { ...props }

  if ('node' in newProps) {
    delete newProps.node
  }

  return newProps
}

const UnorderedList = ({ className, ...props }: UnorderedListProps) => (
  <ul
    className={cn(
      className,
      PARAGRAPH_SIZES.body,
      'flex list-disc flex-col pl-10'
    )}
    {...filterProps(props)}
  />
)

const OrderedList = ({ className, ...props }: OrderedListProps) => (
  <ol
    className={cn(
      className,
      PARAGRAPH_SIZES.body,
      'flex list-decimal flex-col pl-10'
    )}
    {...filterProps(props)}
  />
)

const Paragraph = ({ className, ...props }: ParagraphProps) => (
  <p className={cn(className, PARAGRAPH_SIZES.body)} {...filterProps(props)} />
)

const EmphasizedText = ({ className, ...props }: EmphasizedTextProps) => (
  <em
    className={cn(className, 'text-sm font-semibold')}
    {...filterProps(props)}
  />
)

const ItalicText = ({ className, ...props }: ItalicTextProps) => (
  <i
    className={cn(className, 'italic', PARAGRAPH_SIZES.body)}
    {...filterProps(props)}
  />
)

const StrongText = ({ className, ...props }: StrongTextProps) => (
  <strong
    className={cn(className, 'text-sm font-semibold')}
    {...filterProps(props)}
  />
)

const BoldText = ({ className, ...props }: BoldTextProps) => (
  <b
    className={cn(className, 'text-sm font-semibold')}
    {...filterProps(props)}
  />
)

const UnderlinedText = ({ className, ...props }: UnderlinedTextProps) => (
  <u
    className={cn(className, 'underline', PARAGRAPH_SIZES.body)}
    {...filterProps(props)}
  />
)

const DeletedText = ({ className, ...props }: DeletedTextProps) => (
  <del
    className={cn(className, 'text-muted line-through', PARAGRAPH_SIZES.body)}
    {...filterProps(props)}
  />
)

const HorizontalRule = ({ className, ...props }: HorizontalRuleProps) => (
  <hr
    className={cn(className, 'mx-auto w-48 border-b border-border')}
    {...filterProps(props)}
  />
)

const InlineCode: FC<PreparedTextProps> = ({
  children,
  className,
  ...props
}) => {
  // If this is a code block (has className), render it differently
  if (className) {
    return (
      <pre className="my-4 overflow-x-auto rounded-md bg-background-secondary/50 p-4">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
    )
  }

  // Inline code
  return (
    <code className="relative whitespace-pre-wrap rounded-sm bg-background-secondary/50 p-1">
      {children}
    </code>
  )
}

const Blockquote = ({ className, ...props }: BlockquoteProps) => (
  <blockquote
    className={cn(className, 'italic', PARAGRAPH_SIZES.body)}
    {...filterProps(props)}
  />
)

const AnchorLink = ({ className, ...props }: AnchorLinkProps) => (
  <a
    className={cn(className, 'cursor-pointer text-xs underline')}
    target="_blank"
    rel="noopener noreferrer"
    {...filterProps(props)}
  />
)

const Heading1 = ({ className, ...props }: HeadingProps) => (
  <h1 className={cn(className, HEADING_SIZES[3])} {...filterProps(props)} />
)

const Heading2 = ({ className, ...props }: HeadingProps) => (
  <h2 className={cn(className, HEADING_SIZES[3])} {...filterProps(props)} />
)

const Heading3 = ({ className, ...props }: HeadingProps) => (
  <h3 className={cn(className, PARAGRAPH_SIZES.lead)} {...filterProps(props)} />
)

const Heading4 = ({ className, ...props }: HeadingProps) => (
  <h4 className={cn(className, PARAGRAPH_SIZES.lead)} {...filterProps(props)} />
)

const Heading5 = ({ className, ...props }: HeadingProps) => (
  <h5
    className={cn(className, PARAGRAPH_SIZES.title)}
    {...filterProps(props)}
  />
)

const Heading6 = ({ className, ...props }: HeadingProps) => (
  <h6
    className={cn(className, PARAGRAPH_SIZES.title)}
    {...filterProps(props)}
  />
)

const Img = ({ src, alt }: ImgProps) => {
  const [error, setError] = useState(false)

  if (!src) return null

  return (
    <div className="w-full max-w-xl">
      {error ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md bg-secondary/50 text-muted">
          <Paragraph className="text-primary">Image unavailable</Paragraph>
          <Link
            href={typeof src === 'string' ? src : '#'}
            target="_blank"
            className="max-w-md truncate underline"
          >
            {typeof src === 'string' ? src : 'Image source'}
          </Link>
        </div>
      ) : typeof src === 'string' ? (
        <Image
          src={src}
          alt={alt || ''}
          className="rounded-md object-cover"
          width={800}
          height={400}
          onError={() => setError(true)}
        />
      ) : (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md bg-secondary/50 text-muted">
          <Paragraph className="text-primary">Unsupported image format</Paragraph>
        </div>
      )}
    </div>
  )
}

export const Table = ({ className, ...props }: TableProps) => (
  <div className="relative my-4 w-full overflow-hidden rounded-lg border border-gray-700 bg-[#1e1e1e] shadow-lg">
    <div className="w-full overflow-x-auto">
      <table className={cn(className, 'w-full')} {...filterProps(props)} />
    </div>
  </div>
)

export const TableHead = ({ className, ...props }: TableHeaderProps) => (
  <thead
    className={cn(
      className,
      'rounded-md border-b border-gray-700 bg-gray-800/80 p-2 text-left text-sm font-[600] text-gray-300'
    )}
    {...filterProps(props)}
  />
)

export const TableHeadCell = ({ className, ...props }: TableHeaderCellProps) => (
  <th
    className={cn(className, 'p-2 text-sm font-[600] text-gray-300')}
    {...filterProps(props)}
  />
)

export const TableBody = ({ className, ...props }: TableBodyProps) => (
  <tbody className={cn(className, 'text-sm text-gray-300')} {...filterProps(props)} />
)

export const TableRow = ({ className, ...props }: TableRowProps) => (
  <tr
    className={cn(className, 'border-b border-gray-700 last:border-b-0')}
    {...filterProps(props)}
  />
)

export const TableCell = ({ className, ...props }: TableCellProps) => (
  <td
    className={cn(className, 'whitespace-nowrap p-2 font-[400] text-gray-300')}
    {...filterProps(props)}
  />
)

// Types for code block props
interface CodeBlockProps {
  children?: React.ReactNode
  className?: string
}

interface CodeProps {
  children?: string | React.ReactNode
  className?: string
  [key: string]: any
}

// Pre component for code blocks
const Pre: FC<CodeBlockProps> = ({ children }) => {
  if (!children || typeof children !== 'object' || !('props' in children)) {
    return <div className="my-4">{children}</div>
  }

  const childrenProps = children.props as {
    children?: React.ReactNode[] | React.ReactNode
  }
  const childrenArray = Array.isArray(childrenProps.children)
    ? childrenProps.children
    : childrenProps.children
      ? [childrenProps.children]
      : []

  const codeElement = childrenArray[0] as
    | React.ReactElement<CodeProps>
    | undefined
  const code =
    typeof codeElement?.props?.children === 'string'
      ? codeElement.props.children
      : ''
  const language =
    codeElement?.props?.className?.replace('language-', '') || 'text'

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="my-4 rounded-lg bg-gray-900">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-800 px-4 py-2 text-xs text-gray-300">
        <span className="uppercase">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 transition-colors hover:text-white"
          title="Copy to clipboard"
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
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        </button>
      </div>
      <div className="overflow-x-auto p-4">{children}</div>
    </div>
  )
}

export const components = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  h4: Heading4,
  h5: Heading5,
  h6: Heading6,
  ul: UnorderedList,
  ol: OrderedList,
  em: EmphasizedText,
  i: ItalicText,
  strong: StrongText,
  b: BoldText,
  u: UnderlinedText,
  del: DeletedText,
  hr: HorizontalRule,
  blockquote: Blockquote,
  pre: Pre,
  code: InlineCode,
  a: AnchorLink,
  img: Img,
  p: Paragraph,
  table: Table,
  thead: TableHead,
  th: TableHeadCell,
  tbody: TableBody,
  tr: TableRow,
  td: TableCell
}
