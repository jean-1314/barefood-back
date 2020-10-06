import { DateTime } from 'luxon';

export interface ResultComment {
  id: number;
  uid: string;
  text: string;
  updated_at: DateTime;
  parent_text?: string | null;
}

export interface ResultUser {
  id: number;
  uid: string;
  name: string;
  avatar: string;
}
