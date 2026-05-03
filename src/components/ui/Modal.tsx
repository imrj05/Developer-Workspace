import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onOpenChange, title, children }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[calc(100vw-2rem)] max-w-lg z-[151] -translate-x-1/2 -translate-y-1/2 card-glass p-6 animate-scale-in sm:p-7" aria-describedby="modal-description">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
            <div>
              <div className="section-heading mb-2">Workspace</div>
              <Dialog.Title className="text-xl font-semibold font-display text-[var(--text-primary)]">{title}</Dialog.Title>
            </div>
            <Dialog.Description id="modal-description" className="sr-only">{title} dialog</Dialog.Description>
            <Dialog.Close aria-label="Close dialog" className="icon-button h-10 w-10 shrink-0">
              <X aria-hidden="true" className="h-4 w-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
