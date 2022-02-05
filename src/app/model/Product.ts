export class Product {
  id: string;
  name: string;
  discount: boolean;
  category: {
    id: string;
    categoryName: string;
  };
  totalCalories: string;
  description: string;
  unitPrice: number;
  discountedPrice: number;
  imageUrl: string;
  images: [
    imageName: string
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
