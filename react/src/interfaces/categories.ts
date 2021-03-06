import { ID } from "./id";

export interface Category {
  id: ID;
  name: string;
}

export type CategoryState = Category & { _links: any };

export interface Categories {
  didInvalidate: boolean;
  isFetching: boolean;
  items: Array<CategoryState>;
}

export interface Product {
  description: string;
  id: ID;
  name: string;
  price: number;
}

export type ProductState = Product & Category & { _links: any };

export interface CategoryProducts {
  categories: Array<CategoryState>;
  category: CategoryState;
  didInvalidate: boolean;
  isFetching: boolean;
  products: Array<ProductState>;
}
