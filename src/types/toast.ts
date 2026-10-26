export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'level_up';
  title: string;
  message?: string;
  amount?: number;
  durationMs?: number;
  icon?: string;
}
