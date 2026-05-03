export namespace SubscriptionResponses {
  export interface SubscriptionResponse {
    id: string;
    productId: string;
    customerId: string;
    startDate: string | null;
    status: string | null;
    createdAt: string;
  }
}
