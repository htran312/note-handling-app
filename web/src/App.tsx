import { type FormEvent, useEffect, useState } from "react";
import { useCreateNote } from "./hooks/useCreateNote";
import { useGetAllNotes } from "./hooks/useGetAllNotes";
import { useGetAllUsers } from "./hooks/useGetAllUsers";

export default function App() {
  const { notes, refetch, loading: fetchLoading, error: fetchError } =
    useGetAllNotes();
  const { users, loading: usersLoading, error: usersError } = useGetAllUsers();
  const {
    createNote,
    loading: createLoading,
    error: createError,
  } = useCreateNote();
  const [author, setAuthor] = useState("");
  const [finishedTask, setFinishedTask] = useState("");
  const [wipTask, setWipTask] = useState("");
  const [blockerTask, setBlockerTask] = useState("");
  const [handover, setHandover] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!author || !finishedTask || !wipTask || !blockerTask || !handover)
      return;

    setSubmitError(null);
    const success = await createNote({
      author,
      finishedTask,
      wipTask,
      blockerTask,
      handover,
    });

    if (success) {
      setAuthor("");
      setFinishedTask("");
      setWipTask("");
      setBlockerTask("");
      setHandover("");
      await refetch();
      return;
    }

    setSubmitError(createError ?? "Error submitting note. Please try again.");
  };

  useEffect(() => {
    if (!createError) {
      return;
    }

    setSubmitError(createError);
  }, [createError]);

  return (
    <div
      style={{ maxWidth: 700, margin: "40px auto", fontFamily: "sans-serif" }}
    >
      <h1>On-call Handover Notes</h1>

      {fetchError && (
        <p style={{ color: "#d32f2f" }}>Failed to load notes: {fetchError}</p>
      )}
      {usersError && (
        <p style={{ color: "#d32f2f" }}>Failed to load users: {usersError}</p>
      )}
      {submitError && (
        <p style={{ color: "#d32f2f" }}>Failed to submit note: {submitError}</p>
      )}

      <form onSubmit={submit} style={{ marginBottom: 24 }}>
        <select
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={usersLoading}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <option value="">Select author</option>
          {users.map((u) => (
            <option key={u.id} value={u.username}>
              {u.username}
            </option>
          ))}
        </select>

        <input
          placeholder="Finished Task (what was completed)"
          value={finishedTask}
          onChange={(e) => setFinishedTask(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <textarea
          placeholder="WIP Task (what is in progress or next)"
          value={wipTask}
          onChange={(e) => setWipTask(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <textarea
          placeholder="Blocker Task (concerns or potential risks)"
          value={blockerTask}
          onChange={(e) => setBlockerTask(e.target.value)}
          style={{ width: "100%", marginBottom: 8 }}
        />

        <select
          value={handover}
          onChange={(e) => setHandover(e.target.value)}
          disabled={usersLoading}
          style={{ width: "100%", marginBottom: 8 }}
        >
          <option value="">Select handover user</option>
          {users
            .filter((u) => u.username !== author)
            .map((u) => (
            <option key={u.id} value={u.username}>
              {u.username}
            </option>
            ))}
        </select>

        <button type="submit" disabled={createLoading}>
          {createLoading ? "Submitting..." : "Submit Note"}
        </button>
      </form>

      <hr />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Recent Notes</h2>
        <button type="button" onClick={() => void refetch()} disabled={fetchLoading}>
          {fetchLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {notes.length === 0 && <p>No notes yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {notes.map((n, idx) => (
          <li
            key={idx}
            style={{
              border: "1px solid #ccc",
              padding: 12,
              marginBottom: 12,
              borderRadius: 6,
            }}
          >
            <strong>{n.author}</strong> → <strong>{n.handover}</strong>
            <p style={{ marginTop: 8 }}>
              <strong>Finished:</strong> {n.finishedTask}
            </p>
            <p>
              <strong>WIP:</strong> {n.wipTask}
            </p>
            <p style={{ color: "#d32f2f" }}>
              <strong>Blocker:</strong> {n.blockerTask}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
