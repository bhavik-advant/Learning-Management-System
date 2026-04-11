'use client';

import { CgClose } from 'react-icons/cg';
import { useSidebarShell } from '@/components/layout/sidebar-shell-context';

export default function SidebarCloseButton() {
  const { closeSidebar } = useSidebarShell();

  return (
    <button type="button" onClick={closeSidebar} className="lg:hidden" aria-label="Close menu">
      <CgClose />
    </button>
  );
}
