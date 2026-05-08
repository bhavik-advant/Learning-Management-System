'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      richColors
      closeButton
      expand
      visibleToasts={4}
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        duration: 3000,

        classNames: {
          toast: `
            group toast
            rounded-2xl
            border
            backdrop-blur-xl
            shadow-2xl
            px-5
            py-4
            gap-3
            min-h-14
            flex
            items-center
            transition-all
            duration-300
          `,

          title: 'text-sm font-semibold tracking-tight',

          description: 'text-xs opacity-90 mt-1',

          actionButton: 'bg-white text-black hover:bg-white/90 rounded-lg px-3',

          cancelButton: 'bg-black/10 hover:bg-black/20 rounded-lg px-3',

          closeButton: `
            bg-white/10
            border-white/10
            hover:bg-white/20
            text-white
          `,

          success: `
            !bg-emerald-500/90
            !border-emerald-400/40
            !text-white
          `,

          error: `
            !bg-rose-500/90
            !border-rose-400/40
            !text-white
          `,

          info: `
            !bg-blue-500/90
            !border-blue-400/40
            !text-white
          `,

          warning: `
            !bg-amber-400/95
            !border-amber-300/40
            !text-black
          `,
        },

        style: {
          backdropFilter: 'blur(12px)',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
