import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'

export async function getFeaturedMemorials() {
  const memorialQuery = groq`*[_type == 'memorial' && featured == true] {
    _id,
    name,
    role,
    department,
    "years": coalesce(
      (select(defined(birthDate) => birthDate, "") + " - " + select(defined(deathDate) => deathDate, "")),
      "Unknown years"
    ),
    image,
    _updatedAt
  }[0...6]`
  
  const tributesQuery = groq`*[_type == 'tribute' && approved == true && defined(memorial._ref)] {
    "memorialId": memorial._ref
  }`
  
  try {
    const [memorials, allTributes] = await Promise.all([
      client.fetch(memorialQuery),
      client.fetch(tributesQuery)
    ]);
    
    // Count tributes per memorial
    const tributeCounts: Record<string, number> = {};
    allTributes.forEach((tribute: any) => {
      if (tribute.memorialId) {
        tributeCounts[tribute.memorialId] = (tributeCounts[tribute.memorialId] || 0) + 1;
      }
    });
    
    // Add tribute counts to memorials
    const memorialsWithCounts = memorials.map((memorial: any) => ({
      ...memorial,
      tributeCount: tributeCounts[memorial._id] || 0
    }));
    
    return memorialsWithCounts;
  } catch (error) {
    console.error('Error fetching featured memorials:', error)
    return []
  }
}

export async function getAllMemorials() {
  const memorialQuery = groq`*[_type == 'memorial'] {
    _id,
    name,
    role,
    department,
    "years": coalesce(
      (select(defined(birthDate) => birthDate, "") + " - " + select(defined(deathDate) => deathDate, "")),
      "Unknown years"
    ),
    image,
    deathDate,
    _updatedAt
  }`
  
  const tributesQuery = groq`*[_type == 'tribute' && approved == true && defined(memorial._ref)] {
    "memorialId": memorial._ref
  }`
  
  try {
    const [memorials, allTributes] = await Promise.all([
      client.fetch(memorialQuery),
      client.fetch(tributesQuery)
    ]);
    
    // Count tributes per memorial
    const tributeCounts: Record<string, number> = {};
    allTributes.forEach((tribute: any) => {
      if (tribute.memorialId) {
        tributeCounts[tribute.memorialId] = (tributeCounts[tribute.memorialId] || 0) + 1;
      }
    });
    
    // Add tribute counts to memorials
    const memorialsWithCounts = memorials.map((memorial: any) => ({
      ...memorial,
      tributeCount: tributeCounts[memorial._id] || 0
    }));
    
    return memorialsWithCounts;
  } catch (error) {
    console.error('Error fetching all memorials:', error)
    return []
  }
}

export async function getMemorialById(id: string) {
  try {
    // First get the memorial document
    const memorialQuery = groq`*[_type == 'memorial' && _id == $id] {
      _id,
      name,
      role,
      department,
      birthDate,
      deathDate,
      biography,
      image,
      _updatedAt
    }[0]`
    
    const memorial = await client.fetch(memorialQuery, { id });
    
    if (!memorial) {
      return null;
    }
    
    // Query for tributes that reference this memorial
    const tributesQuery = groq`*[_type == 'tribute' && approved == true && defined(memorial) && memorial._ref == $id] {
      _id,
      author,
      relationship,
      message,
      submittedAt,
      image
    }`;
    
    const tributes = await client.fetch(tributesQuery, { id });
    
    // Return the memorial with the retrieved tribute data
    return {
      ...memorial,
      tributes
    };
  } catch (error) {
    console.error(`Error fetching memorial with ID ${id}:`, error)
    return null
  }
}

export async function getTimelineEvents() {
  const query = groq`*[_type == 'timelineEvent'] | order(date desc) {
    _id,
    title,
    date,
    description,
    eventType,
    image,
    "memorialName": memorial->name
  }`
  
  try {
    const events = await client.fetch(query)
    return events
  } catch (error) {
    console.error('Error fetching timeline events:', error)
    return []
  }
}

export async function getMediaByCategory(category: string) {
  const query = groq`*[_type == 'media' && category == $category] {
    _id,
    title,
    description,
    mediaType,
    imageFile,
    otherFile,
    "memorialName": memorial->name,
    _createdAt
  }`
  
  try {
    const media = await client.fetch(query, { category })
    return media
  } catch (error) {
    console.error(`Error fetching media for category ${category}:`, error)
    return []
  }
}

export async function getAllMedia() {
  const query = groq`*[_type == 'media'] | order(_createdAt desc) {
    _id,
    title,
    description,
    mediaType,
    imageFile,
    otherFile,
    category,
    _createdAt
  }`
  
  try {
    const media = await client.fetch(query)
    return media
  } catch (error) {
    console.error('Error fetching all media:', error)
    return []
  }
}

export async function getRandomMediaForWall(limit: number = 12) {
  // First, fetch all media that are of type image
  const query = groq`*[_type == 'media' && mediaType == 'image'] {
    _id,
    title,
    imageFile,
    otherFile,
    mediaType,
    _createdAt
  }`
  
  try {
    const allImages = await client.fetch(query);
    
    const processedImages = allImages.map(image => ({
      ...image,
    }));
    
    // Shuffle and return a random selection
    const shuffled = [...processedImages].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('Error fetching random media for wall:', error)
    return []
  }
}

export async function getGuestbookEntries() {
  const query = groq`*[_type == 'guestbook' && approved == true] | order(submittedAt desc) {
    _id,
    author,
    location,
    message,
    submittedAt,
    image
  }`
  
  try {
    const entries = await client.fetch(query)
    // Map the field names to match what the UI expects
    return entries.map(entry => ({
      ...entry,
      relationship: entry.location,
    }));
  } catch (error) {
    console.error('Error fetching guestbook entries:', error)
    return []
  }
}