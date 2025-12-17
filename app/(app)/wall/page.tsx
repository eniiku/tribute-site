'use client'

import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MemorialCard from "@/components/memorial-card";
import MemorialForm from "@/components/memorial-form";
import { getAllMemorials } from '@/lib/sanity-queries';
import { urlFor } from '@/sanity/lib/image';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Gallery = () => {
  const [memorials, setMemorials] = useState([])
  const [filteredMemorials, setFilteredMemorials] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showMemorialModal, setShowMemorialModal] = useState(false)
  const [modalStatus, setModalStatus] = useState<'fallen' | 'serving' | 'gallantry' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemorials = async () => {
      try {
        const data = await getAllMemorials()
        // Convert image objects to URLs and set tribute counts
        const memorialsWithImages = data.map(memorial => ({
          ...memorial,
          id: memorial._id, // Map _id to id for compatibility
          imageUrl: memorial.image ? urlFor(memorial.image).url() : '/placeholder.svg',
          tributeCount: memorial.tributeCount || 0
        }))
        setMemorials(memorialsWithImages)
        setFilteredMemorials(memorialsWithImages)
      } catch (error) {
        console.error('Error fetching all memorials:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemorials()
  }, [])

  // Apply client-side filtering
  useEffect(() => {
    let result = memorials

    // Apply search filter
    if (searchQuery) {
      result = result.filter(memorial => 
        memorial.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredMemorials(result)
  }, [searchQuery, memorials])



  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p>Loading gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <header className="text-center mb-16 space-y-6 animate-fade-in">
          <div className="inline-block">
            <div className="text-accent/80 text-sm font-medium tracking-[0.3em] uppercase mb-4">
              National Memorial
            </div>
          </div>
          
          <h1 className="font-serif font-bold text-foreground">
            Wall of Honour
          </h1>
          
          <div className="h-px w-24 mx-auto bg-linear-to-r from-transparent via-accent/40 to-transparent" />
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A national space to recognise all Nigerian soldiers — those who gave their lives, 
            those who continue to serve, and those who demonstrated exceptional bravery.
          </p>
          
          <p className="text-accent/80 font-serif text-xl italic">
            Every hero has a story. Every story inspires us all.
          </p>
        </header>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-slow">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by name, unit, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-7 text-base bg-card/50 border-border/40 rounded-xl focus:border-accent/40 transition-smooth"
            />
          </div>
        </div>

        {/* Tabs for Categories */}
        <Tabs defaultValue="fallen" className="w-full">
          <TabsList className="w-full max-w-lg mx-auto grid grid-cols-3 mb-16 h-14 glass-effect p-1.5 rounded-xl">
            <TabsTrigger 
              value="fallen" 
              className="text-sm font-medium rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-smooth"
            >
              Fallen
            </TabsTrigger>
            <TabsTrigger 
              value="serving" 
              className="text-sm font-medium rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-smooth"
            >
              Serving
            </TabsTrigger>
            <TabsTrigger 
              value="gallantry" 
              className="text-sm font-medium rounded-lg data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-smooth"
            >
              Gallantry
            </TabsTrigger>
          </TabsList>

          {/* Fallen Soldiers */}
          <TabsContent value="fallen" className="space-y-10 animate-fade-in">
            <div className="text-center space-y-6">
            <h2 className="text-3xl font-serif font-semibold text-foreground">
                Fallen Soldiers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tributes to those who made the ultimate sacrifice.
              </p>
               <Button 
                 onClick={() => {
                   setModalStatus('fallen');
                   setShowMemorialModal(true);
                 }}
                 className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow transition-smooth"
               >
                <Plus className="w-4 h-4" />
                Add a Fallen Hero Memorial
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredMemorials
                .filter(memorial => memorial.status === 'fallen')
                .map((memorial) => (
                  <MemorialCard key={memorial.id} memorial={memorial} />
                ))}
            </div>
          </TabsContent>

          {/* Serving Soldiers */}
          <TabsContent value="serving" className="space-y-10 animate-fade-in">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-serif font-semibold text-foreground">
                Serving Soldiers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Messages of encouragement, thanks, and recognition for soldiers actively defending the nation.
              </p>
               <Button 
                 onClick={() => {
                   setModalStatus('serving');
                   setShowMemorialModal(true);
                 }}
                 className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow transition-smooth"
               >
                <Plus className="w-4 h-4" />
                Add a Serving Soldier Memorial
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredMemorials
                .filter(memorial => memorial.status === 'serving')
                .map((memorial) => (
                  <MemorialCard key={memorial.id} memorial={memorial} />
                ))}
            </div>
          </TabsContent>

          {/* Gallantry & Honour */}
          <TabsContent value="gallantry" className="space-y-10 animate-fade-in">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-serif font-semibold text-foreground">
                Gallantry & Honour
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Featured soldiers recognised for acts of courage, bravery, or distinguished service.
              </p>
              <Button 
                onClick={() => {
                  setModalStatus('gallantry');
                  setShowMemorialModal(true);
                }}
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow transition-smooth"
              >
                <Plus className="w-4 h-4" />
                Add a Gallantry Memorial
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredMemorials
                .filter(memorial => memorial.status === 'gallantry')
                .map((memorial) => (
                  <MemorialCard key={memorial.id} memorial={memorial} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Memorial Modal */}
        <Dialog open={showMemorialModal} onOpenChange={setShowMemorialModal}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="sr-only">
              <DialogTitle className="text-2xl font-serif">
                {modalStatus === 'fallen' && 'Add a Fallen Hero Memorial'}
                {modalStatus === 'serving' && 'Add a Serving Soldier Memorial'}
                {modalStatus === 'gallantry' && 'Add a Gallantry Memorial'}
              </DialogTitle>
            </DialogHeader>
            
            <MemorialForm 
              status={modalStatus || undefined}
              
              onSuccess={() => {
                setShowMemorialModal(false);
                setModalStatus(null);
                // Optionally refresh memorials after successful submission
              }}
              onCancel={() => {
                setShowMemorialModal(false);
                setModalStatus(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Gallery;