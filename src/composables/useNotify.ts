import { ref } from 'vue';

export default () => {
  const isShowNotify = ref(false);
  const notifyMsg = ref('');

  interface SetNotify {
    message: string;
    duration?: number;
  }

  const setNotify = ({ message, duration = 2000 }: SetNotify) => {
    isShowNotify.value = true;
    notifyMsg.value = message;
    setTimeout(() => {
      isShowNotify.value = false;
    }, duration);
  };

  return {
    isShowNotify,
    notifyMsg,
    setNotify,
  };
};
