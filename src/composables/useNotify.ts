import { ref } from 'vue';
export default () => {
  const isShowNotify = ref(false);
  const notifyMsg = ref('');

  interface NotifyOptions {
    message: string;
    duration?: number;
  }

  const showNotify = ({ message, duration = 2000 }: NotifyOptions) => {
    isShowNotify.value = true;
    notifyMsg.value = message;
    setTimeout(() => {
      isShowNotify.value = false;
    }, duration);
  };

  return {
    isShowNotify,
    notifyMsg,
    showNotify,
  };
};
