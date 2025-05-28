import React from 'react';

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
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Library</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Title</th>
              <th className="py-2 px-4 border-b text-left">Pages</th>
              <th className="py-2 px-4 border-b text-left">Upload Date</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{doc.title}</td>
                <td className="py-2 px-4 border-b">{doc.pages}</td>
                <td className="py-2 px-4 border-b">{doc.uploadDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}