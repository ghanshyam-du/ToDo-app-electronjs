"use client";
import { useState, useEffect } from "react";

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/todo";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description: description.trim() ? description : "No description provided" 
        }),
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        fetchTodos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTodo = async (id: number, currentStatus: boolean) => {
    try {
      if (!currentStatus) {
        await fetch(`${API_URL}/${id}/done`, { method: "PATCH" });
      } else {
        await fetch(`${API_URL}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: false }),
        });
      }
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-4">
            Tasks
          </h1>
          <p className="text-slate-400">Manage your daily workflow</p>
        </header>

        <form onSubmit={addTodo} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl mb-10 transition-all hover:border-slate-700">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            <button
              type="submit"
              disabled={!title.trim()}
              className="mt-2 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white font-medium py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Task
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 animate-pulse">Loading tasks...</div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              No tasks yet. Add one above!
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                  todo.completed
                    ? "bg-slate-900/30 border-slate-800/50 opacity-60"
                    : "bg-slate-900 border-slate-700 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-500/10"
                }`}
              >
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.completed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-500 hover:border-indigo-400 text-transparent"
                  }`}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                  </svg>
                </button>
                
                <div className="flex-grow">
                  <h3 className={`text-lg font-medium transition-colors ${todo.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`mt-1 text-sm ${todo.completed ? "text-slate-600" : "text-slate-400"}`}>
                      {todo.description}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all rounded-lg hover:bg-slate-800"
                  aria-label="Delete task"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
