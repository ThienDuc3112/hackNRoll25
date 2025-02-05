"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatedSection } from "./animatedSection";
import { Feature } from "./feature";
import { ArrowRight, FileText, Layout, Workflow } from "lucide-react";
import { TemplateCard } from "./templateCard";
import Background from "@/components/background";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Animated Background */}
      <Background />

      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 shadow-md backdrop-blur-sm py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer transition-all duration-300 hover:scale-110">
                RBuild
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              {["Features", "How it Works", "Templates"].map((item, index) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="relative px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300 group"
                  style={{
                    animation: `slideIn 0.5s ease-out ${
                      index * 100
                    }ms backwards`,
                  }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ))}
              <button
                onClick={() => router.push("/editor")}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Get Started
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <AnimatedSection className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
            Build Your Professional Resume in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create stunning, ATS-friendly resumes with our intuitive builder.
            Stand out from the crowd and land your dream job.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.push("/editor")}
              className="group px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 overflow-hidden relative"
            >
              <span className="relative z-10">Start Building</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
            <button className="px-8 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              View Templates
            </button>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Powerful Features for Professional Resumes
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature
              icon={Layout}
              title="Drag & Drop Builder"
              description="Intuitive interface that makes resume building a breeze."
              delay={100}
            />
            <Feature
              icon={FileText}
              title="ATS-Friendly Templates"
              description="Professionally designed templates optimized for ATS."
              delay={300}
            />
            <Feature
              icon={Workflow}
              title="Smart Sections"
              description="Pre-built flexible sections to streamline your workflow."
              delay={500}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* How it Works */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Build Your Resume in 3 Simple Steps
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                number: "1",
                title: "Add Your Content",
                description:
                  "Fill in your details about education, skills, etc.",
              },
              {
                number: "2",
                title: "Choose Template",
                description: "Select from our professional template collection",
              },
              {
                number: "3",
                title: "Download & Share",
                description:
                  "Export your resume in PDF format and start applying",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="text-center transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 hover:scale-110 hover:rotate-12">
                  <span className="text-2xl font-bold text-blue-600">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Templates Section */}
      <AnimatedSection className="py-20 px-4 " id="templates">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Professional Resume Templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TemplateCard
              image="https://s3.resume.io/cdn-cgi/image/width=840,format=auto/uploads/examples/resume/resume_pages/35505/persistent-resource/harvard-cv-examples.jpg"
              title="Classic Professional"
              description="Perfect for traditional industries and roles"
            />
            <TemplateCard
              image="https://s3.resume.io/cdn-cgi/image/width=840,format=auto/uploads/examples/resume/resume_pages/35505/persistent-resource/harvard-cv-examples.jpg"
              title="Modern Minimal"
              description="Clean design with a contemporary feel"
            />
            <TemplateCard
              image="https://s3.resume.io/cdn-cgi/image/width=840,format=auto/uploads/examples/resume/resume_pages/35505/persistent-resource/harvard-cv-examples.jpg"
              title="Creative Design"
              description="Stand out with unique layout and style"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join other job seekers who have successfully created their perfect
            resume with RBuild
          </p>
          <button
            onClick={() => router.push("/editor")}
            className="group px-8 py-3 bg-white text-blue-600 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-2 mx-auto"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <span className="text-2xl font-bold text-white">RBuild</span>
            <div className="mt-4">Hack&Rolls 2025</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
