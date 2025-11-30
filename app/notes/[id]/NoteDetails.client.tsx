 "use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from 'next/navigation';
import { fetchNoteById } from "@/lib/api";
import Loading from '@/app/loading';
import ErrorMessage from '@/app/notes/error';
import css from "./NoteDetails.module.css";

export default function NoteDetailsClient() {
    const { id } = useParams<{ id: string }>();

    const { data: note, isLoading, isError, error } = useQuery({
        queryKey: ["note", id],
        queryFn: () => fetchNoteById(id),
        refetchOnMount: false,
    });

    if (isLoading) return <Loading />;
    if (isError && error) return <ErrorMessage error={error} />;
    if (!note) return <p>Note not found.</p>;
 
    return (
        <div className={css.noteContainer}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
                <span className={css.tag}>{note.tag}</span>
            </div>
        </div>
    );
}