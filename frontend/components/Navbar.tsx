"use client"

import Link from "next/link"
import { signOut, useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Navbar = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = async () => {
    await signOut({
      redirect: false,
      callbackUrl: "/auth/signin",
    })
    router.push("/auth/signin")
    router.refresh()
  }

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (status === "loading") {
    return null
  }

  return (
    <nav className="bg-background shadow-lg border-b border-border">
      <div className="max-w-full mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 relative">
          {/* Left side - Logo */}
          <div className="flex items-center min-w-0 flex-1">
            <Link
              href="/"
              className="text-primary text-lg font-semibold hover:text-primary/80 transition-colors whitespace-nowrap"
            >
              KMSLV Chatbot
            </Link>
          </div>

          {/* Center - Navigation Links */}
          {status === "authenticated" && session?.user && (
            <div className="hidden md:flex items-center justify-center flex-1 max-w-2xl mx-8">
              <div className="flex items-center space-x-2 bg-accent/50 rounded-xl p-1">
                <Link
                  href="/chat"
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${pathname === "/chat"
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted-foreground hover:bg-background hover:text-primary"
                    }`}
                >
                  Chat
                </Link>
                <Link
                  href="/knowledge-base"
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${pathname.startsWith("/knowledge-base")
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted-foreground hover:bg-background hover:text-primary"
                    }`}
                >
                  Knowledge Base
                </Link>
                {session.user.role === "admin" && (
                  <Link
                    href="/admin/users"
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${pathname.startsWith("/admin")
                      ? "bg-brand text-white shadow-sm"
                      : "text-muted-foreground hover:bg-background hover:text-primary"
                      }`}
                  >
                    User Management
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Right side - User Info and Actions */}
          <div className="flex items-center justify-end min-w-0 flex-1">
            {session ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar and Info */}
                <div className="flex items-center space-x-3 bg-accent/30 rounded-xl px-4 py-2">
                  <Avatar className="h-8 w-8 ring-2 ring-brand/20">
                    <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User"} />
                    <AvatarFallback className="bg-brand text-white text-sm font-medium">
                      {session.user.name ? getUserInitials(session.user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      {session.user.name || "User"}
                    </span>

                    {/* Admin Badge */}
                    {session.user.role === "admin" && (
                      <span className="bg-brand text-white text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Mobile Navigation */}
        {status === "authenticated" && session?.user && (
          <div className="md:hidden pb-3 pt-2 border-t border-border mt-3">
            <div className="flex flex-col space-y-1">
              <Link
                href="/chat"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === "/chat"
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-primary"
                  }`}
              >
                Chat
              </Link>
              <Link
                href="/knowledge-base"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname.startsWith("/knowledge-base")
                  ? "bg-brand text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-primary"
                  }`}
              >
                Knowledge Base
              </Link>
              {session.user.role === "admin" && (
                <Link
                  href="/admin/users"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname.startsWith("/admin")
                    ? "bg-brand text-white"
                    : "text-muted-foreground hover:bg-accent hover:text-primary"
                    }`}
                >
                  User Management
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
