import { TabList } from './popup';

export type SetStorageData = {
  [key in string]: string | TabList | boolean | number;
};
