import { useSnackbar } from "notistack";

const useNotification = () => {
  const { enqueueSnackbar } = useSnackbar();

  const notifySuccess = (message: string) => {
    enqueueSnackbar(message, { variant: "success" });
  };

  const notifyError = (message: string) => {
    enqueueSnackbar(message, { variant: "error" });
  };

  const notifyInfo = (message: string) => {
    enqueueSnackbar(message, { variant: "info" });
  };

  return { notifySuccess, notifyError, notifyInfo };
};

export default useNotification;
