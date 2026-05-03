export namespace ProductResponses {
  export interface ProductResponse {
    id: string;
    name: string;
    productTypeId: string;
    price: number | null;
    createdAt: string;
  }
}
