export interface Product {
  _id: string;
  title: string;
  cost: number;
  availableQuantity: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  _id: string;
  cartId: string;
  product: Product;
  quantity: number;
  updatedAt: string;
  addedAt: string;
}
export type Notification = {
  type: "error" | "warning";
  message: string;
};
export interface Cart {
  _id: string;
  hash: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsData {
  products: Product[];
  total: number;
}

export enum CartItemEvent {
  ITEM_QUANTITY_UPDATED = "ITEM_QUANTITY_UPDATED",
  ITEM_OUT_OF_STOCK = "ITEM_OUT_OF_STOCK",
}

export interface CartItemMessage {
  event: CartItemEvent;
  payload: CartItem;
}

export interface Visitor {
  _id: string;
  token: string;
  cartId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
