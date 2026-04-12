export const CALLBACK_REQUEST_PREFIX = 'Preferred callback slot:';

export const createCallbackRequestNote = (
  dateLabel: string,
  slot: string
): string => `${CALLBACK_REQUEST_PREFIX} ${dateLabel} at ${slot}`;

export const upsertCallbackRequestNote = (
  message: string,
  callbackRequestNote: string
): string => {
  const cleanedMessage = message
    .split(/\r?\n/)
    .filter(
      (line) => !line.trimStart().startsWith(CALLBACK_REQUEST_PREFIX)
    )
    .join('\n')
    .trim();

  return cleanedMessage
    ? `${cleanedMessage}\n\n${callbackRequestNote}`
    : callbackRequestNote;
};
