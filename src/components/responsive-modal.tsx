import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';

type ResponsiveModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export function ResponsiveModal({
  open,
  onOpenChange,
  children,
  title,
  description,
}: ResponsiveModalProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkMediaQuery = () => {
      setIsDesktop(window.matchMedia('(min-width: 768px)').matches);
    };
    checkMediaQuery();
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    mediaQuery.addEventListener('change', checkMediaQuery);
    return () => mediaQuery.removeEventListener('change', checkMediaQuery);
  }, []);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <AnimatePresence>
          <DialogContent className='w-[75vw]! max-w-none! h-[90vh] bg-slate-800 border-slate-700 p-0 overflow-hidden flex flex-col'>
            <div className='flex-1 min-h-0 flex flex-col'>{children}</div>
          </DialogContent>
        </AnimatePresence>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction='bottom'>
      <DrawerContent className='bg-slate-800 border-slate-700 max-h-[90vh] flex flex-col'>
        {title && (
          <DrawerHeader>
            <DrawerTitle className='text-white'>{title}</DrawerTitle>
            {description && (
              <p className='text-gray-400 text-sm'>{description}</p>
            )}
          </DrawerHeader>
        )}
        <div className='flex-1 min-h-0 overflow-hidden flex flex-col'>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
