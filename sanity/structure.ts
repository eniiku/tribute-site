import type {StructureResolver} from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Thank a SOLDIER - Content Management')
    .items([
      // Wall of Honour section
      S.listItem()
        .title('Wall of Honour')
        .child(
          S.list()
            .title('Wall of Honour Management')
            .items([
              S.listItem()
                .title('Memorials')
                .child(S.documentTypeList('memorial').title('All Memorials')),
              S.listItem()
                .title('Tributes')
                .child(S.documentTypeList('tribute').title('All Tributes')),
            ])
        ),
      
      // Timeline section
      S.listItem()
        .title('Timeline')
        .child(
          S.list()
            .title('Timeline Management')
            .items([
              S.listItem()
                .title('Timeline Events')
                .child(S.documentTypeList('timelineEvent').title('All Timeline Events')),
            ])
        ),
      
      // Gallery section
      S.listItem()
        .title('Gallery')
        .child(
          S.list()
            .title('Gallery Management')
            .items([
              S.listItem()
                .title('Media Assets')
                .child(S.documentTypeList('media').title('All Media Assets')),
            ])
        ),
      
      // Guestbook section
      S.listItem()
        .title('Guestbook')
        .child(
          S.list()
            .title('Guestbook Management')
            .items([
              S.listItem()
                .title('Guestbook Entries')
                .child(S.documentTypeList('guestbook').title('All Guestbook Entries')),
            ])
        ),
    ])
