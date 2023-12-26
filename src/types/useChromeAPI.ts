export type StorageDataOptions = {
  [key in string]: unknown;
};

/** 建立鬧鐘的參數
 * @param delayInMinutes 延遲幾分鐘後觸發;單位分鐘
 * @param periodInMinutes 每隔幾分鐘觸發一次;單位分鐘
 * @param when 觸發時間;單位毫秒
 */
export interface AlarmsOptions {
  delayInMinutes: number;
  periodInMinutes: number;
  when: number;
}
