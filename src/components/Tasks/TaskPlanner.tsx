import { useEffect, useRef, useState } from 'react'
import { Check, ListTodo, Trash2 } from 'lucide-react'
import { useWorkspaceStore } from '../../stores/workspaceStore'

interface TaskPlannerProps {
  focusRequest: number
}

export function TaskPlanner({ focusRequest }: TaskPlannerProps) {
  const { tasks, addTask, toggleTask, deleteTask } = useWorkspaceStore()
  const [title, setTitle] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusRequest > 0) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [focusRequest])

  const pendingTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  return (
    <section className="mx-auto w-full max-w-6xl">
      <div className="card-glass flex flex-col p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="section-heading mb-2">Planner</div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Today</h3>
          </div>
          <div className="rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1.5 text-xs text-[var(--text-label)]">
            {pendingTasks.length} open
          </div>
        </div>

        <form
          className="mb-4 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            if (!title.trim()) return
            void addTask(title)
            setTitle('')
          }}
        >
          <label htmlFor="task-title" className="sr-only">Add task</label>
          <input
            ref={inputRef}
            id="task-title"
            name="task-title"
            autoComplete="off"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a task…"
            className="input-field h-11 min-w-0"
          />
          <button type="submit" disabled={!title.trim()} className="btn-primary h-11 shrink-0 px-4">
            Add
          </button>
        </form>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-label)]">Open Tasks</div>
            {pendingTasks.length === 0 ? (
              <div className="card-subtle flex flex-col items-center justify-center gap-2 px-4 py-6 text-center">
                <ListTodo aria-hidden="true" className="h-5 w-5 text-[var(--text-label)]" />
                <p className="text-sm font-medium text-[var(--text-primary)]">No tasks for now.</p>
                <p className="text-xs text-[var(--text-secondary)]">Add a task above to keep today in focus.</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div key={task.id} className="card-subtle flex items-center gap-3 px-3 py-3">
                  <button type="button" onClick={() => void toggleTask(task.id)} className="icon-button h-9 w-9 shrink-0" aria-label={`Mark ${task.title} done`}>
                    <Check aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <div className="min-w-0 flex-1 text-sm text-[var(--text-primary)]">{task.title}</div>
                  <button type="button" onClick={() => void deleteTask(task.id)} className="icon-button h-9 w-9 shrink-0 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10 hover:text-[var(--error)]" aria-label={`Delete ${task.title}`}>
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {completedTasks.length > 0 ? (
            <div className="space-y-2 xl:border-l xl:border-[var(--border)] xl:pl-4">
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-label)]">Completed</div>
                <button
                  type="button"
                  onClick={() => {
                    completedTasks.forEach((task) => {
                      void deleteTask(task.id)
                    })
                  }}
                  className="chip-button border-[var(--error)]/25 bg-[var(--error)]/8 px-3 py-1 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/12 hover:text-[var(--error)]"
                >
                  Clear Completed
                </button>
              </div>
              {completedTasks.slice(0, 6).map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border)]/70 bg-[var(--surface)]/45 px-3 py-2.5 opacity-75">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/12 text-[var(--accent)]">
                    <Check aria-hidden="true" className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1 truncate text-sm line-through text-[var(--text-secondary)]">{task.title}</div>
                  <button
                    type="button"
                    onClick={() => void deleteTask(task.id)}
                    className="icon-button h-8 w-8 shrink-0 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
                    aria-label={`Delete completed task ${task.title}`}
                  >
                    <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
