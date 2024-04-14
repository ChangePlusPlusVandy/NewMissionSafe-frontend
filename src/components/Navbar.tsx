import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { Paper, Box, Container, Image } from "@mantine/core";
import { FaHome, FaDoorOpen } from "react-icons/fa";
import Logo from "../assets/MissionSAFELogoWhiteBg.png";
import Folder from "../assets/Folder.png";
import Calendar from "../assets/CalendarNav.png";
import People from "../assets/People.png";

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  const links = [
    { to: "/events", text: "Events", className: "bottom", image: Calendar },
    { to: "/youth", text: "Youth", className: "bottom", image: People },
    { to: "/staff", text: "Staff", className: "bottom", image: People },
    { to: "/forms", text: "Forms", className: "bottom", image: Folder },
  ];

  const topStyle = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: " center",
  };
  const topIconStyle = { color: "white", width: "100%", height: "50%" };

  const top = [
    <Link to="/" style={topStyle}>
      <FaHome style={topIconStyle} />{" "}
    </Link>,
    <Image src={Logo} w={"50%"} />,
    <Link onClick={handleSignOut} to="" style={topStyle}>
      <FaDoorOpen style={topIconStyle} />{" "}
    </Link>,
  ];

  return (
    <Container fluid style={{ height: "100dvh", width: "100dvw", padding: 0 }}>
      <Box
        h={"10%"}
        w={"100%"}
        display={"flex"}
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          zIndex: 2,
          background: "#022B41",
          justifyContent: "space-between",
        }}
      >
        {top.map((t) => (
          <Box
            w={"33%"}
            display={"flex"}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            {t}
          </Box>
        ))}
      </Box>
      <Box h={"auto"} w={"100%"} mih={"100%"}>
        {children}
      </Box>
      <Paper
        style={{
          position: "fixed",
          width: "100%",
          height: "7.5%",
          bottom: 0,
          left: 0,
          zIndex: 2,
          background: "#F4F4F4",
          borderRadius: 3,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {links.map((link) => (
          <Box w={"25%"}>
            <Link
              to={link.to}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#022B41",
              }}
            >
              {link.text}
              <Image src={link.image} w={"30%"} />
            </Link>
          </Box>
        ))}
      </Paper>
    </Container>
  );
};

export default Navbar;
