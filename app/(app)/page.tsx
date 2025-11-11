'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Heart,
  ArrowRight,
  BookHeart,
  Clock,
  ImageIcon,
  Shield,
} from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'

import { Button } from '@/components/ui/button'
import { getFeaturedMemorials } from '@/lib/sanity-queries'
import Countdown from '@/components/countdown-alt'

const navigationCards = [
  {
    title: 'Wall of Honour',
    description:
      'Explore tributes to fallen heroes, serving soldiers, and acts of gallantry',
    icon: Shield,
    link: '/wall',
  },
  {
    title: 'Timeline',
    description:
      'Trace the history of the Nigerian Armed Forces through the years',
    icon: Clock,
    link: '/timeline',
  },
  {
    title: 'Gallery',
    description: 'View moments of service, sacrifice, and pride',
    icon: ImageIcon,
    link: '/gallery',
  },
  {
    title: 'Guestbook',
    description: 'Share your message of gratitude and remembrance',
    icon: BookHeart,
    link: '/guestbook',
  },
]

const Home = () => {
  const [featuredMemorials, setFeaturedMemorials] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemorials = async () => {
      try {
        const data = await getFeaturedMemorials()

        // Convert image objects to URLs and set tribute counts
        const memorialsWithImages = data.map((memorial: any) => ({
          ...memorial,
          id: memorial._id, // Map _id to id for compatibility
          imageUrl: memorial.image
            ? urlFor(memorial.image).url()
            : '/placeholder.svg',
          tributeCount: memorial.tributeCount || 0,
        }))
        setFeaturedMemorials(memorialsWithImages)
      } catch (error) {
        console.error('Error fetching featured memorials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemorials()
  }, [])

  if (loading) {
    return (
      <div className='min-h-screen pt-16 flex items-center justify-center'>
        <div className='text-center'>
          <p>Loading memorials...</p>
        </div>
      </div>
    )
  }

  // Filter featured memorials based on search query
  const filteredMemorials = searchQuery
    ? featuredMemorials.filter((memorial) =>
        memorial.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : featuredMemorials

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative min-h-[90vh] flex items-center justify-center overflow-hidden'>
        {/* Hero Background Image */}
        <div className='absolute inset-0'>
          <img
            src='/hero-soldier.png'
            alt='Nigerian Armed Forces soldiers saluting'
            className='w-full h-full object-cover object-center'
          />
          {/* Dark overlay for readability */}
          <div className='absolute inset-0 bg-background/50' />
        </div>

        <div className='container relative z-10 mx-auto px-6 text-center animate-fade-in'>
          <div className='max-w-3xl mx-auto space-y-4'>
            <div className='text-white/80 text-[12px] font-medium tracking-[0.35em] uppercase'>
              Nigerian Armed Forces
            </div>

            <h1 className='font-serif font-bold text-foreground leading-[1.1] tracking-tight'>
              Thank A <span className='text-accent'>Soldier</span>
            </h1>

            <p className='text-lg md:text-xl text-foreground/75 leading-relaxed max-w-3xl mx-auto'>
              Honouring those who gave their lives and those who continue to
              serve our nation
            </p>

            <div className='pt-2'>
              <Link href='/wall'>
                <Button
                  size='lg'
                  className='group bg-accent hover:bg-accent/90 text-accent-foreground transition-smooth'
                >
                  Explore Wall of Honour
                  <ArrowRight className='ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className='absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent' />
      </section>

      {/* Countdown Section */}
      <section className='py-16 px-6 relative'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(0_45%_38%/0.05),transparent_50%)]' />

        <div className='container relative mx-auto max-w-3xl'>
          <Countdown
            targetDate='2026-01-15T00:00:00'
            eventName='Armed Forces Celebration and Remembrance Day'
          />
        </div>
      </section>

      {/* Mission Statement */}
      <section className='py-20 px-6'>
        <div className='container mx-auto max-w-3xl text-center space-y-6 animate-fade-in'>
          <div className='h-px w-12 mx-auto bg-accent/40' />

          <p className='text-lg text-foreground/85 leading-relaxed font-light'>
            Every year, Nigerians at home and abroad unite to honour the men and
            women of the Nigerian Armed Forces — remembering the fallen,
            celebrating those still in service, and recognising acts of
            gallantry.
          </p>

          <p className='text-sm text-muted-foreground italic'>
            This portal is a national space of reflection, appreciation, and
            support.
          </p>
        </div>
      </section>

      {/* Navigation Cards - Premium Grid */}
      <section className='py-20 px-6 relative'>
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,hsl(145_40%_18%/0.05),transparent_50%)]' />

        <div className='container relative mx-auto max-w-6xl'>
          <div className='text-center mb-12 space-y-3 animate-slide-up'>
            <h2 className='font-serif font-semibold text-foreground'>
              Explore & Honour
            </h2>
            <p className='text-muted-foreground font-light'>
              Discover the stories, history, and legacy of Nigerian heroes
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-slow'>
            {navigationCards.map((card, index) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.link}
                  href={card.link}
                  className='group'
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className='relative h-full gradient-card rounded-xl p-6 border border-border/40 hover:border-accent/40 transition-smooth hover:shadow-hover'>
                    {/* Subtle glow on hover */}
                    <div className='absolute inset-0 rounded-xl bg-linear-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-transparent transition-smooth' />

                    <div className='relative space-y-3'>
                      <div className='flex items-start justify-between'>
                        <div className='p-2.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-smooth'>
                          <Icon className='w-5 h-5' />
                        </div>
                        <ArrowRight className='w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-smooth' />
                      </div>

                      <div className='space-y-1.5'>
                        <h3 className='text-xl font-serif font-semibold text-foreground group-hover:text-accent transition-smooth'>
                          {card.title}
                        </h3>
                        <p className='text-sm text-muted-foreground leading-relaxed'>
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
