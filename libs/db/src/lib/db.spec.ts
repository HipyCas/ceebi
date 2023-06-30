import { notifications } from './db';

describe('db', () => {
  it('works?', () => true);
  it('should work', () => {
    expect(notifications.getAll()).to.toBeInstanceOf(Array);
  });
});
