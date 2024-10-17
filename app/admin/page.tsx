'use client'

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { ShopItem } from '../../types/interfaces';
import AdminItemForm from '@/components/AdminItemForm';
import AdminItemList from '@/components/AdminItemList';

export default function AdminPage() {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);

  useEffect(() => {
    fetchItems();
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

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: ShopItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = async (item: Partial<ShopItem>) => {
    if (editingItem) {
      const { error } = await supabase
        .from('shop_items')
        .update(item)
        .eq('id', editingItem.id);

      if (error) {
        console.error('Error updating item:', error);
      } else {
        fetchItems();
        handleCloseForm();
      }
    } else {
      const { error } = await supabase
        .from('shop_items')
        .insert(item);

      if (error) {
        console.error('Error adding item:', error);
      } else {
        fetchItems();
        handleCloseForm();
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase
      .from('shop_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
    } else {
      fetchItems();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Manage Items</h1>
        <button
          onClick={handleAddItem}
          className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded"
        >
          Add New Item
        </button>
      </div>
      <AdminItemList
        items={items}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
      />
      {isFormOpen && (
        <AdminItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
