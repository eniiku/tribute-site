'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, Heart } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import MemorialCard from '@/components/memorial-card'
import { getFeaturedMemorials } from '@/lib/sanity-queries'

const Home = () => {
  const [featuredMemorials, setFeaturedMemorials] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemorials = async () => {
      try {
        const data = await getFeaturedMemorials()

        console.log(data)
        // Convert image objects to URLs and set tribute counts
        const memorialsWithImages = data.map((memorial: any) => ({
          ...memorial,
          id: memorial._id, // Map _id to id for compatibility
          imageUrl: memorial.image ? urlFor(memorial.image).url() : '/placeholder.svg',
          tributeCount: memorial.tributes ? memorial.tributes.length : 0
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
        <div className="text-center">
          <p>Loading memorials...</p>
        </div>
      </div>
    )
  }

  // Filter featured memorials based on search query
  const filteredMemorials = searchQuery 
    ? featuredMemorials.filter(memorial => 
        memorial.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : featuredMemorials

  return (
    <div className='min-h-screen pt-16'>
      {/* Hero Section */}
      <section className='relative py-24 px-4 bg-linear-to-b from-secondary/30 to-background'>
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
            {filteredMemorials.map((memorial, index) => (
              <div
                key={memorial.id}
                className='animate-fade-in'
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MemorialCard memorial={memorial} />
              </div>
            ))}
          </div>
          
          {/* Show message when no memorials match search */}
          {searchQuery && filteredMemorials.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No memorials found matching your search.
              </p>
              <Button 
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          )}
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