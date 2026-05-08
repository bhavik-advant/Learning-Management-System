import { toast } from 'sonner';

const createToast = (message: string, type: 'success' | 'error' | 'info') => {
  toast[type](message, {
    duration: 3000,
  });
};

export default createToast;
