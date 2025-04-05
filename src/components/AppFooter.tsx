
import React from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

const AppFooter: React.FC = () => {
  return (
    <footer className="py-8 bg-health-primary text-white">
      <div className="health-container">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center mb-4">
              <Heart className="w-6 h-6 mr-2 text-white" />
              <span className="text-xl font-bold">Dharitri Health</span>
            </div>
            <p className="text-sm text-white/80 max-w-xs">
              Your digital health companion, providing AI-powered medical report analysis 
              and personalized health recommendations.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-white/80 hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/reports" className="text-sm text-white/80 hover:text-white">
                  Reports
                </Link>
              </li>
              <li>
                <Link to="/upload" className="text-sm text-white/80 hover:text-white">
                  Upload
                </Link>
              </li>
              <li>
                <Link to="/diet" className="text-sm text-white/80 hover:text-white">
                  Diet Consultation
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-white/80" />
                <a href="mailto:support@dharitri.com" className="text-sm text-white/80 hover:text-white">
                  support@dharitri.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-white/80" />
                <a href="tel:+919876543210" className="text-sm text-white/80 hover:text-white">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 text-white/80 mt-1" />
                <span className="text-sm text-white/80">
                  123 Health Avenue, <br />
                  Medical District, <br />
                  Ahmedabad, Gujarat 380001
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-8 mt-8 text-center text-white/60 border-t border-white/10">
          <div className="mb-4">
            <Link to="/privacy" className="text-sm text-white/60 hover:text-white mx-3">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-white/60 hover:text-white mx-3">
              Terms of Service
            </Link>
            <Link to="/faq" className="text-sm text-white/60 hover:text-white mx-3">
              FAQ
            </Link>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Dharitri Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
