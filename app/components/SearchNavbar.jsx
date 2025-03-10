"use client";
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box, Link } from "@mui/material";
import SearchBar from "./SearchBar"; // Adjust the import path as needed
import NextLink from "next/link";

// TODO: make mobile responsive
const SearchNavbar = () => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "black", boxShadow: "none" }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* Logo */}
          <NextLink href="/" passHref legacyBehavior>
            <Link underline="none" sx={{ textDecoration: "none" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                AvaliaProf
              </Typography>
            </Link>
          </NextLink>

          {/* Search Bar in the middle */}
          <Box sx={{ flex: "grow", mx: 2, minWidth: "350px" }}>
            <SearchBar />
          </Box>
        </Box>

        {/* Auth Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            sx={{ color: "white", textTransform: "none", fontSize: "1rem" }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "white",
              color: "black",
              textTransform: "none",
              fontSize: "1rem",
              borderRadius: "50px",
              padding: "8px 20px",
              "&:hover": { backgroundColor: "white" },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SearchNavbar;
