/**
 * Filtra el objeto de pedido para no enviar numero_pedido si está vacío ("").
 * Deja pasar valores válidos (UUID) y null.
 */
export function limpiaNumeroPedido<T extends { numero_pedido?: string | null }>(pedido: T): T {
    if (pedido.numero_pedido === "") {
      const copia = { ...pedido };
      delete copia.numero_pedido;
      return copia;
    }
    return pedido;
  }