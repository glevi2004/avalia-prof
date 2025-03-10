"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  List,
  ListItem,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import SchoolIcon from "@mui/icons-material/School";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import HeroSection from "./HeroSection";

const SearchBar = ({ heroSectionToProfessor, heroSectionCollegeHeading }) => {
  const router = useRouter();

  // State for search text
  const [search, setSearch] = useState("");

  // State for Filtered Results
  const [filteredResults, setFilteredResults] = useState([]);

  // State for Mode: "college" or "professor
  const [mode, setMode] = useState("college");

  // State for each collection: colleges, professors
  const [colleges, setColleges] = useState([]);
  const [professors, setProfessors] = useState([]);

  // State to store Firestore data
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [loading, setLoading] = useState(true);

  // Subscribe to the "colleges" colection
  useEffect(() => {
    const collegesRef = collection(db, "colleges");
    const unsubscribe = onSnapshot(
      collegesRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setColleges(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error loading colleges:", error);
        setLoading(false);
      }
    );
    // Cleanup: Unsubscribe from the snapshot listener when the component unmounts or the user changes.
    return () => unsubscribe();
  }, []);

  // When a college is selected and mode is "professor", subscribe to its "professors" subcollection
  useEffect(() => {
    if (mode === "professor" && selectedCollege) {
      const professorRef = collection(
        db,
        "colleges",
        selectedCollege.id,
        "professors"
      );

      const unsubscribe = onSnapshot(
        professorRef,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProfessors(data);
          setLoading(false);
        },
        (error) => {
          console.log("Error loading professors:", error);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    }
  }, [mode, selectedCollege]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Filter results whenever search, mode, or the underlying data changes
  useEffect(() => {
    const query = search.trim().toLowerCase();
    if (query.length > 0) {
      if (mode === "college") {
        const filtered = colleges.filter((college) =>
          (college.name || "").toLowerCase().includes(query)
        );
        setFilteredResults(filtered);
      } else if (mode === "professor") {
        const filtered = professors.filter((professor) =>
          (professor.name || "").toLowerCase().includes(query)
        );
        setFilteredResults(filtered);
      }
    } else {
      setFilteredResults([]);
    }
  }, [search, mode, colleges, professors]);

  // Handle selection from dropdown
  const handleSelectCollege = (college) => {
    setSelectedCollege(college);
    setSearch("");
    setFilteredResults([]);
    setMode("professor");
    heroSectionToProfessor("professor");
    heroSectionCollegeHeading(college.name);
  };

  // Navigate to the professor page upon selection
  const handleSelectProfessor = (professorId) => {
    router.push(`/colleges/${selectedCollege.id}/professors/${professorId}`);
    setSearch("");
    setFilteredResults([]);
  };

  const placeholderText =
    mode === "college"
      ? "Digite o nome da instituição..."
      : "Digite o nome do professor...";

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        fullWidth
        value={search}
        placeholder={placeholderText}
        variant="outlined"
        onChange={handleSearch}
        sx={{
          backgroundColor: "white",
          borderRadius: "50px",
          "& fieldset": { border: "none" },
        }}
        InputProps={{
          sx: { padding: "0px 10px" },
          endAdornment: (
            <InputAdornment position="end">
              <IconButton sx={{ color: "black" }}>
                {mode === "college" ? (
                  <SchoolIcon sx={{ fontSize: "28px" }} />
                ) : (
                  <PersonOutlineIcon sx={{ fontSize: "28px" }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {/* Show loading spinner while fetching data */}
      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            mt: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={30} />
        </Box>
      )}
      {/* Show dropdown only when not loading and there are filtered results */}

      {!loading && filteredResults.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            mt: -2,
            boxShadow: 3,
            borderRadius: "10px",
            backgroundColor: "white",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          <List>
            {mode === "college"
              ? filteredResults.map((college) => (
                  <ListItem
                    key={college.id}
                    component="button"
                    onClick={() => handleSelectCollege(college)}
                    sx={{
                      backgroundColor: "transparent",
                      marginTop: "2px",
                      border: "0",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                      cursor: "pointer",
                      padding: "10px 15px",
                    }}
                  >
                    {college.name}
                  </ListItem>
                ))
              : filteredResults.map((professor) => (
                  <ListItem
                    key={professor.id}
                    component="button"
                    onClick={() => handleSelectProfessor(professor.id)}
                    sx={{
                      backgroundColor: "transparent",
                      marginTop: "2px",
                      border: "0",
                      "&:hover": { backgroundColor: "#f0f0f0" },
                      cursor: "pointer",
                      padding: "10px 15px",
                    }}
                  >
                    {professor.name}
                  </ListItem>
                ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default SearchBar;
