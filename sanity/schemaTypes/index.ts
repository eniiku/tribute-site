import {type SchemaTypeDefinition } from 'sanity'
import memorial from './memorial'
import tribute from './tribute'
import timelineEvent from './timelineEvent'
import media from './media'
import guestbook from './guestbook'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    memorial,
    tribute,
    timelineEvent,
    media,
    guestbook
  ],
}
