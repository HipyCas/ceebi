export * from './event';
export * from './mecenas';
export * from './notifications';
export * from './wpapi';
export interface ButtonSettings {
  id?: string;
  text: string;
  link: string;
  color?: Color;
  icon?: string;
  iconColor?: Color;
}

type Color =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'medium'
  | 'dark';
