/**
 * Retorna a assinatura ativa.
 * Implementação inicial para destravar o projeto.
 */
export function activeSubscription(subscriptions) {
  if (!subscriptions || !Array.isArray(subscriptions)) {
    return null;
  }

  return subscriptions.find(
    (subscription) =>
      subscription.status === "active" ||
      subscription.status === "trialing"
  ) || null;
}