import { DateTime } from 'luxon';

/** Get current date and time as formatted string */
export const timestamp = () => DateTime.local().toFormat('[yyyy-MM-dd hh:mm:ss]');
