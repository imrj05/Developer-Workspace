import { useEffect, useRef, useState } from 'react'
import { Check, ListTodo, Trash2 } from 'lucide-react'
import { useWorkspaceStore } from '../../stores/workspaceStore'
import { SectionPanel } from '../ui/SectionPanel'
import { EmptyState } from '../ui/EmptyState'

interface TaskPlannerProps {
  focusRequest: number
}

export function TaskPlanner({ focusRequest }: TaskPlannerProps) {
  const { tasks, addTask, toggleTask, deleteTask } = useWorkspaceStore()
  const [title, setTitle] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)
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
    <SectionPanel
      title="Today"
      badge={`${pendingTasks.length} open`}
      actions={
        completedTasks.length > 0 ? (
          <button
            type="button"
            onClick={() => setShowCompleted((value) => !value)}
            className="chip-button"
            data-active={showCompleted}
          >
            Done ({completedTasks.length})
          </button>
        ) : undefined
      }
    >
      <form
        className="mb-3 flex items-center gap-2.5"
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
          className="input-field h-10 min-w-0 text-sm"
        />
        <button type="submit" disabled={!title.trim()} className="btn-primary h-10 shrink-0 px-4 text-sm">
          Add
        </button>
      </form>

      {pendingTasks.length === 0 ? (
        <EmptyState
          icon={<ListTodo aria-hidden="true" className="h-5 w-5" />}
          title="No open tasks"
          description="Add a task to plan your day."
        />
      ) : (
        <div className="space-y-2">
          {pendingTasks.map((task) => (
            <div key={task.id} className="task-row">
              <button
                type="button"
                onClick={() => void toggleTask(task.id)}
                className="icon-button h-8 w-8 shrink-0"
                aria-label={`Mark ${task.title} done`}
              >
                <Check aria-hidden="true" className="h-4 w-4" />
              </button>
              <div className="min-w-0 flex-1 truncate text-sm text-[var(--text-primary)]">{task.title}</div>
              <button
                type="button"
                onClick={() => void deleteTask(task.id)}
                className="icon-button h-8 w-8 shrink-0 text-[var(--error)] hover:border-[var(--error)]/40 hover:bg-[var(--error)]/10 hover:text-[var(--error)]"
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showCompleted && completedTasks.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-label)]">Completed</span>
            <button
              type="button"
              onClick={() => completedTasks.forEach((task) => void deleteTask(task.id))}
              className="chip-button text-[var(--error)]"
            >
              Clear all
            </button>
          </div>
          {completedTasks.slice(0, 8).map((task) => (
            <div key={task.id} className="task-row opacity-70">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/12 text-[var(--accent)]">
                <Check aria-hidden="true" className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1 truncate text-sm line-through text-[var(--text-secondary)]">{task.title}</div>
              <button
                type="button"
                onClick={() => void deleteTask(task.id)}
                className="icon-button h-8 w-8 shrink-0"
                aria-label={`Delete ${task.title}`}
              >
                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </SectionPanel>
  )
}
