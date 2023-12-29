import dayjs from 'dayjs';
import type { OpUnitType } from 'dayjs';
import 'dayjs/locale/zh-tw';
dayjs.locale('zh-tw');

export const dateFormat = (date: Date, Format = 'YYYY/MM/DD') => (date ? dayjs(date).format(Format) : '');

export const dateDiff = (date1: string | Date, date2: string | Date, unit: OpUnitType = 'day', abs = 'abs'): number => {
  const diffDays = dayjs(date1).diff(dayjs(date2), unit);
  return abs === 'abs' ? Math.abs(diffDays) : diffDays;
};
