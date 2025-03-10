"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../../firebase/firebaseConfig";
import SearchNavbar from "@/app/components/SearchNavbar";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Button,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const ProfessorPage = () => {
  const router = useRouter();
  const { collegeId, professorId } = useParams();
  const [professor, setProfessor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    difficultyTotal: 0,
    difficultyCount: 0,
    ratingTotal: 0,
    ratingCount: 0,
    gradeTotal: 0,
    gradeCount: 0,
    wouldTakeAgainCount: 0,
    wouldTakeAgainTotal: 0,
    ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    difficultyCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    averageRating: 0,
    averageDifficulty: 0,
    averageGrade: 0,
    wouldTakeAgainPercentage: 0,
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false); // for making review
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if the user is logged in using Firebase Authentication
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    if (!professorId || !collegeId) return;

    const fetchProfessorAndReviews = async () => {
      try {
        // Fetch the professor document
        const professorRef = doc(
          db,
          "colleges",
          collegeId,
          "professors",
          professorId
        );
        const professorSnap = await getDoc(professorRef);

        if (professorSnap.exists()) {
          setProfessor(professorSnap.data());

          // Fetch the reviews collection
          const reviewsRef = collection(professorRef, "reviews");
          const reviewsSnap = await getDocs(reviewsRef);

          const reviewsData = reviewsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReviews(reviewsData);

          // Calculate stats
          const newStats = {
            difficultyTotal: 0,
            difficultyCount: 0,
            ratingTotal: 0,
            ratingCount: 0,
            gradeTotal: 0,
            gradeCount: 0,
            wouldTakeAgainCount: 0,
            wouldTakeAgainTotal: 0,
            ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            difficultyCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          };

          reviewsData.forEach((review) => {
            // Process rating distribution and totals
            if (review.rating >= 1 && review.rating <= 5) {
              newStats.ratingCounts[review.rating]++;
              newStats.ratingTotal += review.rating;
              newStats.ratingCount++;
            }

            // Process difficulty distribution and totals
            if (review.difficulty >= 1 && review.difficulty <= 5) {
              newStats.difficultyCounts[review.difficulty]++;
              newStats.difficultyTotal += review.difficulty;
              newStats.difficultyCount++;
            }

            // Process gradeReceived
            if (typeof review.gradeReceived === "number") {
              newStats.gradeTotal += review.gradeReceived;
              newStats.gradeCount++;
            }

            // Process "wouldTakeAgain" flag
            if (typeof review.wouldTakeAgain === "boolean") {
              newStats.wouldTakeAgainTotal++;
              if (review.wouldTakeAgain) {
                newStats.wouldTakeAgainCount++;
              }
            }
          });

          // Calculate the average rating, average difficulty, average grade, and percentage of students who would take again
          newStats.averageRating = newStats.ratingCount
            ? newStats.ratingTotal / newStats.ratingCount
            : 0;
          newStats.averageDifficulty = newStats.difficultyCount
            ? newStats.difficultyTotal / newStats.difficultyCount
            : 0;
          newStats.averageGrade = newStats.gradeCount
            ? newStats.gradeTotal / newStats.gradeCount
            : 0;
          newStats.wouldTakeAgainPercentage = newStats.wouldTakeAgainTotal
            ? (newStats.wouldTakeAgainCount / newStats.wouldTakeAgainTotal) *
              100
            : 0;

          setStats(newStats);
        } else {
          console.error("Professor not found in this college!");
        }
      } catch (error) {
        console.error("Error fetching professor or reviews:", error);
      }
    };

    fetchProfessorAndReviews();
    // Check for the reviewSubmitted query parameter
    if (searchParams.get("reviewSubmitted") === "true") {
      setShowThankYou(true);
    }

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [professorId, collegeId]);

  if (!professor) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h6">Professor not found</Typography>
      </Box>
    );
  }

  const {
    name,
    overallRating,
    wouldTakeAgainPercent,
    difficulty,
    ratingDistribution = [], // Ensure ratingDistribution is an array
  } = professor;

  // Calculate the largest rating count for dynamic bar widths
  const maxCount = Math.max(...Object.values(stats.ratingCounts));

  const handleRateButton = () => {
    if (isLoggedIn) {
      router.push(
        `/colleges/${collegeId}/professors/${professorId}/rate?professorName=${encodeURIComponent(
          name
        )}`
      );
    } else {
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleThankYouClose = () => {
    setShowThankYou(false);
    router.replace(
      `/colleges/${collegeId}/professors/${professorId}`,
      undefined,
      { shallow: true }
    );
  };

  return (
    <>
      <SearchNavbar />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%",
          justifyContent: "center",
          mt: { xs: 2, md: 15 },
        }}
      >
        <Box sx={{ p: 4, height: "100%", width: { xs: "95%", md: "70%" } }}>
          {/* -------------------- TOP SECTION (Ratings, Name, Distribution) -------------------- */}
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Left Column: Rating, Name, and Stats */}
            <Box sx={{ width: { xs: "100%", md: "40%" } }}>
              {/* Overall Rating and Name */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "2rem", md: "3rem", lg: "4rem" },
                }}
              >
                {Math.round(stats.averageRating)}/5
              </Typography>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {name}
              </Typography>

              {/* Percentage and Difficulty */}
              <Box sx={{ display: "flex", gap: 4, mb: 3 }}>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", md: "1.25rem", lg: "1.5rem" },
                    }}
                  >
                    {Math.round(stats.wouldTakeAgainPercentage)}%
                  </Typography>
                  <Typography variant="body1">Escolheriam de novo</Typography>
                </Box>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderWidth: 1.5, borderColor: "black" }}
                />

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      fontSize: { xs: "1rem", md: "1.25rem", lg: "1.5rem" },
                    }}
                  >
                    {Math.round(stats.averageDifficulty)}/5
                  </Typography>
                  <Typography variant="body1">Nível de dificuldade</Typography>
                </Box>
              </Box>

              {/* "Avaliar" Button */}
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: "50px", px: 3 }}
                onClick={handleRateButton}
              >
                Avaliar →
              </Button>
            </Box>

            {/* Right Column: Rating Distribution Chart */}
            <Box
              sx={{
                width: { xs: "100%", md: "60%" },
                backgroundColor: "#f0f0f0",
                p: 3, // optional padding
                borderRadius: 2, // optional rounded corners
              }}
            >
              <Typography variant="h5" sx={{ mb: 4 }}>
                Distribuição da Nota
              </Typography>
              {Object.keys(stats.ratingCounts).map((key) => {
                const count = stats.ratingCounts[key];
                const barWidth = maxCount ? (count / maxCount) * 100 : 0;
                return (
                  <Box
                    key={key}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    {/* Rating Label */}
                    <Typography variant="body1" sx={{ width: 100 }}>
                      {key} estrelas
                    </Typography>

                    {/* Gray Track */}
                    <Box
                      sx={{
                        flexGrow: 1,
                        ml: 2,
                        backgroundColor: "#c8cfca",
                        borderRadius: 1,
                        position: "relative",
                        height: { xs: "20px", md: "25px", lg: "30px" },
                      }}
                    >
                      {/* Blue Bar */}
                      <Box
                        sx={{
                          width: `${barWidth}%`,
                          backgroundColor: "#1976d2",
                          borderRadius: 1,
                          height: "100%",
                        }}
                      />
                    </Box>

                    {/* Count */}
                    <Typography variant="body2" sx={{ ml: 2, width: 20 }}>
                      {count}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
          {/* -------------------- REVIEWS SECTION -------------------- */}
          <Box sx={{ mt: 6 }}>
            {/* Display total number of reviews */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              {reviews.length} Avaliações
            </Typography>

            <List>
              {reviews.map((review) => (
                <ListItem key={review.id} disableGutters sx={{ mb: 2 }}>
                  <Paper
                    sx={{
                      p: 2,
                      width: "100%",
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Left side: Quality/Difficulty boxes */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        backgroundColor: "#f5f5f5",
                        borderRadius: 2,
                        minWidth: 90,
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        QUALIDADE
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {review.rating}/5
                      </Typography>
                      <Divider sx={{ my: 1, width: "100%" }} />
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        DIFICULDADE
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {review.difficulty}/5
                      </Typography>
                    </Box>

                    {/* Right side: Course info, comment, user initials */}
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold" }}
                      >
                        {review?.courseCode} - {review?.courseName}
                      </Typography>
                      {console.log(review)}
                      <Typography variant="body2" sx={{ color: "gray" }}>
                        Presença:{" "}
                        {review.attendanceMandatory
                          ? "Obrigatória"
                          : "Opcional"}{" "}
                        | Escolheria de novo:{" "}
                        {review.wouldTakeAgain ? "Sim" : "Não"} | Nota:{" "}
                        {review.gradeReceived}%
                      </Typography>

                      <Typography variant="body1" sx={{ mt: 2 }}>
                        {review.comment}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mt: 2,
                        }}
                      >
                        {/* Circle with user initials */}
                        <Box
                          sx={{
                            borderRadius: "50%",
                            backgroundColor: "#777777",
                            width: 36,
                            height: 36,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                          }}
                        >
                          <Typography variant="body1" sx={{ color: "#fff" }}>
                            {review.userInitials}
                          </Typography>
                        </Box>

                        {/* Review date */}
                        <Typography variant="body2" sx={{ color: "gray" }}>
                          {review.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ width: "100%" }}
        >
          Você precisa estar logado para avaliar o professor.
        </Alert>
      </Snackbar>

      {/* --------- THANK YOU MESSAGE FOR REVIEW ------------ */}
      <Dialog
        open={showThankYou}
        onClose={handleThankYouClose}
        aria-labelledby="thank-you-dialog-title"
        aria-describedby="thank-you-dialog-description"
      >
        <DialogTitle id="thank-you-dialog-title">Obrigado!</DialogTitle>
        <DialogContent>
          <DialogContentText id="thank-you-dialog-description">
            Sua avaliação foi enviada com sucesso.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleThankYouClose} color="primary" autoFocus>
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProfessorPage;
