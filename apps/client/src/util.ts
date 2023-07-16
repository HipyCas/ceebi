import { toast } from './ui';
import { bugOutline } from 'ionicons/icons';

export const extractContent = (html: string) => {
  const span = document.createElement('span');
  span.innerHTML = html;
  return span.textContent || span.innerText;
};

export const debug = (scope: string, msg: string, color?: string) => {
  const _msg = `[${scope}] ${msg}`;
  console.log(_msg);
  // useToast(_msg, bugOutline, color);
};
