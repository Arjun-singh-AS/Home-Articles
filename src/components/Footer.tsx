// components/Footer.js
'use client'
const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
          {/* Section 1: Company Info */}
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:underline">About Us</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Careers</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Press</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Blog</a>
              </li>
            </ul>
          </div>
  
          {/* Section 2: Customer Service */}
          <div>
            <h4 className="font-bold mb-4">Customer Service</h4>
            <ul>
              <li className="mb-2">
                <a href="/contact" className="hover:underline">Contact Us</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Shipping Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Returns</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">FAQs</a>
              </li>
            </ul>
          </div>
  
          {/* Section 3: Legal */}
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:underline">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Terms of Service</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Cookie Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:underline">Security</a>
              </li>
            </ul>
          </div>
  
          {/* Section 4: Social Media */}
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24h11.494V14.706h-3.13v-3.626h3.13V8.413c0-3.1 1.893-4.788 4.656-4.788 1.325 0 2.463.099 2.795.142v3.24h-1.918c-1.505 0-1.797.715-1.797 1.764v2.312h3.594l-.468 3.625h-3.126V24h6.127c.73 0 1.325-.593 1.325-1.324V1.325C24 .593 23.407 0 22.675 0z"/>
              </svg>
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557a9.829 9.829 0 01-2.828.775 4.934 4.934 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.372 4.482A13.944 13.944 0 011.671 3.149 4.916 4.916 0 003.195 9.75a4.888 4.888 0 01-2.228-.616v.062a4.919 4.919 0 003.946 4.827 4.905 4.905 0 01-2.224.084 4.922 4.922 0 004.599 3.417A9.866 9.866 0 010 21.542a13.9 13.9 0 007.548 2.213c9.057 0 14.01-7.506 14.01-14.01 0-.213-.004-.426-.014-.637A10.025 10.025 0 0024 4.557z"/>
              </svg>
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.309.974.975 1.247 2.242 1.308 3.608.059 1.266.069 1.646.069 4.85 0 3.204-.012 3.584-.07 4.85-.062 1.366-.334 2.633-1.308 3.608-.975.974-2.242 1.247-3.608 1.308-1.266.059-1.646.07-4.85.07-3.204 0-3.584-.012-4.85-.07-1.366-.062-2.633-.334-3.608-1.308-.974-.975-1.247-2.242-1.308-3.608-.059-1.266-.07-1.646-.07-4.85 0-3.204.012-3.584.07-4.85.062-1.366.334-2.633 1.308-3.608C4.517 2.497 5.784 2.224 7.15 2.163 8.416 2.104 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.071 5.772.13 4.548.432 3.463 1.517 2.378 2.602 2.076 3.826 2.017 5.106.958 6.386.946 6.796.946 10.054c0 3.259.012 3.668.071 4.948.059 1.28.362 2.504 1.447 3.589 1.085 1.085 2.309 1.388 3.589 1.447 1.28.059 1.689.071 4.948.071 3.259 0 3.668-.012 4.948-.071 1.28-.059 2.504-.362 3.589-1.447 1.085-1.085 1.388-2.309 1.447-3.589.059-1.28.071-1.689.071-4.948 0-3.259-.012-3.668-.071-4.948-.059-1.28-.362-2.504-1.447-3.589-1.085-1.085-2.309-1.388-3.589-1.447-1.28-.059-1.689-.071-4.948-.071z"/>
              <circle cx="12" cy="12" r="3.5"/>
              <path d="M18.406 4.594a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
            </svg>
              </a>
            </div>
          </div>
        </div>
  
        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  