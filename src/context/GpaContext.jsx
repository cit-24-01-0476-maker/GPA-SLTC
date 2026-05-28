import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRICULUM_DATABASE } from '../data/curriculum';

const GpaContext = createContext();

export const getSemestersForDegree = (degreeId) => {
  const degreeData = CURRICULUM_DATABASE[degreeId];
  const duration = degreeData?.durationYears || 4;
  const list = [];
  for (let y = 1; y <= duration; y++) {
    list.push({ year: y, semester: 1 });
    list.push({ year: y, semester: 2 });
  }
  return list;
};

export function GpaProvider({ children }) {
  // Centralized selectedDegree with Cyber Security default
  const [selectedDegree, setSelectedDegree] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_degree_v3");
      return (saved && CURRICULUM_DATABASE[saved]) ? saved : "cyber-security";
    } catch (e) {
      return "cyber-security";
    }
  });

  // Track which semesters are actively added and open on the screen
  const [openSemesters, setOpenSemesters] = useState(() => {
    try {
      const savedDegree = localStorage.getItem("sltc_gpa_degree_v3") || "cyber-security";
      const verifiedDegree = CURRICULUM_DATABASE[savedDegree] ? savedDegree : "cyber-security";
      const saved = localStorage.getItem("sltc_gpa_open_semesters_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return getSemestersForDegree(verifiedDegree);
    } catch (e) {
      return getSemestersForDegree("cyber-security");
    }
  });

  // Track grade values: { [degree]: { [year]: { [semester]: { [courseCode-courseName]: grade } } } }
  const [grades, setGrades] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_grades_v3");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Track active electives added by user: { [degree]: { [year]: { [semester]: [ courseObj ] } } }
  const [addedElectives, setAddedElectives] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_added_electives_v3");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Active accent color theme: 'gold' (SLTC Gold), 'neon' (Cyber Neon), 'blue' (Deep Blue)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("sltc_gpa_theme_v3") || "gold";
    } catch (e) {
      return "gold";
    }
  });

  // Active brightness mode: false (Dark Mode), true (Light Mode)
  const [isLightMode, setIsLightMode] = useState(() => {
    try {
      return localStorage.getItem("sltc_gpa_light_mode_v3") === "true";
    } catch (e) {
      return false;
    }
  });

  // Sync states to local storage safely
  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_degree_v3", selectedDegree);
    } catch (e) {
      console.error(e);
    }
  }, [selectedDegree]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_open_semesters_v3", JSON.stringify(openSemesters));
    } catch (e) {
      console.error(e);
    }
  }, [openSemesters]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_grades_v3", JSON.stringify(grades));
    } catch (e) {
      console.error(e);
    }
  }, [grades]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_added_electives_v3", JSON.stringify(addedElectives));
    } catch (e) {
      console.error(e);
    }
  }, [addedElectives]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_theme_v3", theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem("sltc_gpa_light_mode_v3", isLightMode);
    } catch (e) {
      console.error(e);
    }
  }, [isLightMode]);

  // Handle degree changes, automatically loading all semesters corresponding to that degree's duration
  const handleDegreeChange = (degreeId) => {
    const verifiedDegree = CURRICULUM_DATABASE[degreeId] ? degreeId : "cyber-security";
    setSelectedDegree(verifiedDegree);
    const defaultSems = getSemestersForDegree(verifiedDegree);
    setOpenSemesters(defaultSems);
  };

  // Add a semester card to the workspace
  const addSemesterCard = (year, semester) => {
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
      return updated.length > 0 ? updated : getSemestersForDegree(selectedDegree);
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
    const degreeData = CURRICULUM_DATABASE[selectedDegree] || CURRICULUM_DATABASE["cyber-security"];
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
    setGrades(prev => {
      const updated = { ...prev };
      if (updated[selectedDegree]?.[year]?.[semester]) {
        updated[selectedDegree][year][semester] = {};
      }
      return updated;
    });

    setAddedElectives(prev => {
      const updated = { ...prev };
      if (updated[selectedDegree]?.[year]?.[semester]) {
        updated[selectedDegree][year][semester] = [];
      }
      return updated;
    });
  };

  // Reset viewport to default semesters for selected degree
  const resetToAll8Semesters = () => {
    setOpenSemesters(getSemestersForDegree(selectedDegree));
  };

  // Clear entire application cache
  const clearAllCache = () => {
    try {
      localStorage.removeItem("sltc_gpa_degree_v3");
      localStorage.removeItem("sltc_gpa_grades_v3");
      localStorage.removeItem("sltc_gpa_added_electives_v3");
      localStorage.removeItem("sltc_gpa_open_semesters_v3");
      localStorage.removeItem("sltc_gpa_theme_v3");
      localStorage.removeItem("sltc_gpa_light_mode_v3");
    } catch (e) {
      console.error(e);
    }
    setGrades({});
    setAddedElectives({});
    setSelectedDegree("cyber-security");
    setOpenSemesters(getSemestersForDegree("cyber-security"));
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
      resetToAll8Semesters,
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
