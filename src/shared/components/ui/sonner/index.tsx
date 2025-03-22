import { Toaster as Sonner } from 'sonner'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast bg-inverse! border-none! text-inverse! shadow-md! py-3! px-4! rounded-[8px]! min-w-[338px]! min-h-[48px]!',
          title: 'typo-body-1-medium!',
          description: 'group-[.toast]:text-inverse',
          actionButton: 'group-[.toast]:bg-transparent! group-[.toast]:typo-button-4! group-[.toast]:text-orange-500!',
          cancelButton: 'group-[.toast]:bg-transparent! group-[.toast]:typo-button-4! group-[.toast]:text-inverse!',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
