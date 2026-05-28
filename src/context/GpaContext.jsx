import { createContext, useContext, useState, useEffect } from 'react';
import { CURRICULUM_DATABASE } from '../data/curriculum';

const GpaContext = createContext();

export function GpaProvider({ children }) {
  // Centralized selectedDegree with Cyber Security default
  const [selectedDegree, setSelectedDegree] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_degree_v3");
      return (saved && saved !== "software-engineering" && CURRICULUM_DATABASE[saved]) ? saved : "cyber-security";
    } catch (e) {
      console.error("Error loading saved degree:", e);
      return "cyber-security";
    }
  });

  // Track which semesters are actively added and open on the screen
  // For dynamic semester cards appending, default to Year 1 Semester 1 on fresh mount
  const [openSemesters, setOpenSemesters] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_open_semesters_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (e) {
      console.error("Error loading open semesters:", e);
      return [];
    }
  });

  // Track grade values: { [degree]: { [year]: { [semester]: { [courseCode-courseName]: grade } } } }
  const [grades, setGrades] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_grades_v3");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error loading grades:", e);
      return {};
    }
  });

  // Track active electives added by user: { [degree]: { [year]: { [semester]: [ courseObj ] } } }
  const [addedElectives, setAddedElectives] = useState(() => {
    try {
      const saved = localStorage.getItem("sltc_gpa_added_electives_v3");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Error loading electives:", e);
      return {};
    }
  });

  // Active accent color theme: 'gold' (SLTC Gold), 'neon' (Cyber Neon), 'blue' (Deep Blue)
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("sltc_gpa_theme_v3") || "gold";
    } catch (e) {
      console.error("Error loading theme:", e);
      return "gold";
    }
  });

  // Active brightness mode: false (Dark Mode), true (Light Mode)
  const [isLightMode, setIsLightMode] = useState(() => {
    try {
      return localStorage.getItem("sltc_gpa_light_mode_v3") === "true";
    } catch (e) {
      console.error("Error loading light mode:", e);
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

  // Handle degree changes, default to an empty workspace layout as requested
  const handleDegreeChange = (degreeId) => {
    const verifiedDegree = CURRICULUM_DATABASE[degreeId] ? degreeId : "cyber-security";
    setSelectedDegree(verifiedDegree);
    setOpenSemesters([]);
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
      return prev.filter(s => !(s.year === year && s.semester === semester));
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

  // Reset viewport to default empty workspace
  const resetToAll8Semesters = () => {
    setOpenSemesters([]);
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
    setOpenSemesters([]);
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

// eslint-disable-next-line react-refresh/only-export-components
export function useGpa() {
  const context = useContext(GpaContext);
  if (!context) {
    throw new Error("useGpa must be used within a GpaProvider");
  }
  return context;
}
