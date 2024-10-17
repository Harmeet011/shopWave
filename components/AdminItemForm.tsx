import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { ShopItem } from '../types/interfaces';

interface AdminItemFormProps {
  item: ShopItem | null;
  onSave: (item: Partial<ShopItem>) => void;
  onClose: () => void;
}

const AdminItemForm: React.FC<AdminItemFormProps> = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<ShopItem>>({
    name: '',
    price: 0,
    user_rating: null,
    in_stock: true,
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        price: item.price,
        user_rating: item.user_rating,
        in_stock: item.in_stock,
      });
    }
  }, [item]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: formData.price !== undefined ? formData.price : 0,
      user_rating: formData.user_rating !== undefined ? formData.user_rating : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {item ? 'Edit Item' : 'Add New Item'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price || ''}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="user_rating" className="block text-sm font-medium text-gray-700">User Rating</label>
            <input
              type="number"
              name="user_rating"
              id="user_rating"
              value={formData.user_rating !== null ? formData.user_rating : ''}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="in_stock" className="block text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="in_stock"
                id="in_stock"
                checked={formData.in_stock || false}
                onChange={handleChange}
                className="mr-2"
              />
              In Stock
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-black font-medium py-1 px-3 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminItemForm;
