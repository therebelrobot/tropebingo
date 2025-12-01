/**
 * Simple className concatenation utility
 * Filters out falsy values and joins class names
 * Supports arrays and nested conditions
 */
type ClassValue = string | undefined | null | false | ClassValue[];

export function cn(...classes: ClassValue[]): string {
  const flatten = (items: ClassValue[]): string[] => {
    const result: string[] = [];

    for (const item of items) {
      if (!item) continue;

      if (Array.isArray(item)) {
        result.push(...flatten(item));
      } else {
        result.push(item);
      }
    }

    return result;
  };

  return flatten(classes).filter(Boolean).join(' ');
}