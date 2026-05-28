/**
 * SLTC GPA Calculator v2 - Preloaded Curriculum & Electives Database
 * 
 * Includes:
 * 1. Full Year 1 & 2 common tracks for Computing degrees.
 * 2. Full Year 3 & 4 Core/Elective tracks for Software Engineering.
 * 3. 3-Year Applied IT curriculum.
 * 4. Extended Grading System containing double-E scale.
 */

// Common Years 1 & 2 for SE, Cloud Computing, Cyber Security, and Data Science
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
        { code: 'CCS2300-DSA', name: 'Data Structures and Algorithms', credits: 3, category: 'GPA' },
        { code: 'CCS2300-OS', name: 'Operating Systems and Platforms', credits: 3, category: 'GPA' },
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

export const CURRICULUM_DATABASE = {
  "software-engineering": {
    name: "Software Engineering",
    years: {
      ...COMMON_COMPUTING_YEARS,
      3: {
        1: {
          core: [
            { code: 'CCS2360', name: 'Software Development Group Project', credits: 3, category: 'GPA' },
            { code: 'CCS3300', name: 'Advanced Software Engineering', credits: 3, category: 'GPA' },
            { code: 'CCS3310', name: 'Web Application Development', credits: 3, category: 'GPA' },
            { code: 'CCS3311', name: 'Mobile Application Development', credits: 3, category: 'GPA' }
          ],
          electivesPool: [
            { code: 'CCS3304', name: 'Artificial Intelligence', credits: 3, category: 'GPA' },
            { code: 'CCS3305', name: 'Data Mining & Warehousing', credits: 3, category: 'GPA' },
            { code: 'CCS3307', name: 'Information Systems Management', credits: 3, category: 'GPA' },
            { code: 'CCS3308', name: 'Enterprise Architecture', credits: 3, category: 'GPA' },
            { code: 'CCS3356', name: 'Software Architecture & Design', credits: 3, category: 'GPA' },
            { code: 'CCS4322', name: 'Blockchain Technologies', credits: 3, category: 'GPA' },
            { code: 'CCS4330', name: 'Advanced Database Systems', credits: 3, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CCS3302', name: 'DevOps & Cloud Operations', credits: 3, category: 'GPA' },
            { code: 'CCS3313', name: 'User Experience & Interaction Design', credits: 3, category: 'GPA' },
            { code: 'SMA2307', name: 'Discrete Mathematics', credits: 3, category: 'GPA' }
          ],
          electivesPool: [
            { code: 'CCS3309', name: 'High-Performance Computing', credits: 3, category: 'GPA' },
            { code: 'CCS3312', name: 'Software Quality Assurance & Testing', credits: 3, category: 'GPA' },
            { code: 'CCS3317', name: 'Network Security & Cryptography', credits: 3, category: 'GPA' },
            { code: 'CCS3316', name: 'Compiler Design', credits: 3, category: 'GPA' },
            { code: 'CCS3318', name: 'Distributed Systems & Algorithms', credits: 3, category: 'GPA' },
            { code: 'CCS3342', name: 'Agile Software Methodologies', credits: 3, category: 'GPA' },
            { code: 'CCS3351', name: 'Graphics & Visual Computing', credits: 3, category: 'GPA' },
            { code: 'CCS4340', name: 'Big Data Analytics', credits: 3, category: 'GPA' },
            { code: 'SMA1301', name: 'Numerical Methods', credits: 3, category: 'GPA' },
            { code: 'SMA2202', name: 'Linear Algebra', credits: 3, category: 'GPA' }
          ]
        }
      },
      4: {
        1: {
          core: [
            { code: 'CCS3301', name: 'Research Methodologies & Design', credits: 3, category: 'GPA' },
            { code: 'CCS3440', name: 'Individual Capstone Project Part I', credits: 4, category: 'GPA' },
            { code: 'IHM1301', name: 'Industrial Training & Internship', credits: 3, category: 'GPA' }
          ],
          electivesPool: [
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
          ]
        },
        2: {
          core: [
            { code: 'CCS4601', name: 'Individual Capstone Project Part II', credits: 6, category: 'GPA' },
            { code: 'CCS4301', name: 'Professional Ethics & Law', credits: 3, category: 'GPA' }
          ],
          electivesPool: [
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
          ]
        }
      }
    }
  },
  "cloud-computing": {
    name: "Cloud Computing",
    years: {
      ...COMMON_COMPUTING_YEARS
    }
  },
  "cyber-security": {
    name: "Cyber Security",
    years: {
      ...COMMON_COMPUTING_YEARS
    }
  },
  "data-science": {
    name: "Data Science",
    years: {
      ...COMMON_COMPUTING_YEARS
    }
  },
  "applied-it": {
    name: "Applied IT",
    years: {
      1: {
        1: {
          core: [
            { code: 'CIT100', name: 'Essentials of IT', credits: 3, category: 'GPA' },
            { code: 'CIT101', name: 'Fundamentals of Programming', credits: 3, category: 'GPA' },
            { code: 'CIT102', name: 'Digital Fundamentals', credits: 2, category: 'GPA' },
            { code: 'CIT103', name: 'Fundamentals of Networking', credits: 3, category: 'GPA' },
            { code: 'CMA100', name: 'Basics of Probability', credits: 2, category: 'GPA' },
            { code: 'CEN100', name: 'Oral and Written Communication', credits: 3, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CIT110', name: 'Introduction to Web Technologies', credits: 3, category: 'GPA' },
            { code: 'CIT111', name: 'Database Management Systems', credits: 3, category: 'GPA' },
            { code: 'CIT112', name: 'Systems Analysis and Design', credits: 3, category: 'GPA' },
            { code: 'CIT113', name: 'Data Communication and Networks', credits: 3, category: 'GPA' },
            { code: 'CIT114', name: 'Computational Mathematics', credits: 2, category: 'GPA' },
            { code: 'CMN110', name: 'Business Management Fundamentals', credits: 2, category: 'GPA' }
          ]
        }
      },
      2: {
        1: {
          core: [
            { code: 'CIT200', name: 'Enterprise Application Development', credits: 3, category: 'GPA' },
            { code: 'CIT201', name: 'Data Structures and Algorithms', credits: 3, category: 'GPA' },
            { code: 'CIT202', name: 'Operating Systems & Platforms', credits: 3, category: 'GPA' },
            { code: 'CIT203', name: 'IT Project Management', credits: 3, category: 'GPA' },
            { code: 'CMN200', name: 'Professional Development', credits: 2, category: 'GPA' },
            { code: 'CMN201', name: 'Financial Accounting & Costing', credits: 2, category: 'GPA' }
          ]
        },
        2: {
          core: [
            { code: 'CIT210', name: 'Web Application Architecture', credits: 3, category: 'GPA' },
            { code: 'CIT211', name: 'Information Security Essentials', credits: 3, category: 'GPA' },
            { code: 'CIT212', name: 'Cloud Infrastructure & Services', credits: 3, category: 'GPA' },
            { code: 'CMA210', name: 'Quantitative Methods for IT', credits: 2, category: 'GPA' },
            { code: 'CMN210', name: 'Marketing and Sales for IT', credits: 2, category: 'GPA' },
            { code: 'CMN211', name: 'Human Resource Management', credits: 3, category: 'GPA' }
          ]
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
  'E (30-34)': { gp: 0.7, range: '30-34' },
  'E (0-29)':  { gp: 0.0, range: '0-29' }
};
