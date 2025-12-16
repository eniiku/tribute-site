import * as z from 'zod'
import { toast } from 'sonner'
import { useState, useEffect } from 'react'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const memorialSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  role: z
    .string()
    .trim()
    .min(1, 'Role is required')
    .max(100, 'Role must be less than 100 characters'),
  unit: z
    .string()
    .trim()
    .min(1, 'Unit is required')
    .max(100, 'Unit must be less than 100 characters'),
  status: z
    .string()
    .min(1, 'Status is required'),
  birthDate: z
    .string()
    .optional(),
  deathDate: z
    .string()
    .optional(),
  biography: z
    .string()
    .trim()
    .min(10, 'Biography must be at least 10 characters')
    .max(2000, 'Biography must be less than 2000 characters'),
  image: z
    .any()
    .optional(),
})

type MemorialFormData = z.infer<typeof memorialSchema>

interface MemorialFormProps {
  status?: 'fallen' | 'serving' | 'gallantry'; // Optional status to pre-select
  onSuccess: () => void
  onCancel: () => void
}

const MemorialForm = ({ status, onSuccess, onCancel }: MemorialFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const form = useForm<MemorialFormData>({
    resolver: zodResolver(memorialSchema),
    defaultValues: {
      name: '',
      role: '',
      unit: '',
      status: status || '', 
      birthDate: '',
      deathDate: '',
      biography: '',
      image: undefined,
    },
  })

  
  const currentStatus = form.watch('status');

  useEffect(() => {
    if (status) {
      form.setValue('status', status);
    }
  }, [status, form]);

  const onSubmit = async (data: MemorialFormData) => {
    setIsSubmitting(true)

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('role', data.role);
      formData.append('unit', data.unit);
      formData.append('status', data.status);
      if (data.birthDate) formData.append('birthDate', data.birthDate);
      
      
      if (data.status === 'fallen' && data.deathDate) {
        formData.append('deathDate', data.deathDate);
      }

      formData.append('biography', data.biography);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const response = await fetch('/api/memorials', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Memorial submitted', {
          description: "Your memorial has been submitted and will be reviewed. Thank you."
        })
        form.reset()
        setSelectedImage(null)
        onSuccess()
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Error submitting memorial:', error)
      toast.error('Submission failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='text-center mb-4'> 
          <p className='text-sm text-muted-foreground'>
            Your submission will be reviewed before being published to ensure accuracy and respect.
          </p>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder='Enter full name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role/Position *</FormLabel>
              <FormControl>
                <Input placeholder='e.g., Colonel, Captain, Sergeant' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='unit'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit *</FormLabel>
              <FormControl>
                <Input placeholder='e.g., Army, Navy, Air Force' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fallen">Fallen</SelectItem>
                  <SelectItem value="serving">Serving</SelectItem>
                  <SelectItem value="gallantry">Gallantry</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

<div className={`grid gap-4 ${currentStatus === 'fallen' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          <FormField
            control={form.control}
            name='birthDate'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {currentStatus === 'fallen' && (
            <FormField
              control={form.control}
              name='deathDate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Death Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name='biography'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Share the story, service record, and legacy of this hero...'
                  className='min-h-32 resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='image'
          render={() => (
            <FormItem>
              <FormLabel>Image (Optional)</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        
                        // Validate file size (max 5MB)
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error('Image size must be less than 5MB');
                          return;
                        }
                        
                        // Validate file type
                        if (!file.type.startsWith('image/')) {
                          toast.error('Please select a valid image file');
                          return;
                        }
                        
                        setSelectedImage(file);
                      }
                    }}
                  />
                  {selectedImage && (
                    <div className="text-sm text-muted-foreground">
                      Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)}MB)
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type='button'
            variant="outline"
            onClick={onCancel}
            className='flex-1'
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            className='flex-1 shadow-gentle'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Memorial'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default MemorialForm