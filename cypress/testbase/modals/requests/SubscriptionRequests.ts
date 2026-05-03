export namespace SubscriptionRequests {
  export interface CreateSubscriptionRequest {
    productId: string;
    customerId: string;
    startDate: string | null;
  }

  export class Request {
    public createSubscriptionRequest(
      subscriptionObject: CreateSubscriptionRequest
    ): CreateSubscriptionRequest {
      return {
        productId: subscriptionObject.productId,
        customerId: subscriptionObject.customerId,
        startDate: new Date().toISOString(),
      };
    }
  }
}
