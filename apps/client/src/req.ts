import ky from 'ky';

console.info('MODULE LOADED: req');

export const wpapi = ky.create({
  prefixUrl: 'https://biociencias.es/wp-json',
});
