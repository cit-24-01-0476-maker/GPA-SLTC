import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRICULUM_DATABASE } from '../data/curriculum';

const GpaContext = createContext();

export function GpaProvider({ children }) {
  // Ultra-defensive selectedDegree loader with key verification
  const [selectedDegree, setSelectedDegree] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_degree");
      return (saved && CURRICULUM_DATABASE[saved]) ? saved : "software-engineering";
    } catch (e) {
      return "software-engineering";
    }
  });

  // Track which semesters are actively added and open on the screen
  // Format: [ { year: 1, semester: 1 }, { year: 1, semester: 2 } ]
  const [openSemesters, setOpenSemesters] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_open_semesters");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return [{ year: 1, semester: 1 }];
    } catch (e) {
      return [{ year: 1, semester: 1 }];
    }
  });

  // Track grade values: { [degree]: { [year]: { [semester]: { [courseCode-courseName]: grade } } } }
  const [grades, setGrades] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_grades_v2");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Track active electives added by user: { [degree]: { [year]: { [semester]: [ courseObj ] } } }
  const [addedElectives, setAddedElectives] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_added_electives");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Active accent color theme: 'gold' (SLTC Gold), 'neon' (Cyber Neon), 'blue' (Deep Blue)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("sltc_gpa_theme") || "gold";
    } catch (e) {
      return "gold";
    }
  });

  // Active brightness mode: false (Dark Mode - default), true (Light Mode)
  const [isLightMode, setIsLightMode] = useState(() => {
    try {
      return localStorage.getItem("sltc_gpa_light_mode") === "true";
    } catch (e) {
      return false;
    }
  });

  // Sync states to local storage safely
  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_degree", selectedDegree);
    } catch (e) {
      console.error(e);
    }
  }, [selectedDegree]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_open_semesters", JSON.stringify(openSemesters));
    } catch (e) {
      console.error(e);
    }
  }, [openSemesters]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_grades_v2", JSON.stringify(grades));
    } catch (e) {
      console.error(e);
    }
  }, [grades]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_added_electives", JSON.stringify(addedElectives));
    } catch (e) {
      console.error(e);
    }
  }, [addedElectives]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_theme", theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_light_mode", isLightMode);
    } catch (e) {
      console.error(e);
    }
  }, [isLightMode]);

  // Handle degree changes, clear semesters in viewport that are invalid
  const handleDegreeChange = (degreeId) => {
    const verifiedDegree = CURRICULUM_DATABASE[degreeId] ? degreeId : "software-engineering";
    setSelectedDegree(verifiedDegree);
    
    // Validate currently open semesters against the new degree's structural limits
    const degreeData = CURRICULUM_DATABASE[verifiedDegree];
    if (degreeData) {
      const validSemesters = [];
      openSemesters.forEach(sem => {
        if (degreeData.years[sem.year]?.[sem.semester]) {
          validSemesters.push(sem);
        }
      });
      // If none are valid, open Year 1 Semester 1 by default
      if (validSemesters.length === 0) {
        setOpenSemesters([{ year: 1, semester: 1 }]);
      } else {
        setOpenSemesters(validSemesters);
      }
    }
  };

  // Add a semester card to the workspace
  const addSemesterCard = (year, semester) => {
    // Avoid duplicate cards
    const exists = openSemesters.some(s => s.year === year && s.semester === semester);
    if (!exists) {
      setOpenSemesters(prev => [...prev, { year, semester }].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.semester - b.semester;
      }));
    }
  };

  // Remove a semester card from the workspace
  const removeSemesterCard = (year, semester) => {
    setOpenSemesters(prev => {
      const updated = prev.filter(s => !(s.year === year && s.semester === semester));
      return updated.length > 0 ? updated : [{ year: 1, semester: 1 }]; // Keep at least one card
    });
  };

  // Set individual course grade
  const setCourseGrade = (year, semester, courseCode, courseName, gradeValue) => {
    const key = `${courseCode}-${courseName}`;
    setGrades(prev => {
      const updated = { ...prev };
      if (!updated[selectedDegree]) updated[selectedDegree] = {};
      if (!updated[selectedDegree][year]) updated[selectedDegree][year] = {};
      if (!updated[selectedDegree][year][semester]) updated[selectedDegree][year][semester] = {};
      
      updated[selectedDegree][year][semester][key] = gradeValue;
      return updated;
    });
  };

  // Resolve current active modules for a semester, combining preloaded Core with added Electives
  const getSemesterModules = (year, semester) => {
    const degreeData = CURRICULUM_DATABASE[selectedDegree] || CURRICULUM_DATABASE["software-engineering"];
    if (!degreeData) return [];

    const semesterData = degreeData.years[year]?.[semester];
    if (!semesterData) return [];

    const cores = semesterData.core || [];
    const electives = addedElectives[selectedDegree]?.[year]?.[semester] || [];

    return [...cores, ...electives];
  };

  // Add elective to semester pool
  const addElective = (year, semester, electiveModule) => {
    setAddedElectives(prev => {
      const updated = { ...prev };
      if (!updated[selectedDegree]) updated[selectedDegree] = {};
      if (!updated[selectedDegree][year]) updated[selectedDegree][year] = {};
      if (!updated[selectedDegree][year][semester]) updated[selectedDegree][year][semester] = [];
      
      // Prevent duplicate electives in the same semester card
      const exists = updated[selectedDegree][year][semester].some(m => m.code === electiveModule.code);
      if (!exists) {
        updated[selectedDegree][year][semester] = [
          ...updated[selectedDegree][year][semester], 
          { ...electiveModule, isElective: true }
        ];
      }
      return updated;
    });
  };

  // Remove elective from semester pool
  const removeElective = (year, semester, courseCode) => {
    setAddedElectives(prev => {
      const updated = { ...prev };
      if (updated[selectedDegree]?.[year]?.[semester]) {
        // Also remove its grade
        const course = updated[selectedDegree][year][semester].find(c => c.code === courseCode);
        if (course) {
          const key = `${course.code}-${course.name}`;
          setGrades(gPrev => {
            const gUpdated = { ...gPrev };
            if (gUpdated[selectedDegree]?.[year]?.[semester]) {
              delete gUpdated[selectedDegree][year][semester][key];
            }
            return gUpdated;
          });
        }

        updated[selectedDegree][year][semester] = updated[selectedDegree][year][semester].filter(m => m.code !== courseCode);
      }
      return updated;
    });
  };

  // Reset a specific semester card's grades and electives
  const resetSemester = (year, semester) => {
    // Clear grades
    setGrades(prev => {
      const updated = { ...prev };
      if (updated[selectedDegree]?.[year]?.[semester]) {
        updated[selectedDegree][year][semester] = {};
      }
      return updated;
    });

    // Clear electives
    setAddedElectives(prev => {
      const updated = { ...prev };
      if (updated[selectedDegree]?.[year]?.[semester]) {
        updated[selectedDegree][year][semester] = [];
      }
      return updated;
    });
  };

  // Clear entire application cache
  const clearAllCache = () => {
    try {
      localStorage.removeItem("sltc_gpa_degree");
      localStorage.removeItem("sltc_gpa_grades_v2");
      localStorage.removeItem("sltc_gpa_added_electives");
      localStorage.removeItem("sltc_gpa_open_semesters");
      localStorage.removeItem("sltc_gpa_theme");
      localStorage.removeItem("sltc_gpa_light_mode");
    } catch (e) {
      console.error(e);
    }
    setGrades({});
    setAddedElectives({});
    setOpenSemesters([{ year: 1, semester: 1 }]);
    setSelectedDegree("software-engineering");
    setTheme("gold");
    setIsLightMode(false);
  };

  return (
    <GpaContext.Provider value={{
      selectedDegree,
      handleDegreeChange,
      openSemesters,
      addSemesterCard,
      removeSemesterCard,
      grades,
      setCourseGrade,
      addedElectives,
      addElective,
      removeElective,
      getSemesterModules,
      resetSemester,
      clearAllCache,
      theme,
      setTheme,
      isLightMode,
      setIsLightMode
    }}>
      {children}
    </GpaContext.Provider>
  );
}

export function useGpa() {
  const context = useContext(GpaContext);
  if (!context) {
    throw new Error("useGpa must be used within a GpaProvider");
  }
  return context;
}
