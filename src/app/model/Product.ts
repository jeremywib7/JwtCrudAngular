export class Product {
  id: string;
  sku: string;
  name: string;
  category: {
    id: string;
    categoryName: string;
  };
  description: string;
  unitPrice: string;
  imageUrl: string;
  active: boolean;
  createdOn: Date;
  updatedOn: Date;
}
