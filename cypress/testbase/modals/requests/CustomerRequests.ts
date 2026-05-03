export namespace CustomerRequests {
  export interface CreateCustomerRequest {
    name: string;
    email: string | null;
  }

  export class Request {
    public createCustomerRequest(customerObject: CreateCustomerRequest): CreateCustomerRequest {
      return {
        name: customerObject.name,
        email: customerObject.email,
      };
    }
  }
}
