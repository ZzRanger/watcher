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

export const formatCheckInTime = (date: string): string => {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
  });
};

export const formatReportTime = (
  startDate: string,
  endDate: string
): string => {
  return `${new Date(startDate).toLocaleTimeString(undefined, {
    timeStyle: 'short',
  })} - ${
    endDate
      ? new Date(endDate).toLocaleTimeString(undefined, {
          timeStyle: 'short',
        })
      : 'now'
  }`;
};

export const formatReportDate = (
  startDate: string,
  endDate: string
): string => {
  if (new Date(startDate).getDate() === new Date(endDate).getDate()) {
    return new Date(startDate).toLocaleDateString(undefined, {
      dateStyle: 'short',
    });
  }
  return `${new Date(startDate).toLocaleDateString(undefined, {
    dateStyle: 'short',
  })} - ${
    endDate
      ? new Date(endDate).toLocaleDateString(undefined, { dateStyle: 'short' })
      : 'now'
  }`;
};
export function formatPhoneNumber(phoneNumberString: string): string {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phoneNumberString;
}
