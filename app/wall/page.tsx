"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock wall images
const wallImages = [
  { id: "1", url: "/placeholder.svg", name: "Dr. Sarah Mitchell", height: "tall" },
  { id: "2", url: "/placeholder.svg", name: "James O'Connor", height: "short" },
  { id: "3", url: "/placeholder.svg", name: "Prof. María Rodríguez", height: "medium" },
  { id: "4", url: "/placeholder.svg", name: "Robert Chen", height: "tall" },
  { id: "5", url: "/placeholder.svg", name: "Dr. Eleanor Thompson", height: "short" },
  { id: "6", url: "/placeholder.svg", name: "Michael Patel", height: "medium" },
  { id: "7", url: "/placeholder.svg", name: "Campus Memorial", height: "short" },
  { id: "8", url: "/placeholder.svg", name: "Annual Gathering", height: "tall" },
  { id: "9", url: "/placeholder.svg", name: "Memorial Garden", height: "medium" },
  { id: "10", url: "/placeholder.svg", name: "Faculty Portrait", height: "short" },
  { id: "11", url: "/placeholder.svg", name: "Remembrance Day", height: "tall" },
  { id: "12", url: "/placeholder.svg", name: "Chapel Service", height: "medium" },
];

const getHeightClass = (height: string) => {
  switch (height) {
    case "short": return "row-span-1";
    case "medium": return "row-span-2";
    case "tall": return "row-span-3";
    default: return "row-span-2";
  }
};

const Wall = () => {
  const [images, setImages] = useState(wallImages);
  const [isShuffling, setIsShuffling] = useState(false);

  const shuffleImages = () => {
    setIsShuffling(true);
    const shuffled = [...images].sort(() => Math.random() - 0.5);
    
    setTimeout(() => {
      setImages(shuffled);
      setIsShuffling(false);
    }, 300);
  };

  // Shuffle on mount for randomness
  useEffect(() => {
    shuffleImages();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Memorial Wall
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            A visual tapestry of memories, moments, and the beautiful lives we celebrate.
          </p>
          
          <Button 
            onClick={shuffleImages}
            variant="outline"
            className="shadow-gentle"
            disabled={isShuffling}
            aria-label="Shuffle wall images"
          >
            <Shuffle className="w-4 h-4 mr-2" aria-hidden="true" />
            Shuffle Wall
          </Button>
        </div>

        {/* Masonry Grid */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4 transition-opacity duration-300 ${
            isShuffling ? "opacity-50" : "opacity-100"
          }`}
        >
          {images.map((image, index) => (
            <Card
              key={`${image.id}-${index}`}
              className={`group overflow-hidden shadow-soft hover:shadow-gentle transition-smooth cursor-pointer animate-fade-in ${getHeightClass(
                image.height
              )}`}
              style={{ animationDelay: `${index * 30}ms` }}
              role="button"
              tabIndex={0}
              aria-label={`View photo of ${image.name}`}
            >
              <div className="relative w-full h-full">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4">
                  <p className="text-foreground font-medium text-sm">
                    {image.name}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Each image tells a story. Click any photo to learn more about the person 
            or moment it represents. The wall reshuffles each time you visit, 
            offering a new perspective on our shared memories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wall;
