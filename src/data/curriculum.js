/**
 * SLTC GPA Calculator - Preloaded Curriculum Database
 * 
 * To add a new degree:
 * 1. Add its key inside the `CURRICULUM_DATABASE` object.
 * 2. Specify `name` and the `years` mapping.
 * 
 * To add Year 3 and Year 4 modules later:
 * - Inside a degree's `years` object, simply add `3` and `4` as keys, mapping to semester objects:
 *   e.g.,
 *   3: {
 *     1: [ { code: 'CCS3300', name: 'Advanced Engineering', credits: 3, category: 'GPA' } ],
 *     2: [ ... ]
 *   }
 */

export const CURRICULUM_DATABASE = {
  "software-engineering": {
    name: "Software Engineering",
    years: {
      1: {
        1: [
          { code: 'CCS1300', name: 'Programming Concepts', credits: 3, category: 'GPA' },
          { code: 'CCS1301', name: 'Computer Systems', credits: 3, category: 'GPA' },
          { code: 'CCS1302', name: 'Internet Technologies', credits: 3, category: 'GPA' },
          { code: 'CCS1311', name: 'Mathematics for Computing', credits: 4, category: 'GPA' },
          { code: 'SMA0302', name: 'Introductory Calculus', credits: 3, category: 'GPA' }
        ],
        2: [
          { code: 'CCS1303', name: 'Object Oriented Programming', credits: 3, category: 'GPA' },
          { code: 'CCS1304', name: 'Data Technologies', credits: 3, category: 'GPA' },
          { code: 'CCS1307', name: 'Entrepreneurship & Start-up Culture', credits: 3, category: 'GPA' },
          { code: 'CCS1310', name: 'Professional Practice', credits: 3, category: 'GPA' },
          { code: 'CCS2301', name: 'Business Analysis and Software Design', credits: 3, category: 'GPA' }
        ]
      },
      2: {
        1: [
          { code: 'CCS1305', name: 'Communication Protocols and Models', credits: 3, category: 'GPA' },
          { code: 'CCS2300', name: 'Data Structures and Algorithms', credits: 3, category: 'GPA' },
          { code: 'CCS2300', name: 'Operating Systems and Platforms', credits: 3, category: 'GPA' },
          { code: 'CCS2310', name: 'Programming with Vectors and Matrices', credits: 3, category: 'GPA' },
          { code: 'CSD2301', name: 'Effective Communication', credits: 3, category: 'GPA' }
        ],
        2: [
          { code: 'CCS1306', name: 'Information Security', credits: 3, category: 'GPA' },
          { code: 'CCS2302', name: 'Cloud Computing Fundamentals', credits: 3, category: 'GPA' },
          { code: 'CCS2311', name: 'Human Factors in Computer Systems', credits: 3, category: 'GPA' },
          { code: 'CCS2313', name: 'Project Management', credits: 3, category: 'GPA' },
          { code: 'SMA2306', name: 'Probability & Statistics', credits: 3, category: 'GPA' }
        ]
      }
    }
  },
  "cloud-computing": {
    name: "Cloud Computing",
    years: {
      1: {
        1: [
          { code: 'CCS1300', name: 'Programming Concepts', credits: 3, category: 'GPA' },
          { code: 'CCS1301', name: 'Computer Systems', credits: 3, category: 'GPA' },
          { code: 'CCS1302', name: 'Internet Technologies', credits: 3, category: 'GPA' },
          { code: 'CCS1311', name: 'Mathematics for Computing', credits: 4, category: 'GPA' },
          { code: 'SMA0302', name: 'Introductory Calculus', credits: 3, category: 'GPA' }
        ],
        2: [
          { code: 'CCS1303', name: 'Object Oriented Programming', credits: 3, category: 'GPA' },
          { code: 'CCS1304', name: 'Data Technologies', credits: 3, category: 'GPA' },
          { code: 'CCS1307', name: 'Entrepreneurship & Start-up Culture', credits: 3, category: 'GPA' },
          { code: 'CCS1310', name: 'Professional Practice', credits: 3, category: 'GPA' },
          { code: 'CCS2301', name: 'Business Analysis and Software Design', credits: 3, category: 'GPA' }
        ]
      },
      2: {
        1: [
          { code: 'CCS1305', name: 'Communication Protocols and Models', credits: 3, category: 'GPA' },
          { code: 'CCS2300', name: 'Data Structures and Algorithms', credits: 3, category: 'GPA' },
          { code: 'CCS2300', name: 'Operating Systems and Platforms', credits: 3, category: 'GPA' },
          { code: 'CCS2310', name: 'Programming with Vectors and Matrices', credits: 3, category: 'GPA' },
          { code: 'CSD2301', name: 'Effective Communication', credits: 3, category: 'GPA' }
        ],
        2: [
          { code: 'CCS1306', name: 'Information Security', credits: 3, category: 'GPA' },
          { code: 'CCS2302', name: 'Cloud Computing Fundamentals', credits: 3, category: 'GPA' },
          { code: 'CCS2311', name: 'Human Factors in Computer Systems', credits: 3, category: 'GPA' },
          { code: 'CCS2313', name: 'Project Management', credits: 3, category: 'GPA' },
          { code: 'SMA2306', name: 'Probability & Statistics', credits: 3, category: 'GPA' }
        ]
      }
    }
  },
  "cyber-security": {
    name: "Cyber Security",
    years: {
      1: {
        1: [
          { code: 'CCS1300', name: 'Programming Concepts', credits: 3, category: 'GPA' },
          { code: 'CCS1301', name: 'Computer Systems', credits: 3, category: 'GPA' },
          { code: 'CCS1302', name: 'Internet Technologies', credits: 3, category: 'GPA' },
          { code: 'CCS1311', name: 'Mathematics for Computing', credits: 4, category: 'GPA' },
          { code: 'SMA0302', name: 'Introductory Calculus', credits: 3, category: 'GPA' }
        ],
        2: [
          { code: 'CCS1303', name: 'Object Oriented Programming', credits: 3, category: 'GPA' },
          { code: 'CCS1304', name: 'Data Technologies', credits: 3, category: 'GPA' },
          { code: 'CCS1307', name: 'Entrepreneurship & Start-up Culture', credits: 3, category: 'GPA' },
          { code: 'CCS1310', name: 'Professional Practice', credits: 3, category: 'GPA' },
          { code: 'CCS2301', name: 'Business Analysis and Software Design', credits: 3, category: 'GPA' }
        ]
      },
      2: {
        1: [
          { code: 'CCS1305', name: 'Communication Protocols and Models', credits: 3, category: 'GPA' },
          { code: 'CCS2300', name: 'Data Structures and Algorithms', credits: 3, category: 'GPA' },
          { code: 'CCS2300', name: 'Operating Systems and Platforms', credits: 3, category: 'GPA' },
          { code: 'CCS2310', name: 'Programming with Vectors and Matrices', credits: 3, category: 'GPA' },
          { code: 'CSD2301', name: 'Effective Communication', credits: 3, category: 'GPA' }
        ],
        2: [
          { code: 'CCS1306', name: 'Information Security', credits: 3, category: 'GPA' },
          { code: 'CCS2302', name: 'Cloud Computing Fundamentals', credits: 3, category: 'GPA' },
          { code: 'CCS2311', name: 'Human Factors in Computer Systems', credits: 3, category: 'GPA' },
          { code: 'CCS2313', name: 'Project Management', credits: 3, category: 'GPA' },
          { code: 'SMA2306', name: 'Probability & Statistics', credits: 3, category: 'GPA' }
        ]
      }
    }
  },
  "data-science": {
    name: "Data Science",
    years: {
      1: {
        1: [
          { code: 'CCS1300', name: 'Programming Concepts', credits: 3, category: 'GPA' },
          { code: 'CCS1301', name: 'Computer Systems', credits: 3, category: 'GPA' },
          { code: 'CCS1302', name: 'Internet Technologies', credits: 3, category: 'GPA' },
          { code: 'CCS1311', name: 'Mathematics for Computing', credits: 4, category: 'GPA' },
          { code: 'SMA0302', name: 'Introductory Calculus', credits: 3, category: 'GPA' }
        ],
        2: [
          { code: 'CCS1303', name: 'Object Oriented Programming', credits: 3, category: 'GPA' },
          { code: 'CCS1304', name: 'Data Technologies', credits: 3, category: 'GPA' },
          { code: 'CCS1307', name: 'Entrepreneurship & Start-up Culture', credits: 3, category: 'GPA' },
          { code: 'CCS1310', name: 'Professional Practice', credits: 3, category: 'GPA' },
          { code: 'CCS2301', name: 'Business Analysis and Software Design', credits: 3, category: 'GPA' }
        ]
      },
      2: {
        1: [
          { code: 'CCS1305', name: 'Communication Protocols and Models', credits: 3, category: 'GPA' },
          { code: 'CCS2300', name: 'Data Structures and Algorithms', credits: 3, category: 'GPA' },
          { code: 'CCS2300', name: 'Operating Systems and Platforms', credits: 3, category: 'GPA' },
          { code: 'CCS2310', name: 'Programming with Vectors and Matrices', credits: 3, category: 'GPA' },
          { code: 'CSD2301', name: 'Effective Communication', credits: 3, category: 'GPA' }
        ],
        2: [
          { code: 'CCS1306', name: 'Information Security', credits: 3, category: 'GPA' },
          { code: 'CCS2302', name: 'Cloud Computing Fundamentals', credits: 3, category: 'GPA' },
          { code: 'CCS2311', name: 'Human Factors in Computer Systems', credits: 3, category: 'GPA' },
          { code: 'CCS2313', name: 'Project Management', credits: 3, category: 'GPA' },
          { code: 'SMA2306', name: 'Probability & Statistics', credits: 3, category: 'GPA' }
        ]
      }
    }
  },
  "applied-it": {
    name: "Applied IT",
    years: {
      1: {
        1: [
          { code: 'CIT100', name: 'Essentials of IT', credits: 3, category: 'GPA' },
          { code: 'CIT101', name: 'Fundamentals of Programming', credits: 3, category: 'GPA' },
          { code: 'CIT102', name: 'Digital Fundamentals', credits: 2, category: 'GPA' },
          { code: 'CIT103', name: 'Fundamentals of Networking', credits: 3, category: 'GPA' },
          { code: 'CMA100', name: 'Basics of Probability', credits: 2, category: 'GPA' },
          { code: 'CEN100', name: 'Oral and Written Communication', credits: 3, category: 'GPA' }
        ]
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
