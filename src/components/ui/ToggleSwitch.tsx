interface ToggleSwitchProps {
  pressed: boolean
  onPressedChange: (pressed: boolean) => void
  ariaLabel: string
}

export function ToggleSwitch({ pressed, onPressedChange, ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      aria-label={ariaLabel}
      onClick={() => onPressedChange(!pressed)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${
        pressed ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          pressed ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
