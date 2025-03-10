import { NextResponse } from "next/server";

// Dummy data (Replace with a database query in the future)
export const colleges = [
  {
    id: 1,
    name: "Universidade de São Paulo (USP)",
    city: "São Paulo",
    state: "SP",
    rating: 4,
    numberOfRatings: 10,
  },
  {
    id: 2,
    name: "Universidade Estadual de Campinas (Unicamp)",
    city: "Campinas",
    state: "SP",
    rating: 4.3,
    numberOfRatings: 20,
  },
  {
    id: 3,
    name: "Universidade Federal do Rio de Janeiro (UFRJ)",
    city: "Rio de Janeiro",
    state: "RJ",
    rating: 3.7,
    numberOfRatings: 7,
  },
  {
    id: 4,
    name: "Universidade Federal de Minas Gerais (UFMG)",
    city: "Belo Horizonte",
    state: "MG",
    rating: 2.2,
    numberOfRatings: 8,
  },
];

// Dummy data for Programs
export const programs = [
  {
    id: 1,
    collegeId: 1, // USP
    name: "Computer Science",
    degreeType: "Bachelor's",
    description: "Undergraduate program in computer science.",
    duration: "4 years",
  },
  {
    id: 2,
    collegeId: 1, // USP
    name: "Medicine",
    degreeType: "Bachelor's",
    description: "Medical program with emphasis on research.",
    duration: "6 years",
  },
  {
    id: 3,
    collegeId: 2, // Unicamp
    name: "Engineering",
    degreeType: "Bachelor's",
    description: "Engineering program focused on innovation.",
    duration: "5 years",
  },
  {
    id: 4,
    collegeId: 3, // UFRJ
    name: "Law",
    degreeType: "Bachelor's",
    description: "Law program with various specializations.",
    duration: "5 years",
  },
];

// Dummy data for Professors
export const professors = [
  {
    id: 1,
    name: "Dr. João Silva",
    email: "joao.silva@example.com",
    biography: "Experienced professor in computer science.",
    department: "Computer Science",
  },
  {
    id: 2,
    name: "Dr. Maria Souza",
    email: "maria.souza@example.com",
    biography: "Expert in biomedical research.",
    department: "Medicine",
  },
  {
    id: 3,
    name: "Dr. Pedro Oliveira",
    email: "pedro.oliveira@example.com",
    biography: "Specialist in engineering design and analysis.",
    department: "Engineering",
  },
  {
    id: 4,
    name: "Dr. Ana Lima",
    email: "ana.lima@example.com",
    biography: "Renowned legal scholar and educator.",
    department: "Law",
  },
];

// Dummy data for Classes
export const classes = [
  {
    id: 1,
    programId: 1, // Computer Science
    professorId: 1, // Dr. João Silva
    name: "Introduction to Programming",
    description: "Covers basics of programming using Python.",
    credits: 4,
    schedule: "Mon/Wed/Fri 9:00 AM - 10:00 AM",
  },
  {
    id: 2,
    programId: 2, // Medicine
    professorId: 2, // Dr. Maria Souza
    name: "Human Anatomy",
    description: "Detailed study of the human body's structure.",
    credits: 5,
    schedule: "Tue/Thu 10:00 AM - 12:00 PM",
  },
  {
    id: 3,
    programId: 3, // Engineering
    professorId: 3, // Dr. Pedro Oliveira
    name: "Statics and Dynamics",
    description: "Fundamentals of forces, moments, and equilibrium.",
    credits: 4,
    schedule: "Mon/Wed 2:00 PM - 4:00 PM",
  },
  {
    id: 4,
    programId: 4, // Law
    professorId: 4, // Dr. Ana Lima
    name: "Constitutional Law",
    description: "In-depth study of constitutional principles.",
    credits: 3,
    schedule: "Fri 1:00 PM - 4:00 PM",
  },
];

// GET request to fetch all colleges
// export async function GET() {
//   return NextResponse.json(colleges);
// }
// GET request to fetch all dummy database data
export async function GET() {
  const database = {
    colleges,
    programs,
    professors,
    classes,
  };
  return NextResponse.json(database);
}
