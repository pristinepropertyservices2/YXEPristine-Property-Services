import { redirect } from 'next/navigation';

/** Legacy path from older configs / bookmarks; OAuth now sends first-time users to `/dashboard` directly. */
export default function NewUserRedirectPage() {
  redirect('/dashboard');
}
