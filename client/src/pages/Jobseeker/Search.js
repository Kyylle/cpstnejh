import React, { useState } from 'react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ employers: [], jobs: [], jobseekers: [], content: [] });
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/auth/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setLoading(false);
  };

  const renderResults = () => {
    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    if (activeTab === 'All') {
      return (
        <>
          {renderCategory('Users', results.jobseekers)}
          {renderCategory('Jobs', results.jobs)}
          {renderCategory('Posts', results.content)}
        </>
      );
    }

    switch (activeTab) {
      case 'Users':
        return renderCategory('Users', results.jobseekers);
      case 'Jobs':
        return renderCategory('Jobs', results.jobs);
      case 'Posts':
        return renderCategory('Posts', results.content);
      default:
        return null;
    }
  };

  const renderCategory = (title, items) => {
    if (!items.length) return <p className="text-gray-500">No {title.toLowerCase()} found.</p>;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <ul className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={index} className="p-4 border rounded-lg shadow hover:shadow-md transition">
              {title === 'Users' && (
                <>
                  <h4 className="font-bold">{item.name || 'Unnamed User'}</h4>
                  <p className="text-gray-500">{item.location}</p>
                </>
              )}
              {title === 'Jobs' && (
                <>
                  <h4 className="font-bold">{item.jobTitle}</h4>
                  <p className="text-gray-500">{item.location}</p>
                  <p className="text-gray-500">{item.jobType}</p>
                </>
              )}
              {title === 'Posts' && (
                <>
                  <h4 className="font-bold">{item.caption || 'Untitled Post'}</h4>
                  <p className="text-gray-500">Posted by: {item.employer?.companyName || 'Unknown'}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border rounded-lg shadow focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Search
          </button>
        </div>
      </form>

      {/* Tabs */}
      <div className="flex space-x-4 border-b pb-2">
        {['All', 'Users', 'Jobs', 'Posts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 text-sm font-semibold ${
              activeTab === tab
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-500 hover:text-indigo-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="mt-4">{renderResults()}</div>
    </div>
  );
};

export default Search;
