import React from 'react';
import { ShopItem } from '../types/interfaces';

interface AdminItemListProps {
  items: ShopItem[];
  onEditItem: (item: ShopItem) => void;
  onDeleteItem: (id: string) => void;
}

const AdminItemList: React.FC<AdminItemListProps> = ({ items, onEditItem, onDeleteItem }) => {
  return (
    <table className="min-w-full bg-white border border-gray-300">
      <thead>
        <tr>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Rating
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            In Stock
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              {item.name}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              ${item.price.toFixed(2)}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              {item.user_rating ? item.user_rating.toFixed(1) : 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              {item.in_stock ? 'Yes' : 'No'}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
              <button
                onClick={() => onEditItem(item)}
                className="text-blue-600 hover:text-blue-900 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteItem(item.id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminItemList;
