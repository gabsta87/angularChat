import { IsAttendingPipe } from './is-attending.pipe';

describe('IsAttendingPipe', () => {
  it('create an instance', () => {
    const pipe = new IsAttendingPipe();
    expect(pipe).toBeTruthy();
  });
});
