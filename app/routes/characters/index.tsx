import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <p>
      No character selected. Select a character on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        create a new character.
      </Link>
    </p>
  );
}
