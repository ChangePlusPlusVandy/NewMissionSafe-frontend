import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import './Navbar.css';
import { FaHome, FaDoorOpen } from 'react-icons/fa';
import Logo from '../assets/MissionSafeLogo.png';
import { motion } from "framer-motion";

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const variants = {
    normal: { opacity: 0.5, scale: 1 },
    active: { opacity: 1, scale: 1.1 },
    hover: { opacity: 0.7, scale: 1.2 },
    iconhover: {scale: 1.4}
  };



  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };
  const links = [
    { to: "/events", text: "Events", className: "bottom"},
    { to: "/youth", text: "Youth", className: "bottom" },
    { to: "/forms", text: "Forms", className: "bottom" },
    
  ];
  
  

  return (
    <div className="main">
      <div className="navbar" style={{ borderBottom: '5px solid' }}>
        <motion.div
          className="icon"
          variants={variants}
          animate={location.pathname === "/" ? 'active' : 'normal'}
          whileHover="hover"
        >
          <Link to="/" className="icon-link">
            <FaHome className="navicon" />
          </Link>
        </motion.div>
        <motion.div
          className="icon"
          variants={variants}
          whileHover="iconhover"
        >
          <Link to="" className="logo-link">
            <img src={Logo} alt="Logo" className="logo" />
          </Link>
        </motion.div>
        <motion.div
          className="icon"
          variants={variants}
          animate={location.pathname === "/" ? 'active' : 'normal'}
          whileHover="hover"
          onClick={handleSignOut}
        >
          <Link to="" className="icon-link">
            <FaDoorOpen className="navicon" />
          </Link>
        </motion.div>
      </div>
      <div className="content">{children}</div>
      <div className="navbar" style={{ borderTop: '5px solid' }}>
        {links.map((link, index) => (
            <motion.div
                key={index}
                className="bottom"
                variants={variants}
                animate={location.pathname === link.to ? 'active' : 'normal'}
                whileHover="hover"
                >
                <Link to={link.to} className={link.to === "/" ? "home-link" : undefined}>
                {link.text}
                </Link>
            </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;