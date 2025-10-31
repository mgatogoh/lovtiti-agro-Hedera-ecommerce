"use client"

import * as React from "react"
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }: any) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

function ToastTitle({ children, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className="text-sm font-semibold" {...props}>{children}</div>
}

function ToastDescription({ children, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return <div className="text-sm opacity-90" {...props}>{children}</div>
}
