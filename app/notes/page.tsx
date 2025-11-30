import NotesClient from "@/app/notes/Notes.client";

export default function NotesPage() {
  return <NotesClient initialPage={1} initialSearch="" perPage={12} />;
}

