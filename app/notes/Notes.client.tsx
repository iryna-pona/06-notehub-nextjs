'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api'; 
import type { FetchNotesParams, FetchNotesResponse } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import NoteForm from '@/components/NoteForm/NoteForm';
import Modal from '@/components/Modal/Modal';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import ErrorMessage from '@/app/notes/error';
import Loading from "@/app/loading";
import css from './NotesPage.module.css';

interface Props {
  initialPage: number;
  initialSearch: string;
  perPage: number;
}

export default function NotesClient({ initialPage, initialSearch, perPage }: Props) {
  const PER_PAGE = perPage ?? 12;

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const params: FetchNotesParams = {
    search: debouncedSearch,
    page,
    perPage: PER_PAGE,
    sortBy: 'created',
  };

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse, Error>({
    queryKey: ['notes', params.search, params.page],
    queryFn: () => fetchNotes(params),
    placeholderData: { notes: [], totalPages: 1 } as FetchNotesResponse,
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (isLoading) return <Loading />;
  if (isError && error) return <ErrorMessage error={error} />;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />
        {data?.totalPages && data.totalPages > 1 && (
          <Pagination pageCount={data.totalPages} currentPage={page} onPageChange={setPage} />
        )}
        <button className={css.button} onClick={handleOpenModal}>
          Create note +
        </button>
      </header>

      <NoteList notes={data?.notes ?? []} />

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onCancel={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}