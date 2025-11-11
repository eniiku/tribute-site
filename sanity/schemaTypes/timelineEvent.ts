import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'timelineEvent',
  title: 'Timeline Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Organization Milestone', value: 'milestone' },
          { title: 'Memorial Event', value: 'memorial' },
          { title: 'Historical Event', value: 'historical' },
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
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
    },
  },
})