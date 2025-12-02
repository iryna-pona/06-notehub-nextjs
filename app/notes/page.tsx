import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import type { FetchNotesParams } from '@/lib/api';

export default async function NotesPage() {
  const queryClient = new QueryClient();

  const params: FetchNotesParams = {
    search: '',
    page: 1,
    perPage: 12,
    sortBy: 'created',
  };

  await queryClient.prefetchQuery({
    queryKey: ['notes', params.search, params.page],
    queryFn: () => fetchNotes(params),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient
        initialPage={params.page ?? 1}
        initialSearch={params.search ?? ''}
        perPage={params.perPage ?? 12}
      />
    </HydrationBoundary>
  );
}
