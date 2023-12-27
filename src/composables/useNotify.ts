import { ref } from 'vue';

import type { SetNotify } from '@/types';

export default () => {
  const isShowNotify = ref(false);
  const notifyContent = ref('');

  const setNotify = ({ message, duration = 2000 }: SetNotify) => {
    isShowNotify.value = true;
    notifyContent.value = message;
    setTimeout(() => {
      isShowNotify.value = false;
      notifyContent.value = '';
    }, duration);
  };

  return {
    isShowNotify,
    notifyContent,
    setNotify,
  };
};
