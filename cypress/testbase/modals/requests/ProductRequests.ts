export namespace ProductRequests {
  export interface CreateProductRequest {
    name: string;
    productTypeId: string;
    price: number | null;
  }

  export class Request {
    public createProductRequest(productObject: CreateProductRequest): CreateProductRequest {
      return {
        name: productObject.name,
        productTypeId: productObject.productTypeId,
        price: productObject.price,
      };
    }
  }
}
