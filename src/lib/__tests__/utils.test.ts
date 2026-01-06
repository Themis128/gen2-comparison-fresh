import { cn } from '../utils';

describe('cn utility function', () => {
  it('combines class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('handles conditional classes', () => {
    const condition1 = true;
    const condition2 = false;
    expect(cn('class1', condition1 && 'class2', condition2 && 'class3')).toBe('class1 class2');
  });

  it('merges Tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
    expect(result).not.toContain('px-2');
  });

  it('handles undefined and null values', () => {
    expect(cn('class1', undefined, null, 'class2')).toBe('class1 class2');
  });

  it('handles empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });

  it('handles array inputs', () => {
    expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
  });

  it('handles object inputs', () => {
    expect(cn({ 'class1': true, 'class2': false }, 'class3')).toBe('class1 class3');
  });

  it('returns empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});
