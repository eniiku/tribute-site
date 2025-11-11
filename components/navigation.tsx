'use client'

import { forwardRef } from 'react'
import { Home, Image, Clock, BookHeart, Grid3x3 } from 'lucide-react'

import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/wall", label: "Wall of Honour", icon: Grid3x3 },
    { to: "/timeline", label: "Timeline", icon: Clock },
    { to: "/gallery", label: "Gallery", icon: Image },
    { to: "/guestbook", label: "Guestbook", icon: BookHeart },
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 glass-effect shadow-elegant"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <NavLink 
            href="/" 
            className="font-serif text-2xl font-semibold text-foreground hover:text-accent transition-smooth tracking-tight"
          >
            Thank A <span className="text-accent">Soldier</span>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                href={to}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth",
                  "text-muted-foreground hover:text-foreground hover:bg-primary/10"
                )}
                activeClassName="text-accent bg-accent/10 font-semibold"
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navigation

interface NavLinkProps extends Omit<LinkProps, 'className'> {
  className?: string
  activeClassName?: string
  children: React.ReactNode
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName, href, children, ...props }, ref) => {
    const pathname = usePathname()

    const hrefAsString = href.toString()
    const isActive =
      hrefAsString === '/'
        ? pathname === hrefAsString
        : pathname.startsWith(hrefAsString)

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    )
  }
)

NavLink.displayName = 'NavLink'

export { NavLink }
