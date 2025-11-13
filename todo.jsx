import React, { useState, useEffect } from "react";

// Default-exported React component
export default function TodoBranches() {
  const [branches, setBranches] = useState(() => {
    try {
      const raw = localStorage.getItem("branches-todo-v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [newBranch, setNewBranch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("branches-todo-v1", JSON.stringify(branches));
  }, [branches]);

  function addBranch() {
    const trimmed = newBranch.trim();
    if (!trimmed) return;
    setBranches((prev) => [
      ...prev,
      { id: Date.now(), name: trimmed, done: false }
    ]);
    setNewBranch("");
  }

  function toggleDone(id) {
    setBranches((prev) => prev.map(b => b.id === id ? { ...b, done: !b.done } : b));
  }

  function removeBranch(id) {
    setBranches((prev) => prev.filter(b => b.id !== id));
  }

  function editBranch(id, name) {
    setBranches((prev) => prev.map(b => b.id === id ? { ...b, name } : b));
  }

  const filtered = branches.filter(b => {
    if (filter === "all") return true;
    if (filter === "done") return b.done;
    return !b.done;
  });

  return (
    <div className="min-h-screen flex items-start justify-center p-6 bg-gray-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Branches TODO</h1>
          <p className="text-sm text-gray-500">Add branch names and manage them (save in localStorage)</p>
        </header>

        <section className="flex gap-3 mb-4">
          <input
            value={newBranch}
            onChange={(e) => setNewBranch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addBranch(); }}
            placeholder="Enter branch name (e.g. feature/auth)"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring"
          />
          <button
            onClick={addBranch}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            Add
          </button>
        </section>

        <section className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded ${filter==='all' ? 'bg-gray-200' : ''}`}>All</button>
            <button onClick={() => setFilter('active')} className={`px-3 py-1 rounded ${filter==='active' ? 'bg-gray-200' : ''}`}>Active</button>
            <button onClick={() => setFilter('done')} className={`px-3 py-1 rounded ${filter==='done' ? 'bg-gray-200' : ''}`}>Done</button>
          </div>

          <div className="text-sm text-gray-600">
            {branches.length} total • {branches.filter(b => b.done).length} done
          </div>
        </section>

        <ul className="space-y-2">
          {filtered.length === 0 && (
            <li className="text-center text-gray-400 py-6">No branches to show</li>
          )}

          {filtered.map(branch => (
            <li key={branch.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <input type="checkbox" checked={branch.done} onChange={() => toggleDone(branch.id)} />

              <input
                value={branch.name}
                onChange={(e) => editBranch(branch.id, e.target.value)}
                className={`flex-1 bg-transparent border-none focus:outline-none ${branch.done ? 'line-through text-gray-400' : ''}`}
              />

              <button onClick={() => removeBranch(branch.id)} className="px-2 py-1 rounded text-sm bg-red-100 hover:bg-red-200">Remove</button>
            </li>
          ))}
        </ul>

        <footer className="mt-6 text-xs text-gray-500">
          Tip: press Enter to add. Branch names are stored locally in your browser.
        </footer>
      </div>
    </div>
  );
}
