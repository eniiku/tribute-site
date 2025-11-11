'use client'

import { toast } from 'sonner'
import { useState, useEffect } from 'react'
import { BookHeart, Send, CheckCircle } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { getGuestbookEntries } from '@/lib/sanity-queries'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '@/components/ui/pagination'

interface GuestbookEntry {
  _id: string
  author: string
  message: string
  submittedAt: string
  location?: string
  relationship?: string // This is added to match the return from getGuestbookEntries
}

const Guestbook = () => {
  const [entries, setEntries] = useState<GuestbookEntry[]>([])
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)

  const entriesPerPage = 10
  const totalEntries = entries.length
  const totalPages = Math.ceil(totalEntries / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentEntries = entries.slice(startIndex, endIndex)

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getGuestbookEntries()
        setEntries(data)
      } catch (error) {
        console.error('Error fetching guestbook entries:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEntries()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: formData.name,
          message: formData.message,
          location: formData.location,
        }),
      })

      if (response.ok) {
        toast.success('Message submitted', {
          description:
            'Your message will appear after moderation. Thank you for your thoughtful words.',
          duration: 5000,
        })
        setFormData({ name: '', location: '', message: '' })

        // Refresh entries after successful submission
        const data = await getGuestbookEntries()
        setEntries(data)
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      toast.error('Submission failed', {
        description:
          'There was an error submitting your message. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  if (loading) {
    return (
      <div className='min-h-screen pt-24 pb-16 px-4 flex items-center justify-center'>
        <div className='text-center'>
          <p>Loading guestbook...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen pt-28 pb-20 px-6'>
      <div className='container mx-auto max-w-4xl'>
        {/* Header */}
        <header className='text-center mb-16 space-y-6 animate-fade-in'>
          <div className='inline-block'>
            <div className='text-accent/80 text-sm font-medium tracking-[0.3em] uppercase mb-4'>
              National Gratitude
            </div>
          </div>

          <h1 className='font-serif font-bold text-foreground'>
            National Guestbook
          </h1>

          <div className='h-px w-24 mx-auto bg-linear-to-r from-transparent via-accent/40 to-transparent' />

          <p className='text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            A shared space for Nigerians to express gratitude, remembrance, and
            pride for all soldiers.
          </p>

          <p className='text-accent/80 font-serif text-xl italic'>
            Your words of honour become part of our collective memory.
          </p>
        </header>

        {/* Submission Form */}
        <Card
          className='p-8 mb-12 shadow-soft animate-fade-in'
          style={{ animationDelay: '100ms' }}
        >
          <h2 className='text-2xl font-serif font-bold mb-6'>
            Leave a Message
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div className='space-y-2'>
                <Label htmlFor='name'>Your Name *</Label>
                <Input
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Enter your name'
                  required
                  className='shadow-gentle'
                  aria-required='true'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='location'>Location (Optional)</Label>
                <Input
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='City, State'
                  className='shadow-gentle'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='message'>Your Message *</Label>
              <Textarea
                id='message'
                name='message'
                value={formData.message}
                onChange={handleChange}
                placeholder='Share your thoughts, memories, or words of comfort...'
                rows={6}
                required
                className='shadow-gentle resize-none'
                aria-required='true'
              />
              <p className='text-sm text-muted-foreground'>
                All messages are reviewed before being published.
              </p>
            </div>

            <Button
              type='submit'
              disabled={isSubmitting}
              className='w-full md:w-auto shadow-gentle'
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className='w-4 h-4 mr-2' aria-hidden='true' />
                  Submit Message
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Entries */}
        <div className='space-y-6'>
          <div
            className='flex items-center justify-between mb-6 animate-fade-in'
            style={{ animationDelay: '200ms' }}
          >
            <h2 className='text-2xl font-serif font-bold'>Recent Messages</h2>
            <p className='text-sm text-muted-foreground'>
              Showing {startIndex + 1}-{Math.min(endIndex, totalEntries)} of{' '}
              {totalEntries} messages
            </p>
          </div>

          {currentEntries.map((entry, index) => (
            <Card
              key={entry._id}
              className='p-6 shadow-gentle hover:shadow-soft transition-smooth animate-fade-in'
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <div className='flex items-start gap-4'>
                <div className='shrink-0 mt-1'>
                  <div className='w-10 h-10 rounded-full bg-secondary flex items-center justify-center'>
                    <CheckCircle
                      className='w-5 h-5 text-primary'
                      aria-hidden='true'
                    />
                  </div>
                </div>

                <div className='flex-1 space-y-2'>
                  <div className='flex items-start justify-between gap-4 flex-wrap'>
                    <div>
                      <h3 className='font-semibold text-foreground'>
                        {entry.author}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        {entry.location || entry.relationship}
                      </p>
                    </div>
                    <time
                      className='text-sm text-muted-foreground'
                      dateTime={entry.submittedAt}
                    >
                      {new Date(entry.submittedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>

                  <p className='text-foreground/90 leading-relaxed'>
                    {entry.message}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className='mt-8'>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage === 1
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <PaginationEllipsis key={page} />
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? 'pointer-events-none opacity-50'
                        : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  )
}

export default Guestbook
