import ky from 'ky';

export const wpapi = ky.create({
  prefixUrl: 'https://biociencias.es/wp-json',
});
