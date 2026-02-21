import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { CustomList } from '../types';
import { Plus, Trash2, List } from 'lucide-react';

export const CustomLists: React.FC = () => {
    const [lists, setLists] = useState<CustomList[]>([]);
    const [newListName, setNewListName] = useState('');

    useEffect(() => {
        loadLists();
    }, []);

    const loadLists = async () => {
        const data = await api.getCustomLists();
        setLists(data);
    };

    const handleCreateList = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newListName.trim()) return;
        const list = await api.createCustomList(newListName);
        setLists([...lists, list]);
        setNewListName('');
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-3">
                <List className="text-[var(--color-primary)]" size={32} />
                <h1 className="text-3xl font-bold">My Lists</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Create New List Card */}
                <div className="card p-6 border-dashed border-2 flex flex-col items-center justify-center text-center hover:border-[var(--color-primary)] transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-accent)] flex items-center justify-center mb-4 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                        <Plus size={24} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Create New List</h3>
                    <form onSubmit={handleCreateList} className="w-full mt-2">
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                value={newListName}
                                onChange={(e) => setNewListName(e.target.value)}
                                placeholder="List Name"
                                className="w-full flex-1 px-3 py-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                            <button
                                type="submit"
                                disabled={!newListName.trim()}
                                className="btn btn-primary w-full sm:w-auto disabled:opacity-50"
                            >
                                Add
                            </button>
                        </div>
                    </form>
                </div>

                {lists.map(list => (
                    <div key={list.id} className="card p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">{list.name}</h3>
                                <span className="text-sm text-[var(--color-text-secondary)]">
                                    {new Date(list.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-[var(--color-text-secondary)]">
                                {list.articleIds.length} articles
                            </p>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <button className="btn btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50">
                                <Trash2 size={18} />
                            </button>
                            <button className="btn btn-primary">
                                View List
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
