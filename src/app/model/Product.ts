export class Product {
  id: string;
  sku: string;
  name: string;
  category: {
    id: string;
    categoryName: string;
  };
  totalCalories: string;
  description: string;
  unitPrice: string;
  imageUrl: string;
  image: [
    imageUrl: string
  ];
  active: boolean;
  createdOn: Date;
}

export interface Pagination {
  totalElements: number;
  numberOfElements: number;
  size: number;
  totalPages: number;
  pageable: {
    pageNumber: number;
  },
  links: {
    first: string,
    previous: string,
    next: string,
    last: string
  }
}
