'use client'

import { useState, useEffect} from 'react'
import { Calendar,ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getTimelineEvents } from '@/lib/sanity-queries'
import { getAllMemorials } from '@/lib/sanity-queries'
import PortableTextComponent from '@/components/portable-text'

interface TimelineEvent {
  _id: string
  title: string
  date: string
  description: any[] // PortableText blocks
  eventType: string
  image?: any
  memorialName?: string
}

interface Memorial {
  _id: string
  name: string
  deathDate?: string
}

const Timeline = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [memorials, setMemorials] = useState<Memorial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both timeline events and memorials
        const [timelineData, memorialsData] = await Promise.all([
          getTimelineEvents(),
          getAllMemorials(),
        ])

        // Process timeline events
        const processedEvents = timelineData.map((event: any) => ({
          _id: event._id,
          title: event.title,
          date: event.date,
          description: event.description,
          eventType: event.eventType,
          image: event.image,
          memorialName: event.memorialName,
        }))

        // Process memorials
        const processedMemorials = memorialsData.map((memorial: any) => ({
          _id: memorial._id,
          name: memorial.name,
          deathDate: memorial.deathDate,
        }))

        setTimelineEvents(processedEvents)
        setMemorials(processedMemorials)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Calculate upcoming memorial anniversaries from death dates
  const getMemorialAnniversaries = () => {
    const today = new Date()
    const nextYear = today.getFullYear() + 1

    return memorials
      .filter((memorial) => memorial.deathDate)
      .map((memorial) => {
        const deathDate = new Date(memorial.deathDate)
        // Calculate this year's anniversary
        const anniversaryThisYear = new Date(
          today.getFullYear(),
          deathDate.getMonth(),
          deathDate.getDate()
        )
        // Calculate next year's anniversary if this year's already passed
        const anniversaryNextYear = new Date(
          nextYear,
          deathDate.getMonth(),
          deathDate.getDate()
        )

        // Use this year's anniversary if it's coming up, otherwise next year's
        const nextAnniversary =
          anniversaryThisYear > today
            ? anniversaryThisYear
            : anniversaryNextYear

        return {
          _id: memorial._id, // Add the memorial ID to use for key
          name: memorial.name,
          date: nextAnniversary,
          originalDeathDate: deathDate,
        }
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort by anniversary date
      .slice(0, 3) // Get only the next 3
  }

  const memorialAnniversaries = getMemorialAnniversaries()
  if (loading) {
    return (
      <div className='min-h-screen pt-24 pb-16 px-4 flex items-center justify-center'>
        <div className='text-center'>
          <p>Loading timeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen pt-28 pb-20 px-6'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header */}
        <header className='text-center mb-16 space-y-6 animate-fade-in'>
          <div className='inline-block'>
            <div className='text-accent/80 text-sm font-medium tracking-[0.3em] uppercase mb-4'>
              Historical Journey
            </div>
          </div>

          <h1 className='font-serif font-bold text-foreground'>
            Timeline of the <br /> Nigerian Armed Forces
          </h1>

          <div className='h-px w-24 mx-auto bg-linear-to-r from-transparent via-accent/40 to-transparent' />

          <p className='text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed'>
            From colonial beginnings to modern operations, a story of courage,
            unity, and service — remembering past sacrifices and ongoing
            commitment.
          </p>

          <p className='text-accent/80 font-serif text-xl italic'>
            A journey through history, written in courage.
          </p>
        </header>

        {/* Timeline - Horizontal Scroll */}
        <div className='relative animate-fade-in-slow'>
          {/* Scroll hint */}
          <div className='flex items-center justify-center gap-2 mb-8 text-muted-foreground text-sm'>
            <span>Scroll to explore</span>
            <ArrowRight className='w-4 h-4' />
          </div>

          {/* Horizontal timeline container */}
          <div className='overflow-x-auto pb-8 scrollbar-thin scrollbar-thumb-accent/20 scrollbar-track-transparent'>
            <div className='flex gap-8 min-w-max px-4'>
              {(() => {
                const reversedEvents = [...timelineEvents].reverse();
                return reversedEvents.map((event, index) => (
                  <div
                    key={event._id}
                    className='relative shrink-0 w-80'
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Timeline dot and line */}
                    <div className='absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center'>
                      <div className='w-4 h-4 rounded-full bg-accent shadow-glow' />
                      {index < reversedEvents.length - 1 && (
                        <div className='w-px h-full bg-linear-to-b from-accent/60 via-accent/20 to-transparent absolute top-4' />
                      )}
                    </div>

                    {/* Card */}
                    <div className='gradient-card border border-border/40 rounded-2xl p-6 mt-12 shadow-card hover:shadow-hover transition-smooth group'>
                      {/* Date badge */}
                      <div className='inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-semibold'>
                        <Calendar className='w-3.5 h-3.5' />
                        <span>{event.date ? new Date(event.date).getFullYear() : 'Unknown Date'}</span>
                      </div>

                      {/* Event type */}
                      <div className='text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium'>
                        {event.eventType}
                      </div>

                      {/* Title */}
                      <h3 className='font-serif text-lg font-semibold mb-3 text-foreground group-hover:text-accent transition-smooth'>
                        {event.title}
                      </h3>

                      {/* Description */}
                      <div className='text-sm text-muted-foreground'>
                        <PortableTextComponent value={event.description} />
                      </div>
                      
                      {/* Memorial association */}
                      {event.memorialName && (
                        <p className='text-xs text-muted-foreground/70 mt-2 italic'>
                          Associated with: {event.memorialName}
                        </p>
                      )}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Fade edges */}
          <div className='absolute inset-y-0 left-0 w-20 bg-linear-to-r from-background to-transparent pointer-events-none' />
          <div className='absolute inset-y-0 right-0 w-20 bg-linear-to-l from-background to-transparent pointer-events-none' />
        </div>
      </div>
    </div>
  )
}

export default Timeline
