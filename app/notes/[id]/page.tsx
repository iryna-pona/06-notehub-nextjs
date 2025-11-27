import { fetchNoteById } from "@/lib/api";
import css from "@/components/NoteList/NoteList.module.css";

interface NoteProps {
    params: Promise<{id: string}>
}

export default async function Note({ params }: NoteProps) {
    const { id } = await params;
    const note = await fetchNoteById(id);

    if (!note) {
    return <p>Note not found</p>;
  }

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