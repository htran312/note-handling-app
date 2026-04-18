import { useState } from "react";
import { ErrorResponseDto, NoteDto } from "./dtos";
import { FAILED_CREATE_NOTE } from "./errors";

type CreateNoteInput = Omit<NoteDto, "createdAt">;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useCreateNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNote = async (input: CreateNoteInput): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const body = (await response.json()) as ErrorResponseDto;
        const message = body.message ?? FAILED_CREATE_NOTE;
        throw new Error(message);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      console.error("Error submitting note:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createNote, loading, error };
}
