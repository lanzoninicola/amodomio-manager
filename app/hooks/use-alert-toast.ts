import { useToast } from "../components/ui/use-toast";

interface useAlertProps {
  title?: string;
  message?: string;
  timeout?: number;
}

export function useAlertErrorToast({ title, message, timeout }: useAlertProps) {
  const { toast } = useToast();

  const toastError = () =>
    toast({
      variant: "destructive",
      title: title || "Erro",
      description: message || "Um erro ocorreu, tente novamente mais tarde.",
      duration: timeout || 5000,
    });

  return toastError;
}

export function useAlertSuccessToast({
  title,
  message,
  timeout,
}: useAlertProps) {
  const { toast } = useToast();

  const toastSuccess = () =>
    toast({
      title: title || "Sucesso",
      description: message || "Operação realizada com sucesso.",
      duration: timeout || 5000,
    });

  return toastSuccess;
}
