'use client'
import Icon from '@/components/ui/icon'

const OtherSection = () => {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-secondary">
          <Icon type="search" size="lg" className="text-muted" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-primary">
          Other Section
        </h2>
        <p className="max-w-md text-sm text-muted">
          This section is currently empty. Additional features and content will
          be added here in the future.
        </p>
      </div>
    </div>
  )
}

export default OtherSection
