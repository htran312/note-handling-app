import { useCallback, useEffect, useState } from "react";
import { UserDto } from "./dtos";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export function useGetAllUsers() {
	const [users, setUsers] = useState<UserDto[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const refetch = useCallback(async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await fetch(`${API_URL}/users`);
			if (!response.ok) {
				throw new Error("Failed to fetch users");
			}

			const data = (await response.json()) as UserDto[];
			setUsers(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Unexpected error";
			setError(message);
			console.error("Error fetching users:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return { users, loading, error, refetch };
}
