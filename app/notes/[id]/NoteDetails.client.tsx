 "use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from 'next/navigation';
import { fetchNoteById } from "@/lib/api";
import type { Note } from "@/types/note";
import Loading from '@/app/loading';
import ErrorMessage from '@/app/notes/error';
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
    const { id } = useParams<{ id: string }>();

    const { data: note, isLoading, isError, error } = useQuery<Note, Error>({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });

    if (isLoading) return <Loading />;
    if (isError && error) return <ErrorMessage error={error} />;
    if (!note) return <p>Note not found.</p>;

    return (
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{new Date(note.createdAt).toLocaleString()}</p>
          </div>
        </div>
    );
}