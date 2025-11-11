'use client'

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getRandomMediaForWall } from '@/lib/sanity-queries';
import { urlFor } from '@/sanity/lib/image';

interface WallImage {
  imageUrl: string | Blob;
  _id: string;
  title: string;
  mediaType: string;
  imageFile?: {
    asset: {
      _ref: string;
      url?: string;
    };
  };
  otherFile?: {
    asset: {
      _ref: string;
      url?: string;
    };
  };
}

const getHeightClass = (index: number) => {
  // Use index to determine height variation
  const remainder = index % 3;
  switch (remainder) {
    case 0: return "row-span-1";
    case 1: return "row-span-2";
    case 2: return "row-span-3";
    default: return "row-span-2";
  }
};

const Wall = () => {
  const [displayImages, setDisplayImages] = useState<WallImage[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize with shuffled images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getRandomMediaForWall(12);

        const processedImages = images.map((image: any) => {
          // Determine which field contains the image based on mediaType
          let imageUrl = '';
          if (image.mediaType === 'image' && image.imageFile && image.imageFile.asset) {
            // For image assets, use either direct URL or urlFor
            imageUrl = image.imageFile.asset.url || urlFor(image.imageFile).url();
          } else if (image.otherFile && image.otherFile.asset) {
            // For other file types that might contain images
            imageUrl = image.otherFile.asset.url || urlFor(image.otherFile).url();
          }
          
          return {
            ...image,
            imageUrl
          };
        });
        setDisplayImages(processedImages);
      } catch (error) {
        console.error('Error fetching wall images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const shuffleImages = () => {
    setIsShuffling(true);
    const shuffled = [...displayImages].sort(() => Math.random() - 0.5);
    
    setTimeout(() => {
      setDisplayImages(shuffled);
      setIsShuffling(false);
    }, 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p>Loading memorial wall...</p>
        </div>
      </div>
    );
  }

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
          {displayImages.map((image, index) => (
            <Card
              key={`${image._id}-${index}`}
              className={`group overflow-hidden shadow-soft hover:shadow-gentle transition-smooth cursor-pointer animate-fade-in ${getHeightClass(
                index
              )}`}
              style={{ animationDelay: `${index * 30}ms` }}
              role="button"
              tabIndex={0}
              aria-label={`View photo of ${image.title}`}
            >
              <div className="relative w-full h-full">
                <img
                  src={image?.imageUrl}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                  loading="lazy"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-4">
                  <p className="text-foreground font-medium text-sm">
                    {image.title}
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