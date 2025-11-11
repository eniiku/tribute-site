import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Memorial {
  id: string
  name: string
  role: string
  department: string
  years: string
  imageUrl: string
  tributeCount: number
}

interface MemorialCardProps {
  memorial: Memorial
}

const MemorialCard = ({ memorial }: MemorialCardProps) => {
  return (
    <Link href={`/tribute/${memorial.id}`} className='block group'>
      <Card className='overflow-hidden shadow-gentle hover:shadow-soft transition-smooth border-border/50'>
        <div className='aspect-square overflow-hidden bg-muted'>
          <img
            src={memorial.imageUrl}
            alt={memorial.name}
            className='w-full h-full object-cover group-hover:scale-105 transition-smooth'
          />
        </div>
        <CardContent className='p-6'>
          <h3 className='text-xl font-serif font-bold mb-2 group-hover:text-primary transition-smooth'>
            {memorial.name}
          </h3>
          <p className='text-primary font-medium mb-1'>{memorial.role}</p>
          <p className='text-sm text-muted-foreground mb-3'>
            {memorial.department}
          </p>
          <p className='text-sm text-muted-foreground font-medium mb-4'>
            {memorial.years}
          </p>

          <div className='flex items-center gap-2 text-sm text-accent'>
            <Heart className='w-4 h-4' />
            <span>{memorial.tributeCount} tributes</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default MemorialCard
