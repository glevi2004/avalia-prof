"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();

  // Handler to navigate to /auth
  const handleAuthNavigation = () => {
    router.push("/auth");
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
        }}
      >
        {/* Logo */}
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
          AvaliaProf
        </Typography>

        {/* Navigation Links if needed in the future*/}

        {/* Auth Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={handleAuthNavigation}
            sx={{ color: "black", textTransform: "none", fontSize: "1rem" }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAuthNavigation}
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              borderRadius: "50px",
              padding: "8px 20px",
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
