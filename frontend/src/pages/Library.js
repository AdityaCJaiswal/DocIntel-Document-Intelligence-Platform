import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowDown, ArrowUp } from 'lucide-react';
import axios from 'axios';

export default function Library() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [sortBy, setSortBy] = useState('created_at'); // 'title' or 'created_at'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  useEffect(() => {
    axios.get('http://localhost:8000/api/documents/')
      .then(res => setDocuments(res.data))
      .catch(err => console.error('Error fetching documents:', err));
  }, []);

  const sortDocuments = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedDocs = [...documents].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (sortBy === 'title') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-5xl mx-auto rounded-lg shadow p-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold">Document Library</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold cursor-pointer" onClick={() => sortDocuments('title')}>
                Title {sortBy === 'title' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Pages</th>
              <th className="py-3 px-4 text-left text-sm font-semibold cursor-pointer" onClick={() => sortDocuments('created_at')}>
                Upload Date {sortBy === 'created_at' && (sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />)}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sortedDocs.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                <td className="py-3 px-4 text-blue-600 hover:underline cursor-pointer"
                    onClick={() => navigate(`/chat?doc=${doc.id}`)}>
                  {doc.title}
                </td>
                <td className="py-3 px-4">{doc.pages ?? '-'}</td>
                <td className="py-3 px-4">{formatDate(doc.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancel Button */}
      <div className="flex justify-end mt-8">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          onClick={() => navigate('/')}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
