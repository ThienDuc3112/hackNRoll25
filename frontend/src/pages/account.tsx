import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Edit2,
  Trash2,
  Download,
  LogOut,
  User,
  ArrowLeft,
  Home,
} from "lucide-react";

const Account = () => {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([
    {
      id: "1",
      name: "Software Engineer Resume",
      createdAt: "2024-01-15",
      lastModified: "2024-01-15",
      downloadUrl: "#",
    },
    {
      id: "2",
      name: "Product Manager Resume",
      createdAt: "2024-01-10",
      lastModified: "2024-01-12",
      downloadUrl: "#",
    },
  ]);

  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-01-01",
  });

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Uploading file:", file.name);
    }
  };

  const handleDeleteResume = (id) => {
    setResumes(resumes.filter((resume) => resume.id !== id));
  };

  const handleEditResume = (id) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Enhanced Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-1" />
        <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-2" />
        <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float-3" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float-4" />
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float-5" />
        <div className="absolute top-1/2 left-1/2 w-56 h-56 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float-6" />
      </div>
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </button>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow p-6">
              <div className="relative mb-8">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 inline-block pb-2">
                  My Account
                </h1>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={32} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="border-t pt-4 space-y-4">
                <p className="text-sm text-gray-600">
                  Member since {new Date(user.joinDate).toLocaleDateString()}
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Resumes Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow">
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
                  </label>
                </div>
              </div>

              <div className="divide-y">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="p-6 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{resume.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Created on{" "}
                            {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Last modified{" "}
                            {new Date(resume.lastModified).toLocaleDateString()}
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
                    <p className="text-sm mt-1">
                      Upload your first resume to get started
                    </p>
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

export default Account;
