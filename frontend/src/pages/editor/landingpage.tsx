import { ArrowRight, FileText, Layout, Workflow } from "lucide-react";
import { useNavigate } from "react-router";

const Feature = ({ icon: Icon, title, description }) => (
  <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-blue-600" />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);



const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-4xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">RBuild</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="px-4 py-2 text-gray-700 hover:text-blue-600">
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                How it Works
              </a>
              <a
                href="#templates"
                className="px-4 py-2 text-gray-700 hover:text-blue-600"
              >
                Templates
              </a>
              <button onClick={() => {
                navigate("/editor")
              }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Build Your Professional Resume in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create stunning, ATS-friendly resumes with our intuitive
            drag-and-drop builder. Stand out from the crowd and land your dream
            job.
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              Start Building <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              View Templates
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Powerful Features for Professional Resumes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={Layout}
              title="Drag & Drop Builder"
              description="Intuitive interface that makes resume building a breeze. No design skills needed."
            />
            <Feature
              icon={FileText}
              title="ATS-Friendly Templates"
              description="Professionally designed templates optimized for Applicant Tracking Systems."
            />
            <Feature
              icon={Workflow}
              title="Smart Sections"
              description="Pre-built flexible sections to design."
            />
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Build Your Resume in 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Content</h3>
              <p className="text-gray-600">
                Fill in your details about your education, skills, etc.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2"> Drag and Drop Components</h3>
              <p className="text-gray-600">
                Drag and drop components into resume
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Download & Share</h3>
              <p className="text-gray-600">
                Export your resume in PDF format and start applying
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Professional Resume Templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://myresumestar.com/wp-content/uploads/2022/07/PR10.png"
                alt="Template 1"
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">Modern Clean</h3>
                <p className="text-gray-600">Professional and minimal design</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://www.resumehelp.com/wp-content/uploads/2023/09/Harvard-Resume-Template-Example.svg"
                alt="Template 2"
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">Executive Pro</h3>
                <p className="text-gray-600">Perfect for senior positions</p>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://gdoc.io/uploads/harvard-resume-free-google-docs-template-t.jpg"
                alt="Template 3"
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-semibold mb-2">Creative Edge</h3>
                <p className="text-gray-600">Stand out with style</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of job seekers who have successfully created their
            perfect resume with RBuild
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
            Get Started Now <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4  text-center">
          <div>
            <span className="text-2xl font-bold text-white"></span>
            <div className="mt-4">
              Hack&Rolls 2025
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
