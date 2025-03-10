"use client";
import { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter, useParams } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../../../firebase/firebaseConfig";
import { useSearchParams } from "next/navigation";

export default function RateProfessor() {
  const { collegeId, professorId } = useParams();
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [wouldTakeAgain, setWouldTakeAgain] = useState("");
  const [takenForCredit, setTakenForCredit] = useState("");
  const [usedPaidTextbooks, setUsedPaidTextbooks] = useState("");
  const [attendanceMandatory, setAttendanceMandatory] = useState("");
  const [gradeReceived, setGradeReceived] = useState("");
  const [comments, setComments] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const professorName = searchParams.get("professorName");

  const handleClosePage = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    setOpenDialog(false);
    router.push(`/colleges/${collegeId}/professors/${professorId}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    // Convert "sim" and "nao" to boolean values
    const wouldTakeAgainBool = wouldTakeAgain === "sim";
    const takenForCreditBool = takenForCredit === "sim";
    const usedPaidTextbooksBool = usedPaidTextbooks === "sim";
    const attendanceMandatoryBool = attendanceMandatory === "sim";

    const review = {
      attendanceMandatory: attendanceMandatoryBool,
      comment: comments,
      courseCode,
      courseName,
      difficulty,
      gradeReceived,
      rating,
      takenForCredit: takenForCreditBool,
      usedPaidTextbooks: usedPaidTextbooksBool,
      wouldTakeAgain: wouldTakeAgainBool,
      reviewDateTime: serverTimestamp(),
      professor: professorName,
      professorId,
    };

    try {
      // Add review to user's reviews collection
      await addDoc(collection(db, "users", user.uid, "reviews"), review);

      // Add review to professor's reviews collection
      await addDoc(
        collection(
          db,
          "colleges",
          collegeId,
          "professors",
          professorId,
          "reviews"
        ),
        review
      );

      console.log("Review added successfully");
      router.push(
        `/colleges/${collegeId}/professors/${professorId}?reviewSubmitted=true`
      );
    } catch (error) {
      console.error("Error adding review: ", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, mb: 3, position: "relative" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Avalie seu Professor
        </Typography>
        <IconButton
          sx={{ position: "absolute", top: 0, right: 0 }}
          onClick={handleClosePage}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Nome do Curso"
          variant="outlined"
          fullWidth
          value={courseName}
          onChange={(event) => setCourseName(event.target.value)}
        />
        <TextField
          label="Código do Curso"
          variant="outlined"
          fullWidth
          value={courseCode}
          onChange={(event) => setCourseCode(event.target.value)}
        />

        <FormControl component="fieldset">
          <FormLabel component="legend">Avalie o professor (1 a 5)</FormLabel>
          <Rating
            name="professor-rating"
            value={rating}
            precision={1}
            onChange={(event, newValue) => setRating(newValue)}
          />
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">
            Quão difícil foi esse professor? (1 a 5)
          </FormLabel>
          <Slider
            value={difficulty}
            onChange={(event, newValue) => setDifficulty(newValue)}
            step={1}
            marks
            min={1}
            max={5}
            valueLabelDisplay="auto"
          />
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">
            Você faria aula com esse professor novamente?
          </FormLabel>
          <RadioGroup
            row
            value={wouldTakeAgain}
            onChange={(event) => setWouldTakeAgain(event.target.value)}
          >
            <FormControlLabel value="sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="nao" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">
            Essa aula foi feita para crédito?
          </FormLabel>
          <RadioGroup
            row
            value={takenForCredit}
            onChange={(event) => setTakenForCredit(event.target.value)}
          >
            <FormControlLabel value="sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="nao" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">
            O professor usou livros pagos?
          </FormLabel>
          <RadioGroup
            row
            value={usedPaidTextbooks}
            onChange={(event) => setUsedPaidTextbooks(event.target.value)}
          >
            <FormControlLabel value="sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="nao" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">A presença era obrigatória?</FormLabel>
          <RadioGroup
            row
            value={attendanceMandatory}
            onChange={(event) => setAttendanceMandatory(event.target.value)}
          >
            <FormControlLabel value="sim" control={<Radio />} label="Sim" />
            <FormControlLabel value="nao" control={<Radio />} label="Não" />
          </RadioGroup>
        </FormControl>

        <TextField
          label="Nota final recebida (0% a 100%)"
          type="number"
          inputProps={{ min: 0, max: 100 }}
          variant="outlined"
          fullWidth
          value={gradeReceived}
          onChange={(event) => setGradeReceived(Number(event.target.value))}
        />

        <TextField
          label="Escreva sua avaliação"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={comments}
          onChange={(event) => setComments(event.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{ mb: 5 }}
        >
          Enviar Avaliação
        </Button>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cancelar Avaliação</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja cancelar a avaliação? Sua avaliação não
            será salva.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Não
          </Button>
          <Button onClick={handleDialogConfirm} color="primary" autoFocus>
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
