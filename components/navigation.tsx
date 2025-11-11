'use client'

import { forwardRef } from 'react'
import { Home, Image, Clock, BookHeart, Grid3x3 } from 'lucide-react'

import { cn } from '@/lib/utils'
import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/gallery', label: 'Gallery', icon: Image },
    { to: '/timeline', label: 'Timeline', icon: Clock },
    { to: '/guestbook', label: 'Guestbook', icon: BookHeart },
    { to: '/wall', label: 'Wall', icon: Grid3x3 },
  ]

  return (
    <nav
      className='fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-gentle'
      role='navigation'
      aria-label='Main navigation'
    >
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo/Brand */}
          <Link
            href='/'
            className='font-serif text-xl font-bold text-foreground hover:text-primary transition-smooth'
          >
            Tribute Garden
          </Link>

          {/* Navigation Links */}
          <div className='flex items-center gap-1'>
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                href={to}
                className={
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-smooth text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }
                activeClassName='text-primary bg-secondary font-semibold'
              >
                <Icon className='w-4 h-4' aria-hidden='true' />
                <span className='hidden sm:inline'>{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

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
