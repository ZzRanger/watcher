/**
 * TODO: Add a check to make sure id is correct length
 * TODO: Why number??
 *
 * Primitive uuid generator
 * Use this function to create unique ids for Sessions
 *
 * @returns 5 character alphanumeric string
 */
export const createUniquSessionId = (): string => {
  return Math.random().toString(16).slice(2, 7);
};
