import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Memorial {
  id: string
  name: string
  role: string
  unit: string
  status?: string
  years: string
  imageUrl: string
  tributeCount: number
}

interface MemorialCardProps {
  memorial: Memorial
}

const MemorialCard = ({ memorial }: MemorialCardProps) => {
  // Use the id from the memorial object, falling back to _id if needed for compatibility
  const memorialId = memorial.id || (memorial as any)._id

  console.log(memorial)

  return (
    <Link href={`/tribute/${memorialId}`} className='block group'>
      <Card className='overflow-hidden gradient-card border border-border/40 hover:border-primary/40 transition-smooth hover:shadow-hover h-full'>
        <div className='aspect-3/4 overflow-hidden bg-muted/20 relative'>
          {/* Subtle overlay */}
          <div className='absolute inset-0 bg-linear-to-t from-card/60 dark:from-card/90 via-card/20 to-card/0 z-10 opacity-70 group-hover:opacity-50 transition-smooth' />

          <img
            src={memorial.imageUrl}
            alt={memorial.name}
            className='w-full h-full object-cover object-top group-hover:scale-105 transition-smooth duration-700'
          />
        </div>

        <CardContent className='p-5 space-y-3'>
          <div className='space-y-1.5'>
            <h3 className='font-serif font-semibold text-foreground group-hover:text-accent transition-smooth line-clamp-2 text-lg leading-tight'>
              {memorial.name}
            </h3>
            <p className='text-muted-foreground font-medium text-sm'>
              {memorial.role}
            </p>
          </div>

          <div className='space-y-0.5 text-xs text-muted-foreground/80'>
            <p className='line-clamp-1'>{memorial.unit}</p>
            <p className='font-light'>
              {memorial.years.match(/\d{4}/g)?.join(' - ') ?? 'N/A'}
            </p>
          </div>

          <div className='flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border/30'>
            <Heart className='w-3.5 h-3.5 text-muted-foreground/60' />
            <span>{memorial.tributeCount} tributes</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default MemorialCard
