import dayjs from 'dayjs';
import 'dayjs/locale/zh-tw';
dayjs.locale('zh-tw');

export const dateFormat = (date: Date, Format = 'YYYY/MM/DD') => (date ? dayjs(date).format(Format) : '');
