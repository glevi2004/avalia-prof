export const colleges = [
  {
    id: 1,
    name: "Universidade de São Paulo (USP)",
    city: "São Paulo",
    state: "SP",
  },
  {
    id: 2,
    name: "Universidade Estadual de Campinas (Unicamp)",
    city: "Campinas",
    state: "SP",
  },
  {
    id: 3,
    name: "Universidade Federal do Rio de Janeiro (UFRJ)",
    city: "Rio de Janeiro",
    state: "RJ",
  },
  {
    id: 4,
    name: "Universidade Federal de Minas Gerais (UFMG)",
    city: "Belo Horizonte",
    state: "MG",
  },
];

export const professors = [
  {
    id: 1,
    name: "Dr. João Silva",
    collegeId: 1,
    department: "Computer Science",
    overallRating: 4.5,
  },
  {
    id: 2,
    name: "Prof. Maria Oliveira",
    collegeId: 2,
    department: "Mathematics",
    overallRating: 3.8,
  },
  {
    id: 3,
    name: "Dr. Paulo Mendes",
    collegeId: 3,
    department: "Physics",
    overallRating: 4.2,
  },
  {
    id: 4,
    name: "Prof. Ana Souza",
    collegeId: 4,
    department: "Engineering",
    overallRating: 4.7,
  },
];

export const ratings = [
  {
    professorId: 1,
    rating: 5,
    comment: "Ótimo professor! Explica muito bem.",
    student: "Pedro",
  },
  {
    professorId: 1,
    rating: 4,
    comment: "Bom, mas poderia dar mais exemplos.",
    student: "Ana",
  },
  {
    professorId: 2,
    rating: 3,
    comment: "Aulas um pouco monótonas.",
    student: "Carlos",
  },
  {
    professorId: 3,
    rating: 5,
    comment: "Excelente! Aprendi muito.",
    student: "Mariana",
  },
  {
    professorId: 4,
    rating: 4.5,
    comment: "Super atenciosa e didática.",
    student: "João",
  },
];
