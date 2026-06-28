import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./api/taskApi";

import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [page, setPage] = useState(1);
  const limit = 4;

  const [editId, setEditId] = useState(null);

  const loadTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editId) {
        await updateTask(editId, { title, description });
        toast.success("Task updated");
      } else {
        await createTask({ title, description });
        toast.success("Task created");
      }

      resetForm();
      loadTasks();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    toast.success("Task deleted");
    loadTasks();
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditId(task._id);
  };

  // SEARCH + FILTER
  const processed = tasks
    .filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((t) =>
      filter === "all" ? true : t.status === filter
    );

  // PAGINATION
  const start = (page - 1) * limit;
  const paginated = processed.slice(start, start + limit);
  const totalPages = Math.ceil(processed.length / limit);

  return (
    <div className="app">
      <Toaster />

      {/* TOP BAR */}
      <div className="top">
        <div>
          <h1>Task Manager</h1>
          <p>Organize work, stay productive</p>
        </div>
      </div>

      {/* FORM CARD */}
      <form onSubmit={handleSubmit} className="card form-card">
        <input
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button>{editId ? "Update Task" : "Add Task"}</button>
      </form>

      {/* TOOLBAR */}
      <div className="toolbar">
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* TASK GRID */}
      <div className="grid">
        {paginated.length === 0 ? (
          <div className="empty">No tasks found</div>
        ) : (
          paginated.map((t) => (
            <div className="card task" key={t._id}>
              <div className="left">
                <h3>{t.title}</h3>
                <p>{t.description}</p>

                <span className={`badge ${t.status || "pending"}`}>
                  {t.status || "pending"}
                </span>
              </div>

              <div className="actions">
                <button onClick={() => handleEdit(t)}>Edit</button>
                <button onClick={() => handleDelete(t._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>

        <span>{page} / {totalPages || 1}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* STYLE (REAL DASHBOARD LOOK) */}
      <style>{`
        .app {
          max-width: 950px;
          margin: auto;
          padding: 30px;
          font-family: system-ui;
          background: #f5f7fb;
          min-height: 100vh;
        }

        /* TOP */
        .top h1 {
          margin: 0;
          font-size: 30px;
        }

        .top p {
          margin: 5px 0 20px;
          color: #666;
        }

        /* CARD BASE */
        .card {
          background: white;
          border-radius: 14px;
          box-shadow: 0 8px 20px rgba(0,0,0,0.06);
        }

        /* FORM */
        .form-card {
          display: flex;
          gap: 10px;
          padding: 15px;
          margin-bottom: 15px;
        }

        .form-card input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 10px;
          outline: none;
        }

        .form-card button {
          background: #111;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 10px;
          cursor: pointer;
        }

        /* TOOLBAR */
        .toolbar {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .toolbar input,
        .toolbar select {
          flex: 1;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid #ddd;
          background: white;
        }

        /* GRID */
        .grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* TASK CARD */
        .task {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          transition: 0.2s;
        }

        .task:hover {
          transform: translateY(-2px);
        }

        .left h3 {
          margin: 0;
        }

        .left p {
          margin: 5px 0;
          color: #666;
        }

        /* BADGE */
        .badge {
          font-size: 12px;
          padding: 3px 10px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 5px;
          background: #eee;
        }

        /* ACTIONS */
        .actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .actions button {
          padding: 6px 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .actions button:first-child {
          background: #f1f1f1;
        }

        .actions button:last-child {
          background: #ffe5e5;
          color: red;
        }

        /* EMPTY */
        .empty {
          text-align: center;
          padding: 20px;
          color: gray;
        }

        /* PAGINATION */
        .pagination {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 20px;
        }

        .pagination button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 8px;
        }

        .pagination button:disabled {
          opacity: 0.4;
        }

        /* RESPONSIVE */
        @media (max-width: 600px) {
          .form-card,
          .toolbar {
            flex-direction: column;
          }

          .task {
            flex-direction: column;
            gap: 10px;
          }

          .actions {
            justify-content: flex-end;
          }
        }
      `}</style>
    </div>
  );
}