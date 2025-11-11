import { Heart, Shield } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='relative border-t border-border/40 mt-32'>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent to-card/50' />

      <div className='container relative mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <Shield className='w-5 h-5 text-accent' />
              <h3 className='font-serif text-xl font-semibold text-foreground'>
                Thank a SOLDIER
              </h3>
            </div>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              This portal honours all members of the <b>Nigerian Armed Forces</b> —
              those who have served, those who have fallen, and those continuing
              to defend the nation with pride, including acts of courage and
              distinguished service.
            </p>
          </div>

          <div className='space-y-4'>
            <h4 className='font-semibold text-foreground'>Quick Links</h4>
            <ul className='space-y-3 text-sm'>
              <li>
                <a
                  href='/wall'
                  className='text-muted-foreground hover:text-accent transition-smooth inline-flex items-center gap-2'
                >
                  Wall of Honour
                </a>
              </li>
              <li>
                <a
                  href='/timeline'
                  className='text-muted-foreground hover:text-accent transition-smooth inline-flex items-center gap-2'
                >
                  Timeline
                </a>
              </li>
              <li>
                <a
                  href='/gallery'
                  className='text-muted-foreground hover:text-accent transition-smooth inline-flex items-center gap-2'
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href='/guestbook'
                  className='text-muted-foreground hover:text-accent transition-smooth inline-flex items-center gap-2'
                >
                  Guestbook
                </a>
              </li>
            </ul>
          </div>

          <div className='space-y-4'>
            <h4 className='font-semibold text-foreground'>
              Armed Forces Remembrance Day
            </h4>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              January 15th — A day to remember and honor those who made the
              ultimate sacrifice in service to Nigeria.
            </p>
          </div>
        </div>

        <div className='border-t border-border/40 pt-4 space-y-1 flex justify-between items-center'>
          <p className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
            Made with <Heart className='w-4 h-4 fill-accent text-accent' /> for
            Nigerian heroes
          </p>
          <p className='text-center text-xs text-muted-foreground/60'>
            © {new Date().getFullYear()} Thank a SOLDIER. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
