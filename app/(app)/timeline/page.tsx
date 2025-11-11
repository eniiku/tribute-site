'use client'

import { useState, useEffect } from "react";
import { Calendar, MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTimelineEvents } from '@/lib/sanity-queries';
import { getAllMemorials } from '@/lib/sanity-queries';

interface TimelineEvent {
  _id: string;
  title: string;
  date: string;
  description: string;
  eventType: string;
  image?: any;
  memorialName?: string;
}

interface Memorial {
  _id: string;
  name: string;
  deathDate?: string;
}

const Timeline = () => {
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [memorials, setMemorials] = useState<Memorial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both timeline events and memorials
        const [timelineData, memorialsData] = await Promise.all([
          getTimelineEvents(),
          getAllMemorials()
        ]);
        
        // Process timeline events
        const processedEvents = timelineData.map((event: any) => ({
          _id: event._id,
          title: event.title,
          date: event.date,
          description: event.description,
          eventType: event.eventType,
          image: event.image,
          memorialName: event.memorialName
        }));

          console.log("useState", memorialsData)

        
        // Process memorials
        const processedMemorials = memorialsData.map((memorial: any) => ({
          _id: memorial._id,
          name: memorial.name,
          deathDate: memorial.deathDate
        }));
        
        setTimelineEvents(processedEvents);
        setMemorials(processedMemorials);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate upcoming memorial anniversaries from death dates
  const getMemorialAnniversaries = () => {
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    
    return memorials
      .filter(memorial => memorial.deathDate)
      .map(memorial => {
        const deathDate = new Date(memorial.deathDate);
        // Calculate this year's anniversary
        const anniversaryThisYear = new Date(today.getFullYear(), deathDate.getMonth(), deathDate.getDate());
        // Calculate next year's anniversary if this year's already passed
        const anniversaryNextYear = new Date(nextYear, deathDate.getMonth(), deathDate.getDate());
        
        // Use this year's anniversary if it's coming up, otherwise next year's
        const nextAnniversary = anniversaryThisYear > today ? anniversaryThisYear : anniversaryNextYear;
        
        return {
          _id: memorial._id, // Add the memorial ID to use for key
          name: memorial.name,
          date: nextAnniversary,
          originalDeathDate: deathDate
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort by anniversary date
      .slice(0, 3); // Get only the next 3
  };

  const memorialAnniversaries = getMemorialAnniversaries();

  console.log("MEMORIAL", memorialAnniversaries)

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p>Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Memorial Timeline
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A chronological journey through moments of remembrance and celebration of lives well lived.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Timeline Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-serif font-bold mb-6 animate-fade-in">
              Events & Ceremonies
            </h2>
            
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" aria-hidden="true" />
              
              {/* Events */}
              <div className="space-y-8">
                {timelineEvents.map((event, index) => (
                  <Card 
                    key={event._id}
                    className="ml-12 p-6 shadow-soft hover:shadow-gentle transition-smooth animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Date Badge */}
                    <div className="absolute -left-8 mt-1">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-primary-foreground" aria-hidden="true" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-lg mb-1">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <Badge variant="outline" className="shrink-0">
                          {event.eventType}
                        </Badge>
                      </div>

                      <p className="text-foreground/90 leading-relaxed">
                        {event.description}
                      </p>

                      {event.memorialName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Heart className="w-4 h-4 text-accent" aria-hidden="true" />
                          <span>In memory of {event.memorialName}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Anniversaries */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Card className="p-6 shadow-soft">
              <h3 className="font-serif font-bold mb-4">Upcoming Anniversaries</h3>
              <div className="space-y-3">
                {/* Memorial anniversaries */}
                {memorialAnniversaries.map((anniversary, index) => (
                  <div 
                    key={`memorial-${anniversary._id}-${index}`} 
                    className={`flex items-start gap-3 ${index < memorialAnniversaries.length - 1 ? 'pb-3 border-b border-border/50' : ''}`}
                  >
                    <Calendar className="w-5 h-5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium">{anniversary.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {anniversary.date.toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Other timeline-based anniversaries */}
                {timelineEvents
                  .filter(event => new Date(event.date) > new Date()) // Only future dates
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date
                  .slice(0, 2) // Show only the next 2 (in addition to memorial anniversaries)
                  .map((event, index) => (
                    <div 
                      key={`timeline-${event._id}-${index}`} 
                      className={`flex items-start gap-3 ${index < 1 || memorialAnniversaries.length > 0 ? 'pb-3 border-b border-border/50' : ''}`}
                    >
                      <Calendar className="w-5 h-5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                
                {memorialAnniversaries.length === 0 && 
                 timelineEvents.filter(event => new Date(event.date) > new Date()).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No upcoming anniversaries</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;