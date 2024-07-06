import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">

      <div className="container mx-auto flex items-center justify-between px-4 py-6">
      
        <div>
          <Link to="/" className="mr-4 text-black hover:text-gray-400">Home</Link>
          <Link to="/favorites" className="text-black hover:text-gray-400">Tab2</Link>
        </div>
        
       

      </div>
      <div>
          <Link to="/create-quiz" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Create Quiz
          </Link>
        </div>
    </nav>
  );
};

export default Navbar;
