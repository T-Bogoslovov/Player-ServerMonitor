import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';

interface AddPlayerFormProps {
  onAddPlayer: (name: string) => void;
}

export const AddPlayerForm: React.FC<AddPlayerFormProps> = ({ onAddPlayer }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPlayer(name.trim());
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter player name"
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={!name.trim()}
      >
        <UserPlus className="w-5 h-5" />
      </button>
    </form>
  );
};