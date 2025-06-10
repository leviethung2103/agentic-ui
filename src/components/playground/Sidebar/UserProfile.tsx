'use client'

import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Icon from '@/components/ui/icon'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const UserProfile = () => {
  const { user, logout, isAuthenticated } = useAuth0()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()

  if (!isAuthenticated || !user) {
    return null
  }

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    })
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const navigateToSettings = () => {
    setIsDropdownOpen(false)
    router.push('/knowledge')
  } 

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: 'easeInOut'
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: 'easeOut'
      }
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.1,
        ease: 'easeIn'
      }
    }
  }

  return (
    <div className="relative">
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="absolute bottom-full left-0 z-50 mb-2 w-full min-w-[200px] rounded-xl border border-border bg-primaryAccent shadow-lg"
            >
              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10"
                  onClick={navigateToSettings}
                >
                  <Icon type="sheet" size="xs" className="mr-2" />
                  Settings
                </Button>

                <div className="my-1 h-px bg-border" />

                <Button
                  variant="ghost"
                  className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    handleLogout()
                  }}
                >
                  <Icon type="x" size="xs" className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Profile Button */}
      <Button
        variant="ghost"
        className={cn(
          'w-full justify-start rounded-xl p-3 transition-colors duration-200',
          isDropdownOpen
            ? 'bg-primary/10 text-primary'
            : 'text-muted hover:bg-primary/5 hover:text-primary'
        )}
        onClick={toggleDropdown}
      >
        <div className="flex w-full items-center gap-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {user.picture ? (
              <img
                src={user.picture || '/placeholder.svg'}
                alt={user.name || 'User avatar'}
                className="size-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-8 items-center justify-center rounded-full bg-brand text-primary">
                <Icon type="user" size="xs" />
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-primaryAccent bg-positive" />
          </div>

          {/* User Info */}
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <p className="truncate text-sm font-medium">
              {user.name || 'User'}
            </p>
            <p className="truncate text-xs opacity-70">
              {user.email || 'user@example.com'}
            </p>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isDropdownOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex-shrink-0"
          >
            <Icon type="chevron-up" size="xs" className="opacity-50" />
          </motion.div>
        </div>
      </Button>
    </div>
  )
}

export default UserProfile
