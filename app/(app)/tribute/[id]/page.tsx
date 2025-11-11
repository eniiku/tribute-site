'use client'

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Calendar } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Countdown from "@/components/countdown";
import TributeForm from "@/components/tribute-form";
import { getMemorialById } from '@/lib/sanity-queries';
import { urlFor } from '@/sanity/lib/image';

interface Tribute {
  _id: string;
  author: string;
  relationship: string;
  submittedAt: string;
  message: string;
}

interface Memorial {
  id: string;
  imageUrl: string | Blob;
  _id: string;
  name: string;
  role: string;
  department: string;
  birthDate?: string;
  deathDate?: string;
  biography?: string;
  image?: any;
  tributes: Tribute[];
}

const Tribute = () => {
  const { id } = useParams();
  const [memorial, setMemorial] = useState<Memorial | null>(null);
  const [showTributeForm, setShowTributeForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMemorial = async () => {
      try {
        const data = await getMemorialById(id as string);
        
        if (!data) {
          setError(true);
          return;
        }
       
        const processedMemorial = {
          ...data,
          id: data._id, // Map _id to id for compatibility
          imageUrl: data.image ? urlFor(data.image).url() : "/placeholder.svg",
          // Use the tributes as they are already filtered by the query
          tributes: data.tributes || []
        };
        
        setMemorial(processedMemorial);
      } catch (err) {
        console.error('Error fetching memorial:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMemorial();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p>Loading memorial details...</p>
        </div>
      </div>
    );
  }

  if (error || !memorial) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Memorial not found</h1>
          <p className="text-muted-foreground mt-2">The memorial you're looking for doesn't exist.</p>
          <Link href="/gallery">
            <Button className="mt-4">Back to Gallery</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format years display
  const yearsDisplay = memorial.birthDate && memorial.deathDate 
    ? `${memorial.birthDate.split("-")[0]} - ${memorial.deathDate.split("-")[0]}`
    : memorial.deathDate
      ? `Died: ${memorial.deathDate.split("-")[0]}`
      : "Unknown years";

  // Format the death date for the countdown (assuming we want to countdown to memorial anniversaries)
  let countdownDate = new Date(); // fallback to today if no death date
  if (memorial.deathDate) {
    const deathDate = new Date(memorial.deathDate);
    const thisYearAnniversary = new Date(
      new Date().getFullYear(),
      deathDate.getMonth(),
      deathDate.getDate()
    );
    
    // If the anniversary has already passed this year, use next year's date
    countdownDate = thisYearAnniversary > new Date() 
      ? thisYearAnniversary 
      : new Date(
          new Date().getFullYear() + 1,
          deathDate.getMonth(),
          deathDate.getDate()
        );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link href="/gallery">
          <Button variant="ghost" className="mb-8 -ml-4 animate-fade-in">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gallery
          </Button>
        </Link>

        {/* Memorial Header */}
        <Card className="p-8 mb-8 shadow-soft animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <img
                src={memorial.imageUrl}
                alt={memorial.name}
                className="w-full aspect-square object-cover rounded-lg shadow-gentle"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-4xl font-serif font-bold mb-2">{memorial.name}</h1>
                <p className="text-xl text-primary font-medium mb-1">{memorial.role}</p>
                <p className="text-muted-foreground">{memorial.department}</p>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{yearsDisplay}</span>
              </div>

              <Separator />

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-accent" />
                  <span>{memorial.tributes.length} Tributes</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Biography */}
        {memorial.biography && (
          <Card className="p-8 mb-8 shadow-soft animate-fade-in" style={{ animationDelay: "200ms" }}>
            <h2 className="text-2xl font-serif font-bold mb-4">Biography</h2>
            <p className="text-foreground/90 leading-relaxed">{memorial.biography}</p>
          </Card>
        )}

        {/* Countdown to Memorial */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "250ms" }}>
          <Countdown 
            targetDate={countdownDate.toISOString()}
            eventName={`Anniversary of ${memorial.name}`}
          />
        </div>

        {/* Tributes Section */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" />
              Tributes & Memories
            </h2>
            <Button 
              onClick={() => setShowTributeForm(!showTributeForm)}
              className="shadow-gentle"
            >
              {showTributeForm ? "Cancel" : "Leave a Tribute"}
            </Button>
          </div>

          {showTributeForm && (
            <Card className="p-6 mb-6 shadow-soft">
              <TributeForm 
                memorialId={memorial.id}
                onSuccess={() => setShowTributeForm(false)}
              />
            </Card>
          )}

          <div className="space-y-4">
            {memorial.tributes.map((tribute, index) => (
              <Card 
                key={tribute._id} 
                className="p-6 shadow-gentle animate-fade-in"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{tribute.author}</h3>
                    <p className="text-sm text-muted-foreground">{tribute.relationship}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(tribute.submittedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-foreground/90 leading-relaxed">{tribute.message}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tribute;