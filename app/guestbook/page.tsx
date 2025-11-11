"use client"

import { toast } from 'sonner'
import { useState } from 'react'
import { BookHeart, Send, CheckCircle } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

// Mock guestbook entries
const guestbookEntries = [
  {
    id: '1',
    author: 'Emily Richardson',
    message:
      'This memorial site is a beautiful tribute. Thank you for creating a space where we can honor and remember these wonderful people who touched so many lives.',
    date: '2024-03-18',
    location: 'Boston, MA',
  },
  {
    id: '2',
    author: 'David Kim',
    message:
      "I'm grateful to have found this peaceful place to reflect on the memories of those who shaped my education and life. Their legacy lives on through all of us.",
    date: '2024-03-17',
    location: 'San Francisco, CA',
  },
  {
    id: '3',
    author: 'Sarah Martinez',
    message:
      'What a touching way to preserve memories and celebrate lives. The stories shared here remind us of the profound impact one person can have on a community.',
    date: '2024-03-15',
    location: 'Chicago, IL',
  },
  {
    id: '4',
    author: "Michael O'Brien",
    message:
      'Coming here brings comfort during difficult times. Thank you for maintaining this beautiful space of remembrance.',
    date: '2024-03-14',
    location: 'New York, NY',
  },
]

const Guestbook = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast('Message submitted', {
      description:
        'Your condolence will appear after moderation. Thank you for your thoughtful words.',
      duration: 5000,
    })

    setFormData({ name: '', location: '', message: '' })
    setIsSubmitting(false)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className='min-h-screen pt-24 pb-16 px-4'>
      <div className='container mx-auto max-w-4xl'>
        {/* Header */}
        <div className='text-center mb-12 animate-fade-in'>
          <div className='inline-flex items-center gap-2 text-accent mb-4'>
            <BookHeart className='w-6 h-6' aria-hidden='true' />
          </div>
          <h1 className='text-4xl md:text-5xl font-serif font-bold mb-4'>
            Guestbook
          </h1>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Share your condolences and reflections. Your words of comfort and
            remembrance help us honor those we've lost and support one another.
          </p>
        </div>

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
          <h2
            className='text-2xl font-serif font-bold mb-6 animate-fade-in'
            style={{ animationDelay: '200ms' }}
          >
            Recent Messages
          </h2>

          {guestbookEntries.map((entry, index) => (
            <Card
              key={entry.id}
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
                        {entry.location}
                      </p>
                    </div>
                    <time
                      className='text-sm text-muted-foreground'
                      dateTime={entry.date}
                    >
                      {new Date(entry.date).toLocaleDateString('en-US', {
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
        </div>
      </div>
    </div>
  )
}

export default Guestbook
