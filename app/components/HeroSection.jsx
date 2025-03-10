"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";

const HeroSection = () => {
  const router = useRouter();

  const [searchMode, setSearchMode] = React.useState("college");
  const [collegeName, setCollegeName] = React.useState("");

  // when select a college set search mode to professor
  const handleCollegeSelect = (college) => {
    setSearchMode("professor");
  };

  const handleCollegeHeading = (collegeName) => {
    setCollegeName(collegeName);
  };

  return (
    <Box
      sx={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
        backgroundImage: "url('assets/books.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 3,
        marginTop: 3,
      }}
    >
      {/* Title */}
      <Typography variant="h3" fontWeight="bold">
        AvaliaProf
      </Typography>
      {/* Subtitle */}
      {searchMode === "professor" ? (
        <>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Agora selecione o <strong>professor</strong> da:
          </Typography>
          {/* <Typography fontSize={15} sx={{ mt: 2 }}>
            {collegeName}
          </Typography> */}
        </>
      ) : (
        <Typography variant="h6" sx={{ mt: 2 }}>
          Selecione sua <strong>instituição</strong> para começar:
        </Typography>
      )}
      {console.log(searchMode)}
      {/* Search Bar */}
      {/* Search Bar + Dropdown Wrapper */}
      <Box
        sx={{
          mt: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          width: { xs: "80%", sm: "50%", md: "40%" },
        }}
      >
        {/* Search Bar */}
        <SearchBar
          heroSectionToProfessor={handleCollegeSelect}
          heroSectionCollegeHeading={handleCollegeHeading}
        />
      </Box>
      {/* Dropdown for search results */}
      {/* Additional Link */}
      {/* <Typography variant="body2" sx={{ mt: 2, color: "white", fontSize: 16 }}>
        Quero procurar pelo nome do <strong>professor</strong>
      </Typography> */}
    </Box>
  );
};

export default HeroSection;
