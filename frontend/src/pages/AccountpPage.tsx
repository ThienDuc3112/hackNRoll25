// AccountPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Edit2, Trash2, Download, LogOut, User } from 'lucide-react';

type Resume = {
  id: string;
  name: string;
  createdAt: string;
  lastModified: string;
  downloadUrl: string;
};

const AccountPage = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: '1',
      name: 'Software Engineer Resume',
      createdAt: '2024-01-15',
      lastModified: '2024-01-15',
      downloadUrl: '#'
    },
    {
      id: '2',
      name: 'Product Manager Resume',
      createdAt: '2024-01-10',
      lastModified: '2024-01-12',
      downloadUrl: '#'
    }
  ]);

  const [user] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2024-01-01'
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle file upload logic here
      console.log('Uploading file:', file.name);
    }
  };

  const handleDeleteResume = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id));
  };

  const handleEditResume = (id: string) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={32} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Resumes Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">My Resumes</h2>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Upload size={20} />
                      Upload Resume
                    </div>
                  </label>
                </div>
              </div>

              {/* Resume List */}
              <div className="divide-y">
                {resumes.map((resume) => (
                  <div key={resume.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{resume.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Created on {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Last modified {new Date(resume.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditResume(resume.id)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={20} />
                        </button>
                        <a
                          href={resume.downloadUrl}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={20} />
                        </a>
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {resumes.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No resumes yet</p>
                    <p className="text-sm mt-1">Upload your first resume to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;