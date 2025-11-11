'use client'

import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MemorialCard from "@/components/memorial-card";
import { getAllMemorials } from '@/lib/sanity-queries';
import { urlFor } from '@/sanity/lib/image';

const Gallery = () => {
  const [memorials, setMemorials] = useState([])
  const [filteredMemorials, setFilteredMemorials] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
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
          tributeCount: memorial.tributes ? memorial.tributes.length : 0
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

    // Apply department filter
    if (departmentFilter !== "all") {
      result = result.filter(memorial => 
        memorial.department === departmentFilter
      )
    }

    setFilteredMemorials(result)
  }, [searchQuery, departmentFilter, memorials])

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
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Memorial Gallery
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse and search through tributes to our cherished community members.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 shadow-gentle border-border/50"
              />
            </div>

            {/* Department Filter */}
            <div className="md:w-64">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="py-6 shadow-gentle border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {Array.from(new Set(memorials.map(m => m.department))).sort().map(department => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredMemorials.length} of {memorials.length} memorials
          </div>
        </div>

        {/* Memorial Grid */}
        {filteredMemorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMemorials.map((memorial, index) => (
              <div 
                key={memorial.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MemorialCard memorial={memorial} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-fade-in">
            <p className="text-lg text-muted-foreground mb-4">
              No memorials found matching your search.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setDepartmentFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;