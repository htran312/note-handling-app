import { useCallback, useEffect, useState } from "react";
import { NoteDto } from "./dtos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useGetAllNotes() {
	const [notes, setNotes] = useState<NoteDto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const refetch = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`${API_URL}/notes`);
			if (!res.ok) {
				throw new Error("Failed to fetch notes");
			}

			const data = (await res.json()) as NoteDto[];
			setNotes([...data].reverse());
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unexpected error";
			setError(message);
			console.error("Error fetching notes:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return { notes, loading, error, refetch };
}
