import { formatPhoneNumber } from './formatPhoneNumber';

describe('formatPhoneNumber', () => {
  it('should format 11-digit phone number correctly', () => {
    const result = formatPhoneNumber('11912345678');
    expect(result).toBe('(11) 91234-5678');
  });

  it('should format 10-digit phone number correctly', () => {
    const result = formatPhoneNumber('1134567890');
    expect(result).toBe('(11) 3456-7890');
  });

  it('should return original input if phone number is invalid', () => {
    const result = formatPhoneNumber('12345');
    expect(result).toBe('12345');
  });
});