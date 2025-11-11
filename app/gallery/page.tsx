"use client"

import { useState } from "react";
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

// Mock data
const memorials = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    role: "Professor of Biology",
    department: "Natural Sciences",
    years: "1955 - 2023",
    imageUrl: "/placeholder.svg",
    tributeCount: 28
  },
  {
    id: "2",
    name: "James O'Connor",
    role: "Director of Student Services",
    department: "Administration",
    years: "1948 - 2022",
    imageUrl: "/placeholder.svg",
    tributeCount: 42
  },
  {
    id: "3",
    name: "Prof. María Rodríguez",
    role: "Chair of Mathematics",
    department: "Mathematics",
    years: "1962 - 2024",
    imageUrl: "/placeholder.svg",
    tributeCount: 35
  },
  {
    id: "4",
    name: "Robert Chen",
    role: "Dean of Engineering",
    department: "Engineering",
    years: "1958 - 2023",
    imageUrl: "/placeholder.svg",
    tributeCount: 51
  },
  {
    id: "5",
    name: "Dr. Eleanor Thompson",
    role: "Head Librarian",
    department: "Library Services",
    years: "1945 - 2021",
    imageUrl: "/placeholder.svg",
    tributeCount: 33
  },
  {
    id: "6",
    name: "Michael Patel",
    role: "Professor of History",
    department: "Humanities",
    years: "1960 - 2024",
    imageUrl: "/placeholder.svg",
    tributeCount: 19
  }
];

const Gallery = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  const filteredMemorials = memorials.filter(memorial => {
    const matchesSearch = memorial.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || memorial.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

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
                  <SelectItem value="Natural Sciences">Natural Sciences</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Library Services">Library Services</SelectItem>
                  <SelectItem value="Humanities">Humanities</SelectItem>
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
