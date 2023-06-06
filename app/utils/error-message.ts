export default function errorMessage(error: unknown) {
  return error instanceof Error ? error["message"] : "Erro ao adicionar preço";
}
