import * as z from 'zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

const tributeSchema = z.object({
  author: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  relationship: z
    .string()
    .trim()
    .min(1, 'Relationship is required')
    .max(100, 'Relationship must be less than 100 characters'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
})

type TributeFormData = z.infer<typeof tributeSchema>

interface TributeFormProps {
  memorialId: string
  onSuccess: () => void
}

const TributeForm = ({ memorialId, onSuccess }: TributeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<TributeFormData>({
    resolver: zodResolver(tributeSchema),
    defaultValues: {
      author: '',
      relationship: '',
      message: '',
    },
  })

  const onSubmit = async (data: TributeFormData) => {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success('Tribute submitted', {
        description:
          'Your tribute has been submitted and will be reviewed before being published. Thank you for sharing your memories.',
      })

      form.reset()
      onSuccess()
    } catch (error) {
      toast.error('Submission failed', {
        description:
          'There was an error submitting your tribute. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='text-center mb-4'>
          <h3 className='text-lg font-serif font-semibold mb-2'>
            Share Your Tribute
          </h3>
          <p className='text-sm text-muted-foreground'>
            Your tribute will be reviewed before being published to ensure it
            maintains the respectful nature of this memorial.
          </p>
        </div>

        <FormField
          control={form.control}
          name='author'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter your name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='relationship'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Relationship</FormLabel>
              <FormControl>
                <Input
                  placeholder='e.g., Former Student, Colleague, Friend'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='message'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Share your memories, condolences, or thoughts...'
                  className='min-h-32 resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          className='w-full shadow-gentle'
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Tribute'}
        </Button>
      </form>
    </Form>
  )
}

export default TributeForm
