
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  FileText, 
  Upload, 
  PieChart, 
  Shield, 
  ArrowRight, 
  Award
} from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="py-4 bg-white shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="w-8 h-8 mr-2 text-health-primary" />
              <span className="text-2xl font-bold text-health-primary">Dharitri</span>
              <span className="text-2xl font-light">Health</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="text-health-primary border-health-primary hover:bg-health-primary hover:text-white">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-health-primary hover:bg-health-secondary text-white">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-health-light to-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl font-bold text-health-primary md:text-5xl lg:text-6xl">
              Your Digital Health Companion
            </h1>
            <p className="max-w-2xl mt-6 text-lg text-gray-600">
              Dharitri Health leverages AI to analyze medical reports, provide diet consultations, 
              and connect you with healthcare professionals for comprehensive care.
            </p>
            <div className="flex flex-col mt-8 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link to="/register">
                <Button size="lg" className="bg-health-primary hover:bg-health-secondary text-white">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-health-primary text-health-primary hover:bg-health-primary hover:text-white">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-health-primary">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard 
              icon={<FileText className="w-10 h-10 text-health-primary" />}
              title="AI Report Analysis"
              description="Upload your medical reports for instant AI-powered analysis and insights."
            />
            <FeatureCard 
              icon={<PieChart className="w-10 h-10 text-health-primary" />}
              title="Diet Consultation"
              description="Get personalized diet recommendations based on your health reports."
            />
            <FeatureCard 
              icon={<Shield className="w-10 h-10 text-health-primary" />}
              title="Doctor Verification"
              description="Your reports are reviewed by qualified healthcare professionals."
            />
            <FeatureCard 
              icon={<Upload className="w-10 h-10 text-health-primary" />}
              title="Easy Uploads"
              description="Securely upload and manage all your medical documents in one place."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-health-light">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-health-primary">
            How It Works
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <StepCard 
              number="1"
              title="Upload Reports"
              description="Upload your medical reports and documents through our secure platform."
            />
            <StepCard 
              number="2"
              title="AI Analysis"
              description="Our AI analyzes your reports to provide insights and recommendations."
            />
            <StepCard 
              number="3"
              title="Doctor Review"
              description="Qualified doctors review the analysis and provide additional guidance."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-health-primary">
            What Users Say
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard 
              quote="Dharitri Health has transformed how I manage my health. The AI analysis of my reports saved me hours of research."
              author="Arjun S."
              role="Patient"
            />
            <TestimonialCard 
              quote="As a doctor, I appreciate the detailed analysis provided by Dharitri. It helps me focus on what matters most for each patient."
              author="Dr. Priya M."
              role="Cardiologist"
            />
            <TestimonialCard 
              quote="The diet recommendations helped me manage my diabetes better than any general advice I've received before."
              author="Ravi K."
              role="Patient"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-white bg-health-primary">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold">Start Your Health Journey Today</h2>
          <p className="max-w-2xl mx-auto mt-4 text-lg text-white/80">
            Join thousands of users who have taken control of their health with Dharitri Health.
          </p>
          <div className="mt-8">
            <Link to="/register">
              <Button size="lg" className="bg-white text-health-primary hover:bg-health-light">
                Create Your Account <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-white bg-health-dark">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center mb-4 md:mb-0">
              <Heart className="w-6 h-6 mr-2 text-health-primary" />
              <span className="text-xl font-bold text-white">Dharitri Health</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/privacy" className="text-white/80 hover:text-white">Privacy Policy</Link>
              <Link to="/terms" className="text-white/80 hover:text-white">Terms of Service</Link>
              <Link to="/contact" className="text-white/80 hover:text-white">Contact Us</Link>
            </div>
          </div>
          <div className="pt-8 mt-8 text-center text-white/60 border-t border-white/10">
            &copy; {new Date().getFullYear()} Dharitri Health. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
    <div className="flex flex-col items-center text-center">
      {icon}
      <h3 className="mt-4 text-xl font-semibold text-health-primary">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);

const StepCard = ({ number, title, description }: { number: string, title: string, description: string }) => (
  <div className="p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-health-primary">
        <span className="text-xl font-bold">{number}</span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-health-primary">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  </div>
);

const TestimonialCard = ({ quote, author, role }: { quote: string, author: string, role: string }) => (
  <div className="p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg">
    <div className="flex flex-col items-center text-center">
      <Award className="w-8 h-8 text-health-primary" />
      <p className="mt-4 italic text-gray-600">"{quote}"</p>
      <p className="mt-4 font-semibold text-health-primary">{author}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

export default Index;
