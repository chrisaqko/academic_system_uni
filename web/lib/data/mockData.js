// ─────────────────────────────────────────────────────────────
// Scholastic Curator — Mock Data Layer
// Mirrors the live Supabase schema. Used as fallback when
// NEXT_PUBLIC_SUPABASE_URL is not configured.
// ─────────────────────────────────────────────────────────────

export const mockStatus = [
  { id_status: 1, description: true  },  // Active
  { id_status: 2, description: false },  // Inactive
];

export const mockStudyPrograms = [
  { id_program: 1, career_name: 'Bachelor of Computer Science',          id_status: 1 },
  { id_program: 2, career_name: 'Bachelor of Data Informatics',          id_status: 1 },
  { id_program: 3, career_name: 'Bachelor of Electrical Engineering',    id_status: 1 },
  { id_program: 4, career_name: 'Bachelor of Mechanical Engineering',    id_status: 1 },
  { id_program: 5, career_name: 'Master of Business Administration',     id_status: 1 },
  { id_program: 6, career_name: 'Bachelor of Architecture',              id_status: 1 },
  { id_program: 7, career_name: 'Bachelor of Medical Sciences',          id_status: 1 },
  { id_program: 8, career_name: 'Bachelor of Humanities',                id_status: 2 },
];

export const mockTeachingSpecializations = [
  { id_specialization: 1, specialization_area: 'Computer Science',       id_status: 1 },
  { id_specialization: 2, specialization_area: 'Data Engineering',       id_status: 1 },
  { id_specialization: 3, specialization_area: 'Electrical Engineering', id_status: 1 },
  { id_specialization: 4, specialization_area: 'Architecture & Design',  id_status: 1 },
  { id_specialization: 5, specialization_area: 'Physics',                id_status: 1 },
  { id_specialization: 6, specialization_area: 'Mathematics',            id_status: 1 },
  { id_specialization: 7, specialization_area: 'Medical Sciences',       id_status: 1 },
  { id_specialization: 8, specialization_area: 'Humanities',             id_status: 1 },
];

export const mockUsers = [
  // Admins
  { id_user: 1,  name: 'Marcus',   surname: 'Vance',     second_surname: null,      email: 'admin@scholastic.edu',    user_type: 'admin',   id_status: 1, id_specialization: 1 },
  // Teachers
  { id_user: 2,  name: 'Elena',    surname: 'Thornton',  second_surname: 'Cruz',    email: 'e.thornton@scholastic.edu', user_type: 'teacher', id_status: 1, id_specialization: 1 },
  { id_user: 3,  name: 'James',    surname: 'Li',        second_surname: null,      email: 'j.li@scholastic.edu',     user_type: 'teacher', id_status: 1, id_specialization: 2 },
  { id_user: 4,  name: 'Aria',     surname: 'Henderson', second_surname: 'Ruiz',    email: 'a.henderson@scholastic.edu', user_type: 'teacher', id_status: 1, id_specialization: 5 },
  { id_user: 5,  name: 'Thomas',   surname: 'Aris',      second_surname: null,      email: 't.aris@scholastic.edu',   user_type: 'teacher', id_status: 1, id_specialization: 8 },
  { id_user: 6,  name: 'Sofia',    surname: 'Vance',     second_surname: 'Park',    email: 's.vance@scholastic.edu',  user_type: 'teacher', id_status: 2, id_specialization: 4 },
  // Students
  { id_user: 7,  name: 'Alex',     surname: 'Rivers',    second_surname: null,      email: 'a.rivers@student.edu',    user_type: 'student', id_status: 1, id_specialization: 1 },
  { id_user: 8,  name: 'Sarah',    surname: 'Jenkins',   second_surname: 'Moore',   email: 's.jenkins@student.edu',   user_type: 'student', id_status: 1, id_specialization: 2 },
  { id_user: 9,  name: 'Daniel',   surname: 'Park',      second_surname: null,      email: 'd.park@student.edu',      user_type: 'student', id_status: 1, id_specialization: 3 },
  { id_user: 10, name: 'Priya',    surname: 'Sharma',    second_surname: 'Nair',    email: 'p.sharma@student.edu',    user_type: 'student', id_status: 1, id_specialization: 2 },
  { id_user: 11, name: 'Lucas',    surname: 'Ferreira',  second_surname: null,      email: 'l.ferreira@student.edu',  user_type: 'student', id_status: 2, id_specialization: 4 },
  { id_user: 12, name: 'Mia',      surname: 'Nakamura',  second_surname: 'Chen',    email: 'm.nakamura@student.edu',  user_type: 'student', id_status: 1, id_specialization: 6 },
  { id_user: 13, name: 'Omar',     surname: 'Hassan',    second_surname: null,      email: 'o.hassan@student.edu',    user_type: 'student', id_status: 1, id_specialization: 7 },
  { id_user: 14, name: 'Isabelle', surname: 'Dubois',    second_surname: 'Laurent', email: 'i.dubois@student.edu',    user_type: 'student', id_status: 1, id_specialization: 1 },
];

export const mockCourses = [
  { id_course: 1,  name: 'Advanced Architecture & Systems',  credits: 4, quota: 30, id_status: 1 },
  { id_course: 2,  name: 'Quantum Computing Fundamentals',   credits: 3, quota: 25, id_status: 1 },
  { id_course: 3,  name: 'Advanced Physics II',              credits: 4, quota: 40, id_status: 1 },
  { id_course: 4,  name: 'Calculus & Logic',                 credits: 3, quota: 45, id_status: 1 },
  { id_course: 5,  name: 'Algorithms & Logic',               credits: 4, quota: 35, id_status: 1 },
  { id_course: 6,  name: 'Classical Civilizations',          credits: 3, quota: 50, id_status: 1 },
  { id_course: 7,  name: 'History of Modernism',             credits: 3, quota: 45, id_status: 1 },
  { id_course: 8,  name: 'Senior Design Studio II',          credits: 4, quota: 12, id_status: 1 },
  { id_course: 9,  name: 'Sustainable Materials Lab',        credits: 4, quota: 18, id_status: 1 },
  { id_course: 10, name: 'Intro to Quantum Computing',       credits: 3, quota: 30, id_status: 1 },
  { id_course: 11, name: 'Vector Algebra',                   credits: 3, quota: 40, id_status: 2 },
  { id_course: 12, name: 'Structural Mechanics',             credits: 4, quota: 35, id_status: 1 },
  { id_course: 13, name: 'Faculty Meeting & Colloquium',     credits: 0, quota: 60, id_status: 1 },
  { id_course: 14, name: 'Data Structures',                  credits: 3, quota: 35, id_status: 1 },
  { id_course: 15, name: 'Machine Learning Foundations',     credits: 4, quota: 30, id_status: 1 },
];

export const mockClassrooms = [
  { id_classrom: 1,  n_classrom: 'Hall 4B',           capacity: 50,  id_status: 1 },
  { id_classrom: 2,  n_classrom: 'Lab 102',            capacity: 25,  id_status: 1 },
  { id_classrom: 3,  n_classrom: 'Lounge A',           capacity: 80,  id_status: 1 },
  { id_classrom: 4,  n_classrom: 'Room 402B',          capacity: 45,  id_status: 1 },
  { id_classrom: 5,  n_classrom: 'Main Lab A',         capacity: 30,  id_status: 1 },
  { id_classrom: 6,  n_classrom: 'Lecture Theatre 02', capacity: 120, id_status: 1 },
  { id_classrom: 7,  n_classrom: 'Seminar Room 7',     capacity: 20,  id_status: 1 },
  { id_classrom: 8,  n_classrom: 'Auditorium B',       capacity: 200, id_status: 1 },
  { id_classrom: 9,  n_classrom: 'Room 302',           capacity: 35,  id_status: 2 },
  { id_classrom: 10, n_classrom: 'Engineering Lab 1',  capacity: 40,  id_status: 1 },
];

export const mockSchedules = [
  { id_schedule: 1,  week_day: 'Monday',    shift: '08:00 - 09:30', id_status: 1 },
  { id_schedule: 2,  week_day: 'Wednesday', shift: '08:00 - 09:30', id_status: 1 },
  { id_schedule: 3,  week_day: 'Thursday',  shift: '08:00 - 09:30', id_status: 1 },
  { id_schedule: 4,  week_day: 'Tuesday',   shift: '10:00 - 11:30', id_status: 1 },
  { id_schedule: 5,  week_day: 'Thursday',  shift: '10:00 - 11:30', id_status: 1 },
  { id_schedule: 6,  week_day: 'Monday',    shift: '11:30 - 13:00', id_status: 1 },
  { id_schedule: 7,  week_day: 'Tuesday',   shift: '11:30 - 13:00', id_status: 1 },
  { id_schedule: 8,  week_day: 'Wednesday', shift: '11:30 - 13:00', id_status: 1 },
  { id_schedule: 9,  week_day: 'Thursday',  shift: '11:30 - 13:00', id_status: 1 },
  { id_schedule: 10, week_day: 'Friday',    shift: '11:30 - 13:00', id_status: 1 },
  { id_schedule: 11, week_day: 'Monday',    shift: '14:00 - 15:30', id_status: 1 },
  { id_schedule: 12, week_day: 'Wednesday', shift: '14:00 - 15:30', id_status: 1 },
  { id_schedule: 13, week_day: 'Friday',    shift: '08:00 - 09:30', id_status: 1 },
  { id_schedule: 14, week_day: 'Tuesday',   shift: '14:00 - 15:30', id_status: 1 },
  { id_schedule: 15, week_day: 'Friday',    shift: '14:00 - 15:30', id_status: 1 },
];

// course_classrom: links course + schedule + classroom
export const mockCourseClassroom = [
  { id_course: 1,  id_schedule: 1,  id_classrom: 1,  id_status: 1 }, // Adv Architecture - Mon 08:00 - Hall 4B
  { id_course: 1,  id_schedule: 2,  id_classrom: 1,  id_status: 1 }, // Adv Architecture - Wed 08:00 - Hall 4B
  { id_course: 2,  id_schedule: 5,  id_classrom: 2,  id_status: 1 }, // Quantum Computing - Thu 10:00 - Lab 102
  { id_course: 13, id_schedule: 4,  id_classrom: 3,  id_status: 1 }, // Faculty Meeting - Tue 10:00 - Lounge A
  { id_course: 7,  id_schedule: 6,  id_classrom: 4,  id_status: 1 }, // History Modernism - Mon 11:30 - 402B
  { id_course: 7,  id_schedule: 8,  id_classrom: 4,  id_status: 1 }, // History Modernism - Wed 11:30 - 402B
  { id_course: 7,  id_schedule: 9,  id_classrom: 4,  id_status: 1 }, // History Modernism - Thu 11:30 - 402B
  { id_course: 8,  id_schedule: 7,  id_classrom: 5,  id_status: 1 }, // Senior Design - Tue 11:30 - Main Lab A
  { id_course: 8,  id_schedule: 8,  id_classrom: 5,  id_status: 1 }, // Senior Design - Wed 11:30 - Main Lab A
  { id_course: 3,  id_schedule: 1,  id_classrom: 6,  id_status: 1 }, // Adv Physics - Mon 08:00 - Lecture 02
  { id_course: 4,  id_schedule: 12, id_classrom: 6,  id_status: 1 }, // Calculus - Wed 14:00 - Lecture 02
  { id_course: 5,  id_schedule: 11, id_classrom: 10, id_status: 1 }, // Algorithms - Mon 14:00 - Eng Lab
  { id_course: 9,  id_schedule: 14, id_classrom: 7,  id_status: 1 }, // Materials Lab - Tue 14:00 - Seminar 7
  { id_course: 10, id_schedule: 3,  id_classrom: 2,  id_status: 1 }, // Intro Quantum - Thu 08:00 - Lab 102
  { id_course: 15, id_schedule: 13, id_classrom: 10, id_status: 1 }, // ML Foundations - Fri 08:00 - Eng Lab
];

// teacher_allocation
export const mockTeacherAllocation = [
  { id_allocation: 1, id_user: 2,  id_course: 1,  id_schedule: 1,  id_status: 1 },
  { id_allocation: 2, id_user: 2,  id_course: 1,  id_schedule: 2,  id_status: 1 },
  { id_allocation: 3, id_user: 3,  id_course: 2,  id_schedule: 5,  id_status: 1 },
  { id_allocation: 4, id_user: 5,  id_course: 13, id_schedule: 4,  id_status: 1 },
  { id_allocation: 5, id_user: 6,  id_course: 7,  id_schedule: 6,  id_status: 1 },
  { id_allocation: 6, id_user: 6,  id_course: 7,  id_schedule: 8,  id_status: 1 },
  { id_allocation: 7, id_user: 6,  id_course: 7,  id_schedule: 9,  id_status: 1 },
  { id_allocation: 8, id_user: 6,  id_course: 8,  id_schedule: 7,  id_status: 1 },
  { id_allocation: 9, id_user: 6,  id_course: 8,  id_schedule: 8,  id_status: 1 },
  { id_allocation: 10, id_user: 4, id_course: 3,  id_schedule: 1,  id_status: 1 },
  { id_allocation: 11, id_user: 4, id_course: 4,  id_schedule: 12, id_status: 1 },
  { id_allocation: 12, id_user: 2, id_course: 5,  id_schedule: 11, id_status: 1 },
  { id_allocation: 13, id_user: 3, id_course: 15, id_schedule: 13, id_status: 1 },
];

// enrolled_schedule  (student enrollments)
export const mockEnrolledSchedule = [
  { id_enrolled_schedule: 1,  enrollment_date: '2024-08-20', id_user: 7, id_course: 3,  id_schedule: 1,  id_status: 1 },
  { id_enrolled_schedule: 2,  enrollment_date: '2024-08-20', id_user: 7, id_course: 4,  id_schedule: 12, id_status: 1 },
  { id_enrolled_schedule: 3,  enrollment_date: '2024-08-20', id_user: 7, id_course: 5,  id_schedule: 11, id_status: 1 },
  { id_enrolled_schedule: 4,  enrollment_date: '2024-08-21', id_user: 8, id_course: 1,  id_schedule: 1,  id_status: 1 },
  { id_enrolled_schedule: 5,  enrollment_date: '2024-08-21', id_user: 8, id_course: 15, id_schedule: 13, id_status: 1 },
  { id_enrolled_schedule: 6,  enrollment_date: '2024-08-22', id_user: 9, id_course: 2,  id_schedule: 5,  id_status: 1 },
  { id_enrolled_schedule: 7,  enrollment_date: '2024-08-22', id_user: 9, id_course: 5,  id_schedule: 11, id_status: 1 },
  { id_enrolled_schedule: 8,  enrollment_date: '2024-08-23', id_user: 10, id_course: 1, id_schedule: 2,  id_status: 1 },
  { id_enrolled_schedule: 9,  enrollment_date: '2024-08-23', id_user: 10, id_course: 15, id_schedule: 13, id_status: 1 },
  { id_enrolled_schedule: 10, enrollment_date: '2024-08-24', id_user: 12, id_course: 4, id_schedule: 12, id_status: 1 },
  { id_enrolled_schedule: 11, enrollment_date: '2024-08-20', id_user: 6,  id_course: 6, id_schedule: 4,  id_status: 1 },
];

// academic_history
export const mockAcademicHistory = [
  { id_history: 1, id_user: 7, id_course: 10, quarter: 'Q1', year: 2024, notas: '95/100', grade: 'A',  id_status: 1 },
  { id_history: 2, id_user: 7, id_course: 11, quarter: 'Q1', year: 2024, notas: '88/100', grade: 'A-', id_status: 1 },
  { id_history: 3, id_user: 7, id_course: 12, quarter: 'Q2', year: 2024, notas: '82/100', grade: 'B+', id_status: 1 },
  { id_history: 4, id_user: 8, id_course: 5,  quarter: 'Q1', year: 2024, notas: '91/100', grade: 'A-', id_status: 1 },
  { id_history: 5, id_user: 9, id_course: 14, quarter: 'Q1', year: 2024, notas: '78/100', grade: 'B',  id_status: 1 },
];

// Dashboard aggregate metrics
export const mockDashboardMetrics = {
  totalStudents:    18204,
  totalCourses:     1482,
  activeClassrooms: 312,
  classroomOccupancy: '94%',
  systemHealth:     '99.9%',
  departments:      14,
  staffingInsights: [
    { department: 'Engineering',    fill: 88 },
    { department: 'Humanities',     fill: 42 },
    { department: 'Medical Sciences', fill: 95 },
    { department: 'Computer Sci.',  fill: 76 },
    { department: 'Architecture',   fill: 61 },
  ],
  recentActivity: [
    { type: 'update',   title: 'Course Updated: Introduction to Neural Nets', description: "Administrator modified the prerequisite requirements for 'CSC-402'.", time: '2m ago',  icon: 'edit' },
    { type: 'register', title: 'New Registration: Sarah Jenkins',              description: 'Enrolled in Bachelor of Science in Data Informatics.',               time: '14m ago', icon: 'user-plus' },
    { type: 'warning',  title: 'Classroom Conflict: Room 302',                 description: "Overlapping schedule detected for 'Advanced Bio-Chem' and 'Seminar 101'.", time: '45m ago', icon: 'alert-triangle' },
    { type: 'update',   title: 'Schedule Published: Fall Semester',            description: 'Admin published the Fall 2024 academic schedule.',                  time: '1h ago',  icon: 'calendar' },
    { type: 'register', title: 'New Teacher: Prof. Li',                        description: 'Joined the Quantum Computing department.',                          time: '3h ago',  icon: 'user-plus' },
  ],
};

// Student dashboard data for Alex Rivers (id_user: 7)
export const mockStudentData = {
  gpa: 3.88,
  standing: 'Excellent',
  totalCredits: 102,
  totalRequired: 120,
  degreeProgress: 85,
  rank: 'Top 10%',
  id: 'ID: 20240912',
};
