'use client'

import { useState } from 'react'
import { Search, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AudioPlayer from '@/components/audio-player'
import MemorialCard from '@/components/memorial-card'
import Link from 'next/link'

// Mock data for featured memorials
const featuredMemorials = [
  {
    id: '1',
    name: 'Dr. Sarah Mitchell',
    role: 'Professor of Biology',
    department: 'Natural Sciences',
    years: '1955 - 2023',
    imageUrl: '/placeholder.svg',
    tributeCount: 28,
  },
  {
    id: '2',
    name: "James O'Connor",
    role: 'Director of Student Services',
    department: 'Administration',
    years: '1948 - 2022',
    imageUrl: '/placeholder.svg',
    tributeCount: 42,
  },
  {
    id: '3',
    name: 'Prof. María Rodríguez',
    role: 'Chair of Mathematics',
    department: 'Mathematics',
    years: '1962 - 2024',
    imageUrl: '/placeholder.svg',
    tributeCount: 35,
  },
]

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className='min-h-screen pt-16'>
      {/* Audio Player */}
      <AudioPlayer />

      {/* Hero Section */}
      <section className='relative py-24 px-4 bg-gradient-to-b from-secondary/30 to-background'>
        <div className='container mx-auto max-w-4xl text-center animate-fade-in-slow'>
          <div className='mb-6 inline-flex items-center gap-2 text-accent'>
            <Heart className='w-5 h-5' />
            <span className='text-sm font-medium tracking-wide uppercase'>
              In Loving Memory
            </span>
          </div>

          <h1 className='text-5xl md:text-6xl font-serif font-bold mb-6 text-foreground leading-tight'>
            Honoring Our Beloved
          </h1>

          <p className='text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed'>
            A place to remember, celebrate, and honor the lives of those who
            shaped our community with their wisdom, kindness, and dedication.
          </p>

          {/* Search Bar */}
          <div className='max-w-xl mx-auto mb-8'>
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
              <Input
                type='text'
                placeholder='Search by name...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-12 py-6 text-base shadow-gentle border-border/50 focus:border-primary'
              />
            </div>
          </div>

          <Link href='/gallery'>
            <Button
              size='lg'
              className='px-8 py-6 text-base font-medium shadow-soft hover:shadow-gentle transition-smooth'
            >
              View Memorial Gallery
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Memorials */}
      <section className='py-20 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-16 animate-fade-in'>
            <h2 className='text-3xl md:text-4xl font-serif font-bold mb-4'>
              Featured Tributes
            </h2>
            <p className='text-muted-foreground max-w-2xl mx-auto'>
              Honoring those who have recently passed and made lasting impacts
              on our community.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {featuredMemorials.map((memorial, index) => (
              <div
                key={memorial.id}
                className='animate-fade-in'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MemorialCard memorial={memorial} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className='py-20 px-4 bg-secondary/30'>
        <div className='container mx-auto max-w-4xl text-center animate-fade-in'>
          <h2 className='text-3xl md:text-4xl font-serif font-bold mb-6'>
            Share Your Memories
          </h2>
          <p className='text-lg text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Your words of remembrance help celebrate their lives and bring
            comfort to others. Share a tribute today.
          </p>
          <Link href='/gallery'>
            <Button
              variant='outline'
              size='lg'
              className='px-8 py-6 text-base font-medium border-2 hover:bg-primary hover:text-primary-foreground transition-smooth'
            >
              Leave a Tribute
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
