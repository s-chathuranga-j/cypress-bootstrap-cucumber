export namespace ProductTypeRequests {
  export interface CreateProductTypeRequest {
    name: string;
    description: string | null;
  }

  export class Request {
    public createProductTypeRequest(
      productTypeObject: CreateProductTypeRequest
    ): CreateProductTypeRequest {
      return {
        name: productTypeObject.name,
        description: productTypeObject.description,
      };
    }
  }
}
