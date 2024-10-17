'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { ShopItem, CartItem } from '../types/interfaces';

export default function UserDashboard() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchItems();
    fetchCartItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
    } else {
      setItems(data as ShopItem[]);
    }
  };

  const fetchCartItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, shop_items(*)')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching cart items:', error);
    } else {
      setCartItems(data as CartItem[]);
    }
  };

  const addToCart = async (item: ShopItem) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .upsert({ user_id: user.id, item_id: item.id, quantity: 1 }, { onConflict: 'user_id,item_id' });

    if (error) {
      console.error('Error adding item to cart:', error);
    } else {
      fetchCartItems();
    }
  };

  const removeFromCart = async (itemId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', itemId);

    if (error) {
      console.error('Error removing item from cart:', error);
    } else {
      fetchCartItems();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Shop Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p>Price: ${item.price.toFixed(2)}</p>
            <p>Rating: {item.user_rating ? item.user_rating.toFixed(1) : 'N/A'}</p>
            <p>In Stock: {item.in_stock ? 'Yes' : 'No'}</p>
            <button
              onClick={() => addToCart(item)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cartItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-semibold">{item.shop_items?.name || 'Unknown Item'}</h3>
              <p>Price: {item.shop_items?.price ? `$${item.shop_items.price.toFixed(2)}` : 'N/A'}</p>
              <p>Quantity: {item.quantity || 0}</p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove from Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
