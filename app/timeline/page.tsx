import { Calendar, MapPin, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Mock timeline events
const timelineEvents = [
  {
    id: "1",
    date: "2024-03-15",
    title: "Dr. Sarah Mitchell Memorial Service",
    description: "A celebration of life held at the university chapel, attended by over 200 colleagues, students, and family members.",
    linkedTribute: "1",
    type: "memorial",
    location: "University Chapel"
  },
  {
    id: "2",
    date: "2023-12-10",
    title: "James O'Connor Retirement Ceremony",
    description: "After 35 years of dedicated service, James was honored with a retirement ceremony that became a memorial event.",
    linkedTribute: "2",
    type: "event",
    location: "Main Hall"
  },
  {
    id: "3",
    date: "2024-01-20",
    title: "Prof. María Rodríguez Scholarship Fund Established",
    description: "In honor of her legacy, the university established a mathematics scholarship fund.",
    linkedTribute: "3",
    type: "honor",
    location: "Mathematics Department"
  },
  {
    id: "4",
    date: "2023-11-05",
    title: "Annual Memorial Day",
    description: "The university's annual day of remembrance for all departed faculty and staff.",
    type: "memorial",
    location: "Memorial Garden"
  }
];

const Timeline = () => {
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
                    key={event.id}
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
                          {event.type}
                        </Badge>
                      </div>

                      <p className="text-foreground/90 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        <span>{event.location}</span>
                      </div>

                      {event.linkedTribute && (
                        <Link href={`/tribute/${event.linkedTribute}`}>
                          <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-smooth mt-3">
                            <Heart className="w-4 h-4" aria-hidden="true" />
                            <span className="font-medium">View Tribute</span>
                          </div>
                        </Link>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Map Column */}
          <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-2xl font-serif font-bold mb-6">
              Memorial Locations
            </h2>
            
            <Card className="p-6 shadow-soft">
              <div className="aspect-square bg-secondary/50 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center space-y-2">
                  <MapPin className="w-12 h-12 mx-auto text-primary" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-serif font-bold">Campus Memorial Sites</h3>
                <ul className="space-y-2 text-sm text-foreground/90">
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    <span>Memorial Garden - East Campus</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    <span>University Chapel - Main Building</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    <span>Remembrance Wall - Library Courtyard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-primary shrink-0" aria-hidden="true" />
                    <span>Peace Garden - South Grounds</span>
                  </li>
                </ul>
              </div>
            </Card>

            {/* Upcoming Anniversaries */}
            <Card className="p-6 shadow-soft">
              <h3 className="font-serif font-bold mb-4">Upcoming Anniversaries</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-border/50">
                  <Calendar className="w-5 h-5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Dr. Sarah Mitchell</p>
                    <p className="text-sm text-muted-foreground">1 year memorial - March 15</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-border/50">
                  <Calendar className="w-5 h-5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium">James O'Connor</p>
                    <p className="text-sm text-muted-foreground">Birthday remembrance - June 8</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-accent mt-0.5 shrink-0" aria-hidden="true" />
                  <div>
                    <p className="font-medium">Prof. María Rodríguez</p>
                    <p className="text-sm text-muted-foreground">Memorial service - January 20</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
