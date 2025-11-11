import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'memorial',
  title: 'Memorial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role/Position',
      type: 'string',
    }),
    defineField({
      name: 'unit',
      title: 'Unit',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Fallen', value: 'fallen' },
          { title: 'Serving', value: 'serving' },
          { title: 'Gallantry', value: 'gallantry' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'birthDate',
      title: 'Birth Date',
      type: 'date',
    }),
    defineField({
      name: 'deathDate',
      title: 'Death Date',
      type: 'date',
    }),
    defineField({
      name: 'biography',
      title: 'Biography',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'tributes',
      title: 'Tributes',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'tribute' } }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})