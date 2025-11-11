'use client'

import { useState, useEffect } from "react";
import { Image as ImageIcon, Video, Music, Filter } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllMedia } from '@/lib/sanity-queries';
import { urlFor } from '@/sanity/lib/image';

interface MediaItem {
  file: any;
  _id: string;
  title: string;
  description?: string;
  mediaType: string;
  category: string;
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
  createdAt: string;
}

const MediaGallery = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const data = await getAllMedia();
        // Process the media items to ensure proper structure and URL formatting
        const processedMediaItems = data.map((item: any) => {
          // Determine which field contains the file based on mediaType
          let fileUrl = '';
          if (item.mediaType === 'image' && item.imageFile && item.imageFile.asset) {
            fileUrl = item.imageFile.asset.url || urlFor(item.imageFile).url();
          } else if ((item.mediaType === 'audio' || item.mediaType === 'video') && item.otherFile && item.otherFile.asset) {
            // For audio/video files, construct URL based on _ref format
            if (item.otherFile.asset.url) {
              fileUrl = item.otherFile.asset.url;
            } else if (item.otherFile.asset._ref) {
              const assetRef = item.otherFile.asset._ref;
              const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
              const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
              
              if (projectId && dataset) {
                if (assetRef.startsWith('file-')) {
                  const fileName = assetRef.replace('file-', '');
                  fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${fileName}`;
                } else if (assetRef.startsWith('image-')) {
                  fileUrl = urlFor({ _ref: assetRef }).url();
                }
              }
            }
          }
          
          return {
            ...item,
            file: {
              asset: {
                url: fileUrl
              }
            },
            // Convert Sanity's _createdAt to the expected createdAt field
            createdAt: item._createdAt
          };
        });
        
        setMediaItems(processedMediaItems);
      } catch (error) {
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  const filteredMedia = activeTab === "all" 
    ? mediaItems 
    : mediaItems.filter(item => item.mediaType === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p>Loading media gallery...</p>
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
            <TabsTrigger value="image" className="flex items-center gap-2">
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
                  key={item._id}
                  className="group overflow-hidden shadow-soft hover:shadow-gentle transition-smooth animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Media Thumbnail */}
                  <div className="relative aspect-video bg-secondary/50 overflow-hidden">
                    {(item.mediaType === 'image') ? (
                      <img 
                        src={item.file.asset.url} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        {item.mediaType === 'video' && <Video className="w-12 h-12 text-muted-foreground" />}
                        {item.mediaType === 'audio' && <Music className="w-12 h-12 text-muted-foreground" />}
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-3 right-3 shadow-soft"
                    >
                      {item.mediaType === "image" && <ImageIcon className="w-3 h-3 mr-1" aria-hidden="true" />}
                      {item.mediaType === "video" && <Video className="w-3 h-3 mr-1" aria-hidden="true" />}
                      {item.mediaType === "audio" && <Music className="w-3 h-3 mr-1" aria-hidden="true" />}
                      {item.mediaType === "image" ? "Photo" : item.mediaType === "video" ? "Video" : "Audio"}
                    </Badge>
                  </div>

                  {/* Caption */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <Badge variant="outline">{item.category}</Badge>
                      <time className="text-muted-foreground" dateTime={item.createdAt}>
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
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