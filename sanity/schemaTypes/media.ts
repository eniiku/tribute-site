import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'media',
  title: 'Gallery - Media Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
          { title: 'Audio', value: 'audio' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // Conditional field based on media type
    defineField({
      name: 'imageFile',
      title: 'Image File',
      type: 'image',
      options: {
        hotspot: true,
      },
      hidden: ({ document }) => document?.mediaType !== 'image',
    }),
    defineField({
      name: 'otherFile',
      title: 'File',
      type: 'file',
      hidden: ({ document }) => document?.mediaType === 'image',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Memorial Photos', value: 'memorial-photos' },
          { title: 'Organization History', value: 'organization-history' },
          { title: 'Tributes', value: 'tributes' },
          { title: 'Events', value: 'events' },
          { title: 'Background Music', value: 'background-music' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'memorial',
      title: 'Associated Memorial',
      type: 'reference',
      to: { type: 'memorial' },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'mediaType',
    },
  },
})