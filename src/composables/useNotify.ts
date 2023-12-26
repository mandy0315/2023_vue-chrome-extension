import { ref } from 'vue';

export default () => {
  const isShowNotify = ref(false);
  const notifyContent = ref('');

  interface SetNotify {
    message: string;
    duration?: number;
  }

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
