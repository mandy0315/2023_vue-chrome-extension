import dayjs, { OpUnitType } from 'dayjs';
import 'dayjs/locale/zh-tw';
dayjs.locale('zh-tw');

export const dateFormat = (date: Date, Format = 'YYYY/MM/DD') => (date ? dayjs(date).format(Format) : '');

export const dateDiff = (date1: string, date2: string, unit: OpUnitType = 'day', abs = 'abs') => {
  const d = dayjs(date1);
  const diffDays = abs === 'abs' ? Math.abs(d.diff(date2, unit)) : d.diff(date2, unit);

  return diffDays;
};
