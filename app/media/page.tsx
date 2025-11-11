"use client"

import { useState } from "react";
import { Image as ImageIcon, Video, Music, Filter } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock media data
const mediaItems = [
  {
    id: "1",
    type: "photo",
    url: "/placeholder.svg",
    caption: "Annual Faculty Gathering 2022",
    category: "Events",
    date: "2022-05-15"
  },
  {
    id: "2",
    type: "photo",
    url: "/placeholder.svg",
    caption: "Dr. Mitchell's Marine Biology Lab",
    category: "Research",
    date: "2023-03-20"
  },
  {
    id: "3",
    type: "video",
    url: "/placeholder.svg",
    caption: "Memorial Service Highlights",
    category: "Ceremonies",
    date: "2024-01-10",
    duration: "12:30"
  },
  {
    id: "4",
    type: "photo",
    url: "/placeholder.svg",
    caption: "Campus Memorial Garden",
    category: "Places",
    date: "2023-09-05"
  },
  {
    id: "5",
    type: "photo",
    url: "/placeholder.svg",
    caption: "Prof. Rodríguez Teaching",
    category: "Teaching",
    date: "2022-11-12"
  },
  {
    id: "6",
    type: "video",
    url: "/placeholder.svg",
    caption: "Remembrance Day 2023",
    category: "Ceremonies",
    date: "2023-11-05",
    duration: "8:45"
  }
];

const MediaGallery = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredMedia = activeTab === "all" 
    ? mediaItems 
    : mediaItems.filter(item => item.type === activeTab);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Media Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore photos, videos, and recordings that capture precious memories and moments of celebration.
          </p>
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 shadow-gentle">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Filter className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">All</span>
            </TabsTrigger>
            <TabsTrigger value="photo" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Music className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Audio</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item, index) => (
                <Card 
                  key={item.id}
                  className="group overflow-hidden shadow-soft hover:shadow-gentle transition-smooth animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${item.caption}`}
                >
                  {/* Media Thumbnail */}
                  <div className="relative aspect-video bg-secondary/50 overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                    />
                    
                    {/* Type Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 shadow-soft"
                    >
                      {item.type === "photo" && <ImageIcon className="w-3 h-3 mr-1" aria-hidden="true" />}
                      {item.type === "video" && <Video className="w-3 h-3 mr-1" aria-hidden="true" />}
                      {item.type === "audio" && <Music className="w-3 h-3 mr-1" aria-hidden="true" />}
                      {item.type}
                    </Badge>

                    {/* Duration for videos */}
                    {item.duration && (
                      <Badge 
                        variant="secondary" 
                        className="absolute bottom-3 right-3 shadow-soft"
                      >
                        {item.duration}
                      </Badge>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {item.caption}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{item.category}</Badge>
                      <time className="text-muted-foreground" dateTime={item.date}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short'
                        })}
                      </time>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredMedia.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No {activeTab === "all" ? "media" : activeTab} items found.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MediaGallery;
