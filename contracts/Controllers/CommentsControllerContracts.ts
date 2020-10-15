import { DateTime } from 'luxon';

export interface ResultComment {
  id: number;
  text: string;
  updated_at: DateTime;
  parent_text?: string | null;
}
