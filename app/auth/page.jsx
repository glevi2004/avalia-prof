"use client";
import {
  Container,
  Typography,
  Box,
  useTheme,
  CssBaseline,
  Alert,
  Button,
  Divider,
} from "@mui/material";
import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import { auth, googleProvider, db } from "../firebase/firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Auth = () => {
  const [error, setError] = useState("");
  const router = useRouter();
  const theme = useTheme();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Reference to the user's document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      // If user document doesn't exist, create it with the user's Google info
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerData: user.providerData,
          createdAt: new Date(),
        });
      }

      alert("Google Sign-In Successful!");
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          mt: 16,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Sign in
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        <Divider sx={{ width: "100%", my: 2 }}>Or</Divider>

        <Button
          variant="contained"
          fullWidth
          sx={{ padding: "10px" }}
          startIcon={<GoogleIcon />}
          onClick={handleGoogleSignIn}
        >
          Sign in With Google
        </Button>
      </Box>
    </Container>
  );
};

export default Auth;
