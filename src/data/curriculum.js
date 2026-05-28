/**
 * SLTC GPA Calculator - Preloaded Curriculum & Electives Database
 * 
 * syllabus maps:
 * - Common Computing curriculum (Years 1 & 2)
 * - Software Engineering (Years 3 & 4)
 * - Cyber Security (Years 3 & 4 - EXACT OFFICIAL SYLLABUS TABLES)
 * - Cloud Computing (Years 3 & 4 - EXACT OFFICIAL SYLLABUS TABLES)
 * - Data Science (Years 3 & 4 - EXACT OFFICIAL SYLLABUS TABLES)
 * - Applied IT (3-Year Degree: Years 1, 2, and 3)
 * - Dynamic Electives Pool
 * - Precise SLTC grading scale (A+ to E)
 */

// Common Years 1 & 2 (Level 1 & 2) for SE, CS, CC, and DS
const COMMON_COMPUTING_YEARS = {
  1: {
    1: {
      core: [
        { code: 'CCS1300', name: 'Programming Concepts', credits: 3, category: 'GPA' },
        { code: 'CCS1301', name: 'Computer Systems', credits: 3, category: 'GPA' },
        { code: 'CCS1302', name: 'Internet Technologies', credits: 3, category: 'GPA' },
        { code: 'CCS1311', name: 'Mathematics for Computing', credits: 4, category: 'GPA' },
        { code: 'SMA0302', name: 'Introductory Calculus', credits: 3, category: 'GPA' }
      ]
    },
    2: {
      core: [
        { code: 'CCS1303', name: 'Object Oriented Programming', credits: 3, category: 'GPA' },
        { code: 'CCS1304', name: 'Data Technologies', credits: 3, category: 'GPA' },
        { code: 'CCS1307', name: 'Entrepreneurship & Start-up Culture', credits: 3, category: 'GPA' },
        { code: 'CCS1310', name: 'Professional Practice', credits: 3, category: 'GPA' },
        { code: 'CCS2301', name: 'Business Analysis and Software Design', credits: 3, category: 'GPA' }
      ]
    }
  },
  2: {
    1: {
      core: [
        { code: 'CCS1305', name: 'Communication Protocols and Models', credits: 3, category: 'GPA' },
        { code: 'CCS2300', name: 'Data Structures and Algorithms', credits: 3, category: 'GPA' },
        { code: 'CCS2303', name: 'Operating Systems and Platforms', credits: 3, category: 'GPA' },
        { code: 'CCS2310', name: 'Programming with Vectors and Matrices', credits: 3, category: 'GPA' },
        { code: 'CSD2301', name: 'Effective Communication', credits: 3, category: 'GPA' }
      ]
    },
    2: {
      core: [
        { code: 'CCS1306', name: 'Information Security', credits: 3, category: 'GPA' },
        { code: 'CCS2302', name: 'Cloud Computing Fundamentals', credits: 3, category: 'GPA' },
        { code: 'CCS2311', name: 'Human Factors in Computer Systems', credits: 3, category: 'GPA' },
        { code: 'CCS2313', name: 'Project Management', credits: 3, category: 'GPA' },
        { code: 'SMA2306', name: 'Probability & Statistics', credits: 3, category: 'GPA' }
      ]
    }
  }
};

// Fallback Unified Electives Pool for general use
export const ELECTIVES_POOL = [
  { code: 'CCS3316', name: 'Compiler Design', credits: 3, category: 'GPA' },
  { code: 'CCS3318', name: 'Distributed Systems & Algorithms', credits: 3, category: 'GPA' },
  { code: 'CCS3342', name: 'Agile Software Methodologies', credits: 3, category: 'GPA' },
  { code: 'CCS3351', name: 'Graphics & Visual Computing', credits: 3, category: 'GPA' },
  { code: 'CCS4340', name: 'Big Data Analytics', credits: 3, category: 'GPA' },
  { code: 'SMA1301', name: 'Numerical Methods', credits: 3, category: 'GPA' },
  { code: 'SMA2202', name: 'Linear Algebra', credits: 3, category: 'GPA' },
  { code: 'CCS3341', name: 'Software Security', credits: 3, category: 'GPA' },
  { code: 'CCS4310', name: 'Machine Learning Foundations', credits: 3, category: 'GPA' },
  { code: 'CCS4350', name: 'Advanced Cloud Architecture', credits: 3, category: 'GPA' },
  { code: 'CCS4351', name: 'Internet of Things (IoT) Systems', credits: 3, category: 'GPA' },
  { code: 'CCS4352', name: 'Embedded Systems Engineering', credits: 3, category: 'GPA' },
  { code: 'CCS4353', name: 'Digital Forensics & Incident Response', credits: 3, category: 'GPA' },
  { code: 'CCS4354', name: 'Ethical Hacking & Penetration Testing', credits: 3, category: 'GPA' },
  { code: 'CCS4355', name: 'Deep Learning & Neural Networks', credits: 3, category: 'GPA' },
  { code: 'CCS4356', name: 'Natural Language Processing', credits: 3, category: 'GPA' },
  { code: 'CCS4357', name: 'Computer Vision & Image Processing', credits: 3, category: 'GPA' },
  { code: 'CCS4360', name: 'Parallel & Concurrent Programming', credits: 3, category: 'GPA' },
  { code: 'CCS4361', name: 'Software Product Management', credits: 3, category: 'GPA' },
  { code: 'CCS4362', name: 'Human-Computer Interaction Seminar', credits: 3, category: 'GPA' },
  { code: 'CCS4363', name: 'Special Topics in Software Engineering', credits: 3, category: 'GPA' },
  { code: 'SMA2305', name: 'Optimization Techniques', credits: 3, category: 'GPA' }
];

// Mapped Electives Pool for Computing Level 4 (Official Table 3 for CS, CC & DS)
const COMPUTING_LEVEL_4_ELECTIVES = [
  { code: 'CCS3341', name: 'SOA and Microservices', credits: 3, category: 'GPA' },
  { code: 'CCS4310', name: 'Deep Learning', credits: 3, category: 'GPA' },
  { code: 'CCS4350', name: 'Ethical Hacking', credits: 3, category: 'GPA' },
  { code: 'CCS4351', name: 'Functional Programming', credits: 3, category: 'GPA' },
  { code: 'CCS4352', name: 'Application Security', credits: 3, category: 'GPA' },
  { code: 'CCS4353', name: 'Internet of Things', credits: 3, category: 'GPA' },
  { code: 'CCS4354', name: 'Tensors and Graphs (with programming)', credits: 3, category: 'GPA' },
  { code: 'CCS4355', name: 'Cyber Terrorism and Information Warface', credits: 3, category: 'GPA' },
  { code: 'CCS4356', name: 'Intelligent Threat Management', credits: 3, category: 'GPA' },
  { code: 'CCS4357', name: 'Blockchain and Applications', credits: 3, category: 'GPA' },
  { code: 'CCS4360', name: 'Techniques in Social Media', credits: 3, category: 'GPA' },
  { code: 'CCS4361', name: 'Immersive Technology Development', credits: 3, category: 'GPA' },
  { code: 'CCS4362', name: 'Service Integration and Management', credits: 3, category: 'GPA' },
  { code: 'CCS4363', name: 'Supercomputing and Quantum Computing', credits: 3, category: 'GPA' },
  { code: 'SMA2305', name: 'Numerical Analysis', credits: 3, category: 'GPA' }
];

export const CURRICULUM_DATABASE = {
  "software-engineering": {
    name: "Software Engineering",
    durationYears: 4,
    years: {
      ...COMMON_COMPUTING_YEARS,
      3: {
        1: {
          core: [
            { code: 'CCS2360', name: 'Software Development Group Project', credits: 3, category: 'GPA' },
            { code: 'CCS3300', name: 'Software Engineering Concepts', credits: 3, category: 'GPA' },
            { code: 'CCS3310', name: 'Design Patterns & Principles', credits: 3, category: 'GPA' },
            { code: 'CCS3311', name: 'Enterprise Software Development', credits: 3, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CCS3302', name: 'DevOps & Cloud Operations', credits: 3, category: 'GPA' },
            { code: 'CCS3313', name: 'Advanced Web Application Architecture', credits: 3, category: 'GPA' },
            { code: 'SMA2307', name: 'Discrete Mathematics', credits: 3, category: 'GPA' }
          ]
        }
      },
      4: {
        1: {
          core: [
            { code: 'CCS3301', name: 'Research Methodologies & Design', credits: 3, category: 'GPA' },
            { code: 'CCS3440', name: 'Individual Capstone Project Part I', credits: 4, category: 'GPA' },
            { code: 'IHM1301', name: 'Industrial Training & Internship', credits: 3, category: 'NGPA' }
          ]
        },
        2: {
          core: [
            { code: 'CCS4601', name: 'Individual Capstone Project Part II (Thesis)', credits: 6, category: 'NGPA' },
            { code: 'CCS4301', name: 'Professional Ethics & Law', credits: 3, category: 'GPA' }
          ]
        }
      }
    }
  },
  "cyber-security": {
    name: "Cyber Security",
    durationYears: 4,
    years: {
      ...COMMON_COMPUTING_YEARS,
      3: {
        1: {
          core: [
            { code: 'CCS2360', name: 'Technology Challenge Competition', credits: 3, category: 'GPA' },
            { code: 'CCS3304', name: 'Cyber Security Domains and Tools', credits: 3, category: 'GPA' },
            { code: 'CCS3305', name: 'Cyber Law, Regulations and Policies', credits: 3, category: 'GPA' },
            { code: 'CCS4330', name: 'Network Security', credits: 3, category: 'GPA' }
          ],
          electives: [
            { code: 'CCS3300', name: 'Software Architecture', credits: 3, category: 'GPA' },
            { code: 'CCS3307', name: 'Data Warehousing', credits: 3, category: 'GPA' },
            { code: 'CCS3308', name: 'Virtualization and Containers', credits: 3, category: 'GPA' },
            { code: 'CCS3310', name: 'Software Engineering Methods', credits: 3, category: 'GPA' },
            { code: 'CCS3311', name: 'Software Quality Assurance', credits: 3, category: 'GPA' },
            { code: 'CCS3356', name: 'Natural Language Processing', credits: 3, category: 'GPA' },
            { code: 'CCS4322', name: 'Cloud Security and Privacy', credits: 3, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CCS3302', name: 'Introduction to Research Methods', credits: 3, category: 'GPA' },
            { code: 'CCS3317', name: 'Advanced Cryptography', credits: 3, category: 'GPA' },
            { code: 'SMA2307', name: 'Discrete Mathematics', credits: 3, category: 'GPA' }
          ],
          electives: [
            { code: 'CCS3309', name: 'Big Data', credits: 3, category: 'GPA' },
            { code: 'CCS3312', name: 'Cloud Application Development', credits: 3, category: 'GPA' },
            { code: 'CCS3313', name: 'Advanced Software Design', credits: 3, category: 'GPA' },
            { code: 'CCS3316', name: 'Cloud Infrastructure Design', credits: 3, category: 'GPA' },
            { code: 'CCS3318', name: 'Digital Forensics', credits: 3, category: 'GPA' },
            { code: 'CCS3342', name: 'Business Intelligence (Business Analytics)', credits: 3, category: 'GPA' },
            { code: 'CCS3351', name: 'Mobile Application Development', credits: 3, category: 'GPA' },
            { code: 'CCS4340', name: 'Machine Learning', credits: 3, category: 'GPA' },
            { code: 'SMA1301', name: 'Intermediate Elective', credits: 3, category: 'GPA' },
            { code: 'SMA2202', name: 'Linear Algebra', credits: 3, category: 'GPA' }
          ]
        }
      },
      4: {
        1: {
          core: [
            { code: 'CCS3301', name: 'Capstone Project-Part 1', credits: 3, category: 'GPA' },
            { code: 'CCS3440', name: 'Artificial Intelligence', credits: 4, category: 'GPA' },
            { code: 'IHM1301', name: 'Human Behavior and Ethics', credits: 3, category: 'GPA' }
          ],
          electives: COMPUTING_LEVEL_4_ELECTIVES
        },
        2: {
          core: [
            { code: 'CCS4601', name: 'Industrial Training', credits: 6, category: 'NGPA' },
            { code: 'CCS4301', name: 'Capstone Project-Part 2', credits: 3, category: 'GPA' }
          ],
          electives: COMPUTING_LEVEL_4_ELECTIVES
        }
      }
    }
  },
  "cloud-computing": {
    name: "Cloud Computing",
    durationYears: 4,
    years: {
      ...COMMON_COMPUTING_YEARS,
      3: {
        1: {
          core: [
            { code: 'CCS2360', name: 'Technology Challenge Competition', credits: 3, category: 'GPA' },
            { code: 'CCS3307', name: 'Data Warehousing', credits: 3, category: 'GPA' },
            { code: 'CCS3308', name: 'Virtualization and Containers', credits: 3, category: 'GPA' },
            { code: 'CCS4322', name: 'Cloud Security and Privacy', credits: 3, category: 'GPA' }
          ],
          electives: [
            { code: 'CCS3300', name: 'Software Architecture', credits: 3, category: 'GPA' },
            { code: 'CCS3304', name: 'Cyber Security Domains and Tools', credits: 3, category: 'GPA' },
            { code: 'CCS3305', name: 'Cyber Law, Regulations and Policies', credits: 3, category: 'GPA' },
            { code: 'CCS3310', name: 'Software Engineering Methods', credits: 3, category: 'GPA' },
            { code: 'CCS3311', name: 'Software Quality Assurance', credits: 3, category: 'GPA' },
            { code: 'CCS4330', name: 'Network Security', credits: 3, category: 'GPA' },
            { code: 'CCS3356', name: 'Natural Language Processing', credits: 3, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CCS3302', name: 'Introduction to Research Methods', credits: 3, category: 'GPA' },
            { code: 'CCS3312', name: 'Cloud Application Development', credits: 3, category: 'GPA' },
            { code: 'SMA2307', name: 'Discrete Mathematics', credits: 3, category: 'GPA' }
          ],
          electives: [
            { code: 'CCS3309', name: 'Big Data', credits: 3, category: 'GPA' },
            { code: 'CCS3313', name: 'Advanced Software Design', credits: 3, category: 'GPA' },
            { code: 'CCS3317', name: 'Advanced Cryptography', credits: 3, category: 'GPA' },
            { code: 'CCS3316', name: 'Cloud Infrastructure Design', credits: 3, category: 'GPA' },
            { code: 'CCS3318', name: 'Digital Forensics', credits: 3, category: 'GPA' },
            { code: 'CCS3342', name: 'Business Intelligence (Business Analytics)', credits: 3, category: 'GPA' },
            { code: 'CCS3351', name: 'Mobile Application Development', credits: 3, category: 'GPA' },
            { code: 'CCS4340', name: 'Machine Learning', credits: 3, category: 'GPA' },
            { code: 'SMA1301', name: 'Intermediate Elective', credits: 3, category: 'GPA' },
            { code: 'SMA2202', name: 'Linear Algebra', credits: 3, category: 'GPA' }
          ]
        }
      },
      4: {
        1: {
          core: [
            { code: 'CCS3301', name: 'Capstone Project-Part 1', credits: 3, category: 'GPA' },
            { code: 'CCS3440', name: 'Artificial Intelligence', credits: 4, category: 'GPA' },
            { code: 'IHM1301', name: 'Human Behavior and Ethics', credits: 3, category: 'GPA' }
          ],
          electives: COMPUTING_LEVEL_4_ELECTIVES
        },
        2: {
          core: [
            { code: 'CCS4601', name: 'Industrial Training', credits: 6, category: 'NGPA' },
            { code: 'CCS4301', name: 'Capstone Project-Part 2', credits: 3, category: 'GPA' }
          ],
          electives: COMPUTING_LEVEL_4_ELECTIVES
        }
      }
    }
  },
  "data-science": {
    name: "Data Science",
    durationYears: 4,
    years: {
      ...COMMON_COMPUTING_YEARS,
      3: {
        1: {
          core: [
            { code: 'CCS2360', name: 'Technology Challenge Competition', credits: 3, category: 'GPA' },
            { code: 'CCS3307', name: 'Data Warehousing', credits: 3, category: 'GPA' },
            { code: 'CCS3308', name: 'Virtualization and Containers', credits: 3, category: 'GPA' },
            { code: 'CCS3356', name: 'Natural Language Processing', credits: 3, category: 'GPA' }
          ],
          electives: [
            { code: 'CCS3300', name: 'Software Architecture', credits: 3, category: 'GPA' },
            { code: 'CCS3304', name: 'Cyber Security Domains and Tools', credits: 3, category: 'GPA' },
            { code: 'CCS3305', name: 'Cyber Law, Regulations and Policies', credits: 3, category: 'GPA' },
            { code: 'CCS3310', name: 'Software Engineering Methods', credits: 3, category: 'GPA' },
            { code: 'CCS3311', name: 'Software Quality Assurance', credits: 3, category: 'GPA' },
            { code: 'CCS4322', name: 'Cloud Security and Privacy', credits: 3, category: 'GPA' },
            { code: 'CCS4330', name: 'Network Security', credits: 3, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CCS3302', name: 'Introduction to Research Methods', credits: 3, category: 'GPA' },
            { code: 'CCS3309', name: 'Big Data', credits: 3, category: 'GPA' },
            { code: 'SMA2307', name: 'Discrete Mathematics', credits: 3, category: 'GPA' },
            { code: 'CCS3312', name: 'Cloud Application Development', credits: 3, category: 'GPA' }
          ],
          electives: [
            { code: 'CCS3313', name: 'Advanced Software Design', credits: 3, category: 'GPA' },
            { code: 'CCS3317', name: 'Advanced Cryptography', credits: 3, category: 'GPA' },
            { code: 'CCS3316', name: 'Cloud Infrastructure Design', credits: 3, category: 'GPA' },
            { code: 'CCS3318', name: 'Digital Forensics', credits: 3, category: 'GPA' },
            { code: 'CCS3342', name: 'Business Intelligence (Business Analytics)', credits: 3, category: 'GPA' },
            { code: 'CCS3351', name: 'Mobile Application Development', credits: 3, category: 'GPA' },
            { code: 'CCS4340', name: 'Machine Learning', credits: 3, category: 'GPA' },
            { code: 'SMA1301', name: 'Intermediate Elective', credits: 3, category: 'GPA' },
            { code: 'SMA2202', name: 'Linear Algebra', credits: 3, category: 'GPA' }
          ]
        }
      },
      4: {
        1: {
          core: [
            { code: 'CCS3301', name: 'Capstone Project-Part 1', credits: 3, category: 'GPA' },
            { code: 'CCS3440', name: 'Artificial Intelligence', credits: 4, category: 'GPA' },
            { code: 'IHM1301', name: 'Human Behavior and Ethics', credits: 3, category: 'GPA' }
          ],
          electives: COMPUTING_LEVEL_4_ELECTIVES
        },
        2: {
          core: [
            { code: 'CCS4601', name: 'Industrial Training', credits: 6, category: 'NGPA' },
            { code: 'CCS4301', name: 'Capstone Project-Part 2', credits: 3, category: 'GPA' }
          ],
          electives: COMPUTING_LEVEL_4_ELECTIVES
        }
      }
    }
  },
  "applied-it": {
    name: "Applied IT",
    durationYears: 3,
    years: {
      1: {
        1: {
          core: [
            { code: 'CIT100', name: 'Introduction to Information Technology', credits: 3, category: 'GPA' },
            { code: 'CIT101', name: 'Fundamentals of Computer Systems', credits: 3, category: 'GPA' },
            { code: 'CIT102', name: 'Mathematics for Technology', credits: 2, category: 'GPA' },
            { code: 'CIT103', name: 'Algorithms & Programming Concepts', credits: 3, category: 'GPA' },
            { code: 'CMA100', name: 'General Mathematics', credits: 2, category: 'GPA' },
            { code: 'CEN100', name: 'English for Technology', credits: 3, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CIT110', name: 'Database Management Systems', credits: 3, category: 'GPA' },
            { code: 'CIT111', name: 'Object Oriented Programming', credits: 3, category: 'GPA' },
            { code: 'CIT112', name: 'Web Technologies', credits: 3, category: 'GPA' },
            { code: 'CIT113', name: 'Networking Essentials', credits: 3, category: 'GPA' },
            { code: 'CIT114', name: 'Operating Systems', credits: 2, category: 'GPA' },
            { code: 'CMN110', name: 'Professional Communication I', credits: 2, category: 'GPA' }
          ]
        }
      },
      2: {
        1: {
          core: [
            { code: 'CIT200', name: 'Data Structures & Algorithms', credits: 3, category: 'GPA' },
            { code: 'CIT201', name: 'Software Engineering Fundamentals', credits: 3, category: 'GPA' },
            { code: 'CIT202', name: 'Systems Analysis & Design', credits: 3, category: 'GPA' },
            { code: 'CIT203', name: 'Object Oriented Programming II', credits: 3, category: 'GPA' },
            { code: 'CMN200', name: 'Professional Communication II', credits: 2, category: 'GPA' },
            { code: 'CMN201', name: 'Career Development', credits: 2, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CIT210', name: 'Human Computer Interaction', credits: 3, category: 'GPA' },
            { code: 'CIT211', name: 'Mobile Application Development', credits: 3, category: 'GPA' },
            { code: 'CIT212', name: 'E-Commerce Systems', credits: 3, category: 'GPA' },
            { code: 'CMA210', name: 'Statistics for Technology', credits: 2, category: 'GPA' },
            { code: 'CMN210', name: 'Ethics & Law in IT', credits: 2, category: 'GPA' },
            { code: 'CMN211', name: 'Project Management', credits: 3, category: 'GPA' }
          ]
        }
      },
      3: {
        1: {
          core: [] // Empty but allows custom electives
        },
        2: {
          core: [] // Empty but allows custom electives
        }
      }
    }
  }
};

export const GRADING_SYSTEM = {
  'A+': { gp: 4.0, range: '85-100' },
  'A':  { gp: 4.0, range: '80-84' },
  'A-': { gp: 3.7, range: '75-79' },
  'B+': { gp: 3.3, range: '70-74' },
  'B':  { gp: 3.0, range: '65-69' },
  'B-': { gp: 2.7, range: '60-64' },
  'C+': { gp: 2.3, range: '55-59' },
  'C':  { gp: 2.0, range: '50-54' },
  'C-': { gp: 1.7, range: '45-49' },
  'D+': { gp: 1.3, range: '40-44' },
  'D':  { gp: 1.0, range: '35-39' },
  'E':  { gp: 0.0, range: '0-34' }
};
