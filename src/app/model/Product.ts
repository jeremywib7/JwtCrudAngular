export class Product {
  id: number;
  sku: string;
  name: string;
  category: {
    id: string;
    categoryName: string;
  };
  totalCalories:string;
  description: string;
  unitPrice: string;
  imageUrl: string;
  // image: [
  //   imageUrl: string
  // ];
  active: boolean;
  createdOn: Date;
}
