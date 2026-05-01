export type GetInitialsOptions = {
  /** Max number of words to use when the string contains spaces. */
  maxWords?: number;
  /** Max number of characters when the string is a single word. */
  maxChars?: number;
  /** Fallback when input is empty or doesn't yield initials. */
  fallback?: string;
};

export default function getInitials(
  input: string | null | undefined,
  { maxWords = 2, maxChars = 2, fallback = 'U' }: GetInitialsOptions = {}
): string {
  const value = (input ?? '').trim();
  if (!value) return fallback;

  const words = value.split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    const initials = words
      .slice(0, maxWords)
      .map(word => word[0] ?? '')
      .join('')
      .toUpperCase();

    return initials || fallback;
  }

  const cleaned = value.replace(/[^a-zA-Z0-9]/g, '');
  if (!cleaned) return fallback;

  return cleaned.slice(0, maxChars).toUpperCase();
}
