import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Dummy data for demonstration
const documents = [
  {
    id: 1,
    title: "Project Proposal.pdf",
    pages: 12,
    uploadDate: "2024-06-01"
  },
  {
    id: 2,
    title: "Invoice_2024_05.pdf",
    pages: 2,
    uploadDate: "2024-05-28"
  },
  {
    id: 3,
    title: "Research Paper.docx",
    pages: 25,
    uploadDate: "2024-05-15"
  }
];

export default function Library() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto rounded-lg shadow p-8">
      {/* Header with Back Button */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-md mr-3"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold">Library</h2>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold">Title</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Pages</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Upload Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition">
                <td className="py-3 px-4">{doc.title}</td>
                <td className="py-3 px-4">{doc.pages}</td>
                <td className="py-3 px-4">{doc.uploadDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Cancel Button at Bottom */}
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