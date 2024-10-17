export interface ShopItem {
  id: string;
  name: string;
  price: number;
  user_rating: number | null;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  item_id: string;
  quantity: number;
  created_at: string;
  shop_items: ShopItem;
}

export interface User {
  id: string;
  email: string;
}

export interface Profile {
  id: string;
  role: 'user' | 'admin';
}
