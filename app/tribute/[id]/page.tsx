"use client"

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Heart, MessageCircle, Calendar } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Countdown from "@/components/countdown";
import TributeForm from "@/components/tribute-form";

// Mock data - would come from Sanity
const memorialData = {
  "1": {
    id: "1",
    name: "Dr. Sarah Mitchell",
    role: "Professor of Biology",
    department: "Natural Sciences",
    years: "1955 - 2023",
    imageUrl: "/placeholder.svg",
    biography: "Dr. Sarah Mitchell dedicated over 30 years to advancing biological research and inspiring countless students. Her groundbreaking work in marine biology earned international recognition, but she will be most remembered for her warmth, patience, and unwavering commitment to her students. Sarah believed that every student had potential, and she worked tirelessly to help each one discover their passion for science.",
    tributes: [
      {
        id: "1",
        author: "John Stevens",
        relationship: "Former Student",
        date: "2024-01-15",
        message: "Dr. Mitchell changed my life. Her enthusiasm for marine biology was infectious, and her belief in me gave me the confidence to pursue my dreams. I wouldn't be where I am today without her guidance."
      },
      {
        id: "2",
        author: "Maria Garcia",
        relationship: "Colleague",
        date: "2024-01-14",
        message: "Sarah was not only a brilliant scientist but also a dear friend. Her kindness and wisdom touched everyone around her. The department will never be the same without her warm smile and encouraging words."
      }
    ]
  }
};

const Tribute = () => {
  const { id } = useParams();
  const memorial = memorialData[id as keyof typeof memorialData] || memorialData["1"];
  const [showTributeForm, setShowTributeForm] = useState(false);

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
                <span className="font-medium">{memorial.years}</span>
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
        <Card className="p-8 mb-8 shadow-soft animate-fade-in" style={{ animationDelay: "200ms" }}>
          <h2 className="text-2xl font-serif font-bold mb-4">Biography</h2>
          <p className="text-foreground/90 leading-relaxed">{memorial.biography}</p>
        </Card>

        {/* Countdown to Memorial */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: "250ms" }}>
          <Countdown 
            targetDate="2025-03-15T14:00:00"
            eventName="1 Year Memorial Anniversary"
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
                key={tribute.id} 
                className="p-6 shadow-gentle animate-fade-in"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{tribute.author}</h3>
                    <p className="text-sm text-muted-foreground">{tribute.relationship}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(tribute.date).toLocaleDateString('en-US', {
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
