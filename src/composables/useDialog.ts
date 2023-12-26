import { ref, nextTick } from 'vue';

export const useConfirmDialog = () => {
  const isShowDialog = ref(false);
  const dialogContent = ref({
    title: '',
    message: '',
  });

  interface ConfirmDialog {
    title: string;
    message: string;
  }
  const setConfirmDialog = ({ title, message }: ConfirmDialog): Promise<void> => {
    isShowDialog.value = true;
    dialogContent.value.title = title;
    dialogContent.value.message = message;

    return new Promise((resolve, reject) => {
      nextTick(() => {
        const confirmButton = document.querySelector('#confirmButton');
        const cancelButton = document.querySelector('#cancelButton');
        if (!confirmButton || !cancelButton) return;

        const confirmHandler = () => {
          isShowDialog.value = false;
          dialogContent.value.title = '';
          dialogContent.value.message = '';
          removeEvents();
          resolve();
        };

        const cancelHandler = () => {
          isShowDialog.value = false;
          dialogContent.value.title = '';
          dialogContent.value.message = '';
          removeEvents();
          reject();
        };

        const removeEvents = () => {
          confirmButton.removeEventListener('click', confirmHandler);
          cancelButton.removeEventListener('click', cancelHandler);
        };

        confirmButton.addEventListener('click', confirmHandler);
        cancelButton.addEventListener('click', cancelHandler);
      });
    });
  };

  return {
    isShowDialog,
    setConfirmDialog,
    dialogContent,
  };
};
