import { Link } from "wouter";
import { Atom } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <Atom className="h-8 w-8 text-purple-400 mr-2" />
              <span className="text-xl font-bold">AMC International Co., Ltd</span>
            </div>
            <p className="text-gray-400 mb-4">
              2024 © A.M.C International Co., Ltd.<br />
              All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Home</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Background
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Vision</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/vision" className="hover:text-white transition-colors">
                  Goals
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Focus Areas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/product" className="hover:text-white transition-colors">
                  OmPathy
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  AI Solutions
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Terms Of Service
            </a>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
