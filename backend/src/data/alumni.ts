export interface Alumnus {
  id: number;
  name: string;
  wallet: string;
  degree: string;
  year: number;
  expertise: string[];
  status: string;
  offering: string;
}

// Keeping a shared copy of the mock alumni data used on the frontend
export const ALUMNI_DATA: Alumnus[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    wallet: "IN1A2B...X9Y8Z7",
    degree: "B.Tech Computer Science",
    year: 2023,
    expertise: ["Blockchain Development", "Smart Contracts", "Solidity"],
    status: "Blockchain Engineer at Polygon",
    offering: "Web3 Mentorship & Smart Contract Guidance"
  },
  {
    id: 2,
    name: "Ishita Verma",
    wallet: "IN2C3D...W6V5U4",
    degree: "B.Tech Information Technology",
    year: 2022,
    expertise: ["React", "Next.js", "UI/UX", "Tailwind CSS"],
    status: "Frontend Developer at Razorpay",
    offering: "Frontend Roadmap & Portfolio Review"
  },
  {
    id: 3,
    name: "Rohan Banerjee",
    wallet: "IN3E4F...T3S2R1",
    degree: "M.Tech Cybersecurity",
    year: 2023,
    expertise: ["Web Security", "Smart Contract Auditing", "Penetration Testing"],
    status: "Security Analyst at Infosys",
    offering: "Cybersecurity Career Guidance"
  },
  {
    id: 4,
    name: "Sneha Iyer",
    wallet: "IN4G5H...Q8P7O6",
    degree: "B.Des UX Design",
    year: 2021,
    expertise: ["Figma", "Design Systems", "User Research", "Prototyping"],
    status: "Product Designer at Swiggy",
    offering: "UI/UX Portfolio & Case Study Mentorship"
  },
  {
    id: 5,
    name: "Aditya Kulkarni",
    wallet: "IN5I6J...N5M4L3",
    degree: "B.Tech Computer Engineering",
    year: 2020,
    expertise: ["Node.js", "Express", "MongoDB", "System Design"],
    status: "Backend Engineer at Zomato",
    offering: "Backend Development & System Design Prep"
  },
  {
    id: 6,
    name: "Meera Nair",
    wallet: "IN6K7L...K2J1H0",
    degree: "M.S. Data Science",
    year: 2022,
    expertise: ["Python", "Machine Learning", "SQL", "Power BI"],
    status: "Data Scientist at Flipkart",
    offering: "Data Science Roadmap & Interview Prep"
  },
  {
    id: 7,
    name: "Vikram Singh",
    wallet: "IN7M8N...F9E8D7",
    degree: "B.Tech Artificial Intelligence",
    year: 2023,
    expertise: ["Deep Learning", "NLP", "TensorFlow", "LLMs"],
    status: "AI Engineer at TCS",
    offering: "AI/ML Career & Project Guidance"
  },
  {
    id: 8,
    name: "Kavya Reddy",
    wallet: "IN8O9P...C6B5A4",
    degree: "B.Tech Electronics & Communication",
    year: 2021,
    expertise: ["Flutter", "React Native", "Firebase", "Mobile Architecture"],
    status: "Mobile Developer at Paytm",
    offering: "Mobile App Development Mentorship"
  },
  {
    id: 9,
    name: "Arjun Gupta",
    wallet: "IN9Q0R...Z3Y2X1",
    degree: "MBA Technology Management",
    year: 2019,
    expertise: ["Tech Consulting", "Business Strategy", "Digital Transformation"],
    status: "Consultant at Deloitte India",
    offering: "Consulting Career & Case Prep Guidance"
  },
  {
    id: 10,
    name: "Tanvi Deshpande",
    wallet: "IN10S1T...U2V3W4",
    degree: "B.Tech Computer Science",
    year: 2020,
    expertise: ["Product Management", "Agile", "User Research", "Roadmapping"],
    status: "Product Manager at Microsoft India",
    offering: "PM Career & Interview Mentorship"
  },
  {
    id: 11,
    name: "Rahul Chatterjee",
    wallet: "IN11U2V...W5X6Y7",
    degree: "B.Tech Information Technology",
    year: 2018,
    expertise: ["Startup Strategy", "SaaS", "Fundraising", "Growth"],
    status: "Founder & CEO at EduTech Startup",
    offering: "Startup Mentorship & Founder Advice"
  },
  {
    id: 12,
    name: "Pooja Malhotra",
    wallet: "IN12X3Y...Z8A9B0",
    degree: "B.Tech Cloud Computing",
    year: 2022,
    expertise: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    status: "DevOps Engineer at Wipro",
    offering: "Cloud & DevOps Career Guidance"
  }
];
