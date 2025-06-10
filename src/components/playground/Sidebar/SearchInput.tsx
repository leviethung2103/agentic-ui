'use client'

import { useState } from 'react'
import Icon from '@/components/ui/icon'
import { cn } from '@/lib/utils'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search sessions...',
  className
}: SearchInputProps) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    onChange('')
  }

  return (
    <div className="relative w-full">
      <div
        className={cn(
          'relative flex items-center rounded-xl border border-primary/15 bg-accent transition-colors',
          isFocused && 'border-primary/30',
          className
        )}
      >
        <Icon type="search" size="xs" className="absolute left-3 text-muted" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent py-2 pl-9 pr-8 text-xs font-medium text-primary placeholder:text-muted focus:outline-none"
        />
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-2 rounded-full p-1 transition-colors hover:bg-background-secondary/50"
            type="button"
          >
            <Icon type="x" size="xxs" className="text-muted" />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchInput
