
import React, { useState } from 'react';
import { Icons } from '../constants';
import Button from './Button';
import { ContactType } from '../types';

interface SearchBoxProps {
  onSearch: (query: string, type: ContactType) => void;
  isSearching: boolean;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const detectType = (val: string): ContactType => {
    return val.includes('@') ? ContactType.EMAIL : ContactType.PHONE;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim(), detectType(query.trim()));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Icons.Search />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter phone number or email address..."
          className="w-full pl-12 pr-32 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 text-lg"
          autoFocus
        />
        <div className="absolute inset-y-2 right-2 flex items-center">
          <Button type="submit" isLoading={isSearching} className="h-full px-6">
            Verify
          </Button>
        </div>
      </form>
      <p className="mt-3 text-sm text-slate-500 text-center">
        Identifies spammers, unauthorized solicitors, and malicious actors instantly.
      </p>
    </div>
  );
};

export default SearchBox;
