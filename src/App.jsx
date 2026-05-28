import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  BookOpen, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Calculator, 
  Info, 
  TrendingUp, 
  Sparkles, 
  Download, 
  Code2, 
  Cloud, 
  Shield, 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  X, 
  Search,
  Palette,
  RotateCcw,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  Lock
} from 'lucide-react';
import { useGpa } from './context/GpaContext';
import { CURRICULUM_DATABASE, GRADING_SYSTEM, ELECTIVES_POOL } from './data/curriculum';

// --- ROLLING COUNT COMPONENT ---
// Uses requestAnimationFrame for a premium GPU-accelerated numerical counter transition
function RollingCount({ value }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = parseFloat(value) || 0;
    if (start === end) return;

    const duration = 1000; // Duration of animation in ms
    const range = end - start;
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const progressPercentage = Math.min(progress / duration, 1);
      
      // Easing out quadratic
      const easeOutQuad = 1 - (1 - progressPercentage) * (1 - progressPercentage);
      const current = start + range * easeOutQuad;
      
      setDisplayValue(current);

      if (progressPercentage < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toFixed(2)}</span>;
}

export default function App() {
  const {
    selectedDegree,
    handleDegreeChange,
    openSemesters,
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
  } = useGpa();

  // Local state for Faculty Selection (Critical Premium Feature)
  const [selectedFaculty, setSelectedFaculty] = useState("computing");

  // Workspace Filters (dynamic isolation)
  const [selectedYearFilter, setSelectedYearFilter] = useState("all");
  const [selectedSemFilter, setSelectedSemFilter] = useState("all");

  // Local state for modals & user parameters
  const [activeElectiveSemester, setActiveElectiveSemester] = useState(null); // { year, semester }
  const [electiveSearch, setElectiveSearch] = useState("");
  const [targetCgpa, setTargetCgpa] = useState("3.50");
  const [showClearToast, setShowClearToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Manage accordion collapsible state for all semesters: { '1-1': true/false }
  const [expandedSemesters, setExpandedSemesters] = useState({
    '1-1': true, '1-2': true,
    '2-1': true, '2-2': true,
    '3-1': true, '3-2': true,
    '4-1': true, '4-2': true
  });

  const toggleSemesterAccordion = (year, semester) => {
    const key = `${year}-${semester}`;
    setExpandedSemesters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const expandAllSemesters = () => {
    const list = {};
    openSemesters.forEach(sem => {
      list[`${sem.year}-${sem.semester}`] = true;
    });
    setExpandedSemesters(list);
    triggerToast("All semesters expanded.");
  };

  const collapseAllSemesters = () => {
    const list = {};
    openSemesters.forEach(sem => {
      list[`${sem.year}-${sem.semester}`] = false;
    });
    setExpandedSemesters(list);
    triggerToast("All semesters collapsed.");
  };

  // Sync the context theme selection with document-level data attributes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    document.documentElement.setAttribute('data-light', isLightMode);
    document.body.setAttribute('data-light', isLightMode);
  }, [theme, isLightMode]);

  // Handle fallback or filter bounds adjustments if degree changes
  useEffect(() => {
    if (selectedDegree === "software-engineering") {
      handleDegreeChange("cyber-security");
    }
    
    // Reset filters if they are out of bounds of the new degree duration
    const maxYears = CURRICULUM_DATABASE[selectedDegree]?.durationYears || 4;
    if (selectedYearFilter !== "all" && parseInt(selectedYearFilter) > maxYears) {
      setSelectedYearFilter("all");
    }
  }, [selectedDegree, selectedYearFilter, handleDegreeChange]);

  const activeDegreeData = CURRICULUM_DATABASE[selectedDegree] || CURRICULUM_DATABASE["cyber-security"];

  // Filter open semesters based on the year & semester filter selections
  const filteredSemesters = openSemesters.filter(sem => {
    const matchesYear = selectedYearFilter === "all" || sem.year === parseInt(selectedYearFilter);
    const matchesSem = selectedSemFilter === "all" || sem.semester === parseInt(selectedSemFilter);
    return matchesYear && matchesSem;
  });

  // --- ICON RESOLVER FOR DEGREES ---
  const getDegreeIcon = (id) => {
    switch (id) {
      case 'software-engineering': return <Code2 className="w-5 h-5 text-accent" />;
      case 'cyber-security': return <Shield className="w-5 h-5 text-accent" />;
      case 'cloud-computing': return <Cloud className="w-5 h-5 text-accent" />;
      case 'data-science': return <Database className="w-5 h-5 text-accent" />;
      case 'applied-it': return <Cpu className="w-5 h-5 text-accent" />;
      default: return <GraduationCap className="w-5 h-5 text-accent" />;
    }
  };

  // Trigger notification toast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowClearToast(true);
    setTimeout(() => setShowClearToast(false), 3000);
  };

  // --- CALCULATIONS FOR SINGLE SEMESTER ---
  const getSemesterCalculations = (year, semester) => {
    const modules = getSemesterModules(year, semester);
    let totalPoints = 0;
    let totalCredits = 0;
    let completedCount = 0;
    let gpaModulesCount = 0;

    modules.forEach(mod => {
      if (mod.category === 'GPA') {
        gpaModulesCount++;
        const gradeKey = `${mod.code}-${mod.name}`;
        const selectedGrade = grades[selectedDegree]?.[year]?.[semester]?.[gradeKey] || "";
        
        if (selectedGrade && GRADING_SYSTEM[selectedGrade]) {
          totalPoints += GRADING_SYSTEM[selectedGrade].gp * mod.credits;
          totalCredits += mod.credits;
          completedCount++;
        }
      }
    });

    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

    return {
      sgpa: parseFloat(sgpa.toFixed(2)),
      totalCredits,
      totalPoints: parseFloat(totalPoints.toFixed(2)),
      completedCount,
      gpaModulesCount,
      isFullyCompleted: completedCount === gpaModulesCount && gpaModulesCount > 0
    };
  };

  // --- GLOBAL (FINAL) GPA CALCULATIONS ---
  // Calculates points across all open semesters in the workspace, strictly ignoring NGPA courses
  const getGlobalCalculations = () => {
    let grandPoints = 0;
    let grandCredits = 0;
    let completedCoursesCount = 0;
    let totalGpaCoursesCount = 0;

    openSemesters.forEach(sem => {
      const modules = getSemesterModules(sem.year, sem.semester);
      modules.forEach(mod => {
        if (mod.category === 'GPA') {
          totalGpaCoursesCount++;
          const gradeKey = `${mod.code}-${mod.name}`;
          const selectedGrade = grades[selectedDegree]?.[sem.year]?.[sem.semester]?.[gradeKey] || "";
          
          if (selectedGrade && GRADING_SYSTEM[selectedGrade]) {
            grandPoints += GRADING_SYSTEM[selectedGrade].gp * mod.credits;
            grandCredits += mod.credits;
            completedCoursesCount++;
          }
        }
      });
    });

    const fgpa = grandCredits > 0 ? (grandPoints / grandCredits) : 0;

    return {
      fgpa: parseFloat(fgpa.toFixed(2)),
      totalCredits: grandCredits,
      totalPoints: parseFloat(grandPoints.toFixed(2)),
      completedCount: completedCoursesCount,
      totalCount: totalGpaCoursesCount
    };
  };

  const globalCalculations = getGlobalCalculations();

  // --- YEARLY GPA CALCULATIONS (YGPA) ---
  // Calculates combined GPA for Semester 1 & 2 of a specific year, ignoring NGPA
  const getYearlyGpa = (year) => {
    let yearPoints = 0;
    let yearCredits = 0;

    // Filter semesters open for this year (usually Semester 1 and Semester 2)
    const openSemsThisYear = openSemesters.filter(s => s.year === year);
    
    openSemsThisYear.forEach(sem => {
      const modules = getSemesterModules(sem.year, sem.semester);
      modules.forEach(mod => {
        if (mod.category === 'GPA') {
          const gradeKey = `${mod.code}-${mod.name}`;
          const selectedGrade = grades[selectedDegree]?.[sem.year]?.[sem.semester]?.[gradeKey] || "";
          
          if (selectedGrade && GRADING_SYSTEM[selectedGrade]) {
            yearPoints += GRADING_SYSTEM[selectedGrade].gp * mod.credits;
            yearCredits += mod.credits;
          }
        }
      });
    });

    const ygpa = yearCredits > 0 ? (yearPoints / yearCredits) : 0;
    return {
      ygpa: parseFloat(ygpa.toFixed(2)),
      credits: yearCredits
    };
  };

  // --- GLOBAL WHAT-IF CGPA PLANNER ---
  const calculateGlobalWhatIf = () => {
    const target = parseFloat(targetCgpa);
    if (isNaN(target) || target < 0 || target > 4.0) {
      return { error: "Enter target GPA between 0.00 and 4.00" };
    }

    let completedPoints = 0;
    let completedCredits = 0;
    let remainingCredits = 0;

    // Aggregate open semesters
    openSemesters.forEach(sem => {
      const modules = getSemesterModules(sem.year, sem.semester);
      modules.forEach(mod => {
        if (mod.category === 'GPA') {
          const gradeKey = `${mod.code}-${mod.name}`;
          const selectedGrade = grades[selectedDegree]?.[sem.year]?.[sem.semester]?.[gradeKey] || "";
          
          if (selectedGrade && GRADING_SYSTEM[selectedGrade]) {
            completedPoints += GRADING_SYSTEM[selectedGrade].gp * mod.credits;
            completedCredits += mod.credits;
          } else {
            remainingCredits += mod.credits;
          }
        }
      });
    });

    const totalWorkspaceCredits = completedCredits + remainingCredits;
    if (totalWorkspaceCredits === 0) {
      return { message: "No active GPA courses on the board." };
    }

    const requiredGrandPoints = target * totalWorkspaceCredits;
    const requiredPointsFromRemaining = requiredGrandPoints - completedPoints;

    if (remainingCredits === 0) {
      const currentCgpa = completedCredits > 0 ? (completedPoints / completedCredits) : 0;
      if (currentCgpa >= target) {
        return { success: true, message: `Target Achieved! Current CGPA is ${currentCgpa.toFixed(2)}.` };
      } else {
        return { success: false, message: `All open courses are graded. Current CGPA ${currentCgpa.toFixed(2)} is below target ${target.toFixed(2)}.` };
      }
    }

    const requiredAverageGp = requiredPointsFromRemaining / remainingCredits;

    if (requiredAverageGp > 4.0) {
      return { 
        impossible: true, 
        message: `Mathematically impossible. You would need an average GP of ${requiredAverageGp.toFixed(2)} across remaining ${remainingCredits} credits, but the limit is 4.00.` 
      };
    } else if (requiredAverageGp <= 0.0) {
      return { 
        success: true, 
        message: `Target secured! You have already earned enough points. You only need an average of 0.00 (E) on remaining credits.` 
      };
    } else {
      // Find the closest letter grade that satisfies the required GP
      let suggestedGrade = 'E';
      let sortedGrades = Object.entries(GRADING_SYSTEM).sort((a, b) => a[1].gp - b[1].gp);
      for (let [gName, gData] of sortedGrades) {
        if (gData.gp >= requiredAverageGp) {
          suggestedGrade = gName;
          break;
        }
      }

      return { 
        planning: true, 
        requiredAverageGp: parseFloat(requiredAverageGp.toFixed(2)),
        suggestedGrade,
        message: `To reach your target ${target.toFixed(2)} CGPA, you must average a ${requiredAverageGp.toFixed(2)} GP (${suggestedGrade}) on the remaining ${remainingCredits} credits.`
      };
    }
  };

  const globalWhatIfStatus = calculateGlobalWhatIf();

  // Print PDF exporter
  const triggerPrint = () => {
    window.print();
  };

  // Reset all local storage cache
  const handleResetCache = () => {
    if (window.confirm("This will erase all course grades, electives, and reset active open semesters. Reset?")) {
      clearAllCache();
      triggerToast("System calculation records and cache reset successfully.");
    }
  };

  // --- ELECTIVE SELECTION ACTIONS ---
  const handleOpenElectiveModal = (year, semester) => {
    setActiveElectiveSemester({ year, semester });
    setElectiveSearch("");
  };

  const handleAddElectiveToSemester = (course) => {
    if (activeElectiveSemester) {
      addElective(activeElectiveSemester.year, activeElectiveSemester.semester, course);
      setActiveElectiveSemester(null);
      triggerToast(`${course.code} Elective added successfully.`);
    }
  };

  // Resolve available electives not already added
  const getFilteredElectives = () => {
    if (!activeElectiveSemester) return [];
    
    const activeDegree = CURRICULUM_DATABASE[selectedDegree] || CURRICULUM_DATABASE["cyber-security"];
    const semElectives = activeDegree?.years[activeElectiveSemester.year]?.[activeElectiveSemester.semester]?.electives;
    
    const pool = semElectives || ELECTIVES_POOL;
    const added = addedElectives[selectedDegree]?.[activeElectiveSemester.year]?.[activeElectiveSemester.semester] || [];
    
    // Filter out electives already added to this semester
    const available = pool.filter(p => !added.some(a => a.code === p.code));

    // Search query filter
    if (electiveSearch.trim() === "") return available;
    return available.filter(item => 
      item.code.toLowerCase().includes(electiveSearch.toLowerCase()) || 
      item.name.toLowerCase().includes(electiveSearch.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden select-none pb-12 transition-accent">
      
      {/* --- AURORA FLOATING BACKDROP ORBS --- */}
      <div className="absolute top-[-15%] left-[-15%] w-[600px] h-[600px] rounded-full accent-glow-bg blur-[130px] pointer-events-none -z-10 animate-aurora-1"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[700px] h-[700px] rounded-full bg-navy-800/20 blur-[150px] pointer-events-none -z-10 animate-aurora-2" style={{ animationDelay: '3s' }}></div>
      <div className="absolute top-[40%] left-[30%] w-[500px] h-[500px] rounded-full bg-navy-900/10 blur-[120px] pointer-events-none -z-10 animate-aurora-3" style={{ animationDelay: '6s' }}></div>

      {/* --- HEADER --- */}
      <header className="w-full max-w-none px-4 sm:px-6 md:px-12 pt-8 pb-4 print:hidden">
        <div className="glass-panel rounded-2xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-white/10 shadow-glass">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-4">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.05 }}
              className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-hover text-navy-950 shadow-accent-glow"
            >
              <GraduationCap className="w-7 h-7" />
              <div className="absolute -inset-0.5 rounded-xl border border-white opacity-40"></div>
            </motion.div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  SLTC<span className="text-accent font-extrabold text-lg sm:text-xl px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-md transition-accent">GPA</span>.CALCULATOR
                </h1>
                <div className="px-2.5 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent font-black uppercase tracking-widest text-[8px] transition-all shadow-accent-glow hover:bg-accent hover:text-navy-950">
                  POWERED BY OSKA.TECH
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Sri Lanka Technology Campus • Academic Workspace v4.0</p>
            </div>
          </div>

          {/* Theme switcher & global utilities */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            
            {/* Color switcher toggler */}
            <div className="glass-panel bg-white/5 rounded-xl p-1 flex items-center gap-1 border-white/5">
              <button 
                onClick={() => setTheme("gold")}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-accent uppercase flex items-center gap-1 ${
                  theme === "gold" ? "bg-accent text-navy-950 shadow-accent-glow font-black" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Gold
              </button>
              <button 
                onClick={() => setTheme("neon")}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-accent uppercase flex items-center gap-1 ${
                  theme === "neon" ? "bg-accent text-navy-950 shadow-accent-glow font-black" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Neon
              </button>
              <button 
                onClick={() => setTheme("blue")}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-accent uppercase flex items-center gap-1 ${
                  theme === "blue" ? "bg-accent text-navy-950 shadow-accent-glow font-black" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Blue
              </button>
            </div>

            {/* Dark/Light Mode Toggler */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsLightMode(!isLightMode)}
              className="px-3 py-2 rounded-xl glass-panel hover:bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5"
              title="Toggle Light / Dark Mode"
            >
              {isLightMode ? <Moon className="w-4 h-4 text-accent" /> : <Sun className="w-4 h-4 text-accent" />}
              <span className="hidden md:inline text-[10px] uppercase font-extrabold tracking-wider">
                {isLightMode ? "Dark Mode" : "Light Mode"}
              </span>
            </motion.button>

            {/* Reset All Cache */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleResetCache}
              className="p-2.5 rounded-xl glass-panel hover:bg-red-500/10 border-white/5 text-slate-400 hover:text-red-400 transition-colors"
              title="Reset All Workspace Data"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>

            {/* Print Report */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={triggerPrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white glass-panel hover:bg-white/5 border-white/5 hover:border-accent/30 transition-accent"
            >
              <Download className="w-4 h-4 text-accent transition-accent" />
              Export PDF
            </motion.button>
          </div>
        </div>
      </header>

      {/* --- DESKTOP VIEWPORT LAYOUT --- */}
      <main className="w-full max-w-none px-4 sm:px-6 md:px-12 mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* --- LEFT SECTION: WORKSPACE CONTROL & EXPANDABLE SEMESTER CARDS PANEL (SPAN 2) --- */}
        <section className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Faculty & Degree Selection Toolbar Card (CRITICAL REQUIREMENT) */}
          <div className="glass-panel rounded-2xl p-6 border-white/10 shadow-glass flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6 print:hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              
              {/* Faculty Selector (Disabled for other faculties, only IT allowed) */}
              <div className="glass-input rounded-xl p-3.5 flex items-center gap-3 border-white/5">
                <Layers className="w-5 h-5 text-accent transition-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-accent transition-accent">Faculty</label>
                  <select 
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                    className="bg-transparent border-0 font-extrabold text-white text-xs sm:text-sm focus:ring-0 focus:outline-none cursor-pointer p-0 w-full"
                  >
                    <option value="computing" className="bg-navy-900 text-white font-semibold">Faculty of Computing and IT</option>
                    <option value="engineering" disabled className="bg-navy-950 text-slate-500 font-semibold cursor-not-allowed">Faculty of Engineering (Locked)</option>
                    <option value="business" disabled className="bg-navy-950 text-slate-500 font-semibold cursor-not-allowed">Faculty of Business (Locked)</option>
                    <option value="science" disabled className="bg-navy-950 text-slate-500 font-semibold cursor-not-allowed">Faculty of Science (Locked)</option>
                  </select>
                </div>
              </div>

              {/* Degree Selector (Software Engineering disabled as requested) */}
              <div className="glass-input rounded-xl p-3.5 flex items-center gap-3 border-white/5">
                {getDegreeIcon(selectedDegree)}
                <div className="flex-1 min-w-0">
                  <label className="block text-[9px] font-black uppercase tracking-widest text-accent transition-accent">Degree Program</label>
                  <select 
                    value={selectedDegree}
                    onChange={(e) => handleDegreeChange(e.target.value)}
                    className="bg-transparent border-0 font-extrabold text-white text-xs sm:text-sm focus:ring-0 focus:outline-none cursor-pointer p-0 w-full"
                  >
                    {Object.entries(CURRICULUM_DATABASE).map(([key, value]) => {
                      const isLocked = key === "software-engineering";
                      return (
                        <option 
                          key={key} 
                          value={key} 
                          disabled={isLocked}
                          className={`bg-navy-900 font-semibold ${isLocked ? 'text-slate-500 cursor-not-allowed' : 'text-white'}`}
                        >
                          {value.name} ({value.durationYears} Years) {isLocked ? "• Locked" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

            </div>

            {/* Expand / Collapse All semester controllers */}
            <div className="flex items-center gap-2 self-center xl:self-auto shrink-0">
              <span className="text-xs font-bold text-slate-400 mr-1">Workspace:</span>
              <button
                onClick={expandAllSemesters}
                className="flex items-center gap-1 py-2 px-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white glass-panel hover:bg-white/5 border-white/5 hover:border-accent/20 transition-all"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllSemesters}
                className="flex items-center gap-1 py-2 px-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white glass-panel hover:bg-white/5 border-white/5 hover:border-accent/20 transition-all"
              >
                Collapse All
              </button>
            </div>
          </div>

          {/* Workspace Year & Semester selectors (Dynamic Filter Controls) */}
          <div className="glass-panel rounded-2xl p-5 border-white/10 shadow-glass flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 print:hidden">
            <div className="flex flex-wrap items-center gap-4">
              
              {/* Year Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-accent transition-accent tracking-wider">Year:</span>
                <div className="glass-panel bg-white/5 rounded-xl p-1 flex items-center gap-1 border-white/5 text-[10px] font-bold">
                  <button 
                    onClick={() => setSelectedYearFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedYearFilter === "all" ? "bg-accent text-navy-950 shadow-accent-glow font-black" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All Years
                  </button>
                  {Array.from({ length: activeDegreeData.durationYears || 4 }, (_, idx) => idx + 1).map(yr => (
                    <button 
                      key={yr}
                      onClick={() => setSelectedYearFilter(yr.toString())}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        selectedYearFilter === yr.toString() ? "bg-accent text-navy-950 shadow-accent-glow font-black" : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Year {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Semester Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-accent transition-accent tracking-wider">Sem:</span>
                <div className="glass-panel bg-white/5 rounded-xl p-1 flex items-center gap-1 border-white/5 text-[10px] font-bold">
                  <button 
                    onClick={() => setSelectedSemFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedSemFilter === "all" ? "bg-accent text-navy-950 shadow-accent-glow font-black" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    All Sems
                  </button>
                  <button 
                    onClick={() => setSelectedSemFilter("1")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedSemFilter === "1" ? "bg-accent text-navy-950 shadow-accent-glow font-black" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Sem 1
                  </button>
                  <button 
                    onClick={() => setSelectedSemFilter("2")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedSemFilter === "2" ? "bg-accent text-navy-950 shadow-accent-glow font-black" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Sem 2
                  </button>
                </div>
              </div>

            </div>

            {/* Indicator of how many semesters are showing */}
            <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse-gold shrink-0"></span>
              Showing {filteredSemesters.length} of {openSemesters.length} Semesters
            </div>
          </div>

          {/* OPEN ACTIVE SEMESTER ACCORDIONS DECK */}
          <div className="flex flex-col gap-5">
            <AnimatePresence mode="popLayout">
              {filteredSemesters.map((sem) => {
                const accordionKey = `${sem.year}-${sem.semester}`;
                const isExpanded = expandedSemesters[accordionKey];
                const stats = getSemesterCalculations(sem.year, sem.semester);
                const modules = getSemesterModules(sem.year, sem.semester);
                
                // Allow electives on Year 3 and Year 4
                const isYear3Or4 = sem.year === 3 || sem.year === 4;

                return (
                  <motion.div
                    key={`${selectedDegree}-${sem.year}-${sem.semester}`}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="glass-panel rounded-2xl p-5 border-white/10 shadow-glass relative overflow-hidden transition-all"
                  >
                    
                    {/* Collapsible Card Header toolbar */}
                    <div 
                      onClick={() => toggleSemesterAccordion(sem.year, sem.semester)}
                      className="flex justify-between items-center cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-accent/10 border border-accent/20 text-accent transition-accent">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white tracking-wide">
                            Year {sem.year} Semester {sem.semester}
                          </h3>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-0.5">
                            Level {sem.year} • {modules.length} Modules Pre-loaded
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Mini pill summary (always shown) */}
                        <div className="hidden sm:flex gap-1.5 text-[10px] font-black uppercase">
                          <span className="glass-panel px-2.5 py-1 rounded border-white/5 text-slate-400">
                            Credits: {stats.totalCredits}
                          </span>
                          <span className="glass-panel px-2.5 py-1 rounded border-white/5 text-accent transition-accent">
                            SGPA: {stats.sgpa.toFixed(2)}
                          </span>
                        </div>

                        {/* Accordion Toggle Icon */}
                        <div className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Animated Collapsible Body Container */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, marginTop: 0 }}
                          animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                          exit={{ height: 0, opacity: 0, marginTop: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                          className="overflow-hidden"
                        >
                          
                          {/* Inner divider */}
                          <div className="w-full border-t border-white/5 pt-4 mb-4"></div>

                          {/* Semester Modules list table */}
                          <div className="overflow-x-auto rounded-xl border border-white/5 mb-4">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="bg-navy-950/60 border-b border-white/5 text-[9px] uppercase tracking-widest font-extrabold text-accent transition-accent">
                                  <th className="py-3 px-4">Code</th>
                                  <th className="py-3 px-4">Module Name</th>
                                  <th className="py-3 px-4 text-center">Credits</th>
                                  <th className="py-3 px-4 text-center">Type</th>
                                  <th className="py-3 px-4 text-center">Grade Achieved</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 text-xs font-semibold">
                                {modules.map((mod) => {
                                  const gradeKey = `${mod.code}-${mod.name}`;
                                  const selectedGrade = grades[selectedDegree]?.[sem.year]?.[sem.semester]?.[gradeKey] || "";
                                  const isNgpa = mod.category === 'NGPA';
                                  
                                  return (
                                    <tr 
                                      key={gradeKey}
                                      className={`transition-colors duration-150 ${
                                        selectedGrade ? 'bg-accent/5 hover:bg-accent/10' : 'hover:bg-white/[0.01]'
                                      }`}
                                    >
                                      <td className="py-3 px-4 font-mono font-bold text-slate-300">
                                        {mod.code}
                                      </td>
                                      <td className="py-3 px-4 text-white font-bold flex items-center justify-between">
                                        <span>{mod.name}</span>
                                        {/* Remove button if added as elective */}
                                        {mod.isElective && (
                                          <button 
                                            onClick={() => removeElective(sem.year, sem.semester, mod.code)}
                                            className="text-red-400 hover:text-red-300 ml-2 font-bold opacity-60 hover:opacity-100 transition-opacity print:hidden"
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </td>
                                      <td className="py-3 px-4 text-center font-extrabold text-slate-300">
                                        {mod.credits}
                                      </td>
                                      <td className="py-3 px-4 text-center">
                                        <span className={`text-[8.5px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${
                                          isNgpa
                                            ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse-light'
                                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                        }`}>
                                          {mod.category}
                                        </span>
                                      </td>
                                      <td className="py-2 px-4">
                                        <div className="flex justify-center">
                                          <select
                                            value={selectedGrade}
                                            onChange={(e) => setCourseGrade(sem.year, sem.semester, mod.code, mod.name, e.target.value)}
                                            className={`w-36 py-1.5 px-2 rounded-lg text-[10px] font-black appearance-none text-center cursor-pointer transition-accent border ${
                                              selectedGrade
                                                ? 'bg-accent text-navy-950 border-accent font-black shadow-sm font-sans'
                                                : 'glass-input text-slate-400 hover:border-white/20'
                                            }`}
                                          >
                                            <option value="" className="bg-navy-900 text-slate-400 font-bold">- Select Grade -</option>
                                            {Object.entries(GRADING_SYSTEM).map(([g, details]) => (
                                              <option key={g} value={g} className="bg-navy-900 text-white font-bold">
                                                {g} (GP: {details.gp.toFixed(1)})
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}

                                {modules.length === 0 && (
                                  <tr>
                                    <td colSpan="5" className="py-8 text-center text-slate-500 italic">
                                      Empty semester. Click "+ Add Course" below to register modules.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>

                          {/* Collapsible Card Footer: Add elective & Semester reset utilities */}
                          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-2">
                            
                            {/* Electives adder for Year 3 and Year 4 */}
                            {isYear3Or4 ? (
                              <motion.button 
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleOpenElectiveModal(sem.year, sem.semester)}
                                className="px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-accent/30 text-accent hover:bg-accent/10 transition-accent flex items-center justify-center gap-1.5 print:hidden"
                              >
                                <Plus className="w-3.5 h-3.5 shrink-0" />
                                Add Course
                              </motion.button>
                            ) : (
                              <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1">
                                <Info className="w-3.5 h-3.5 text-accent/40 transition-accent" />
                                Fixed Core Syllabus
                              </div>
                            )}

                            {/* Reset & Summary info */}
                            <div className="flex items-center gap-3 justify-end font-extrabold text-xs">
                              <button
                                onClick={() => resetSemester(sem.year, sem.semester)}
                                className="flex items-center gap-1 py-1 px-2.5 rounded-lg text-[9px] font-black text-slate-400 hover:text-slate-200 glass-panel border-white/5 print:hidden"
                              >
                                <RefreshCw className="w-3 h-3 text-accent" />
                                Reset Grades
                              </button>
                              <div className="glass-panel px-3 py-1 rounded-lg border-white/5 text-slate-300">
                                Credits: <span className="text-white font-black">{stats.totalCredits}</span>
                              </div>
                              <div className="glass-panel px-3 py-1 rounded-lg border-white/5 text-slate-300">
                                SGPA: <span className="text-accent transition-accent font-black text-sm">{stats.sgpa.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>

                  </motion.div>
                );
              })}

              {filteredSemesters.length === 0 && (
                <div className="glass-panel rounded-2xl p-10 text-center text-slate-400 border-white/10 shadow-glass flex flex-col items-center gap-3">
                  <Info className="w-8 h-8 text-accent animate-bounce-light" />
                  <p className="font-extrabold text-sm uppercase tracking-wide">No Semesters Match Current Workspace Filters</p>
                  <button 
                    onClick={() => { setSelectedYearFilter("all"); setSelectedSemFilter("all"); }}
                    className="mt-2 px-4 py-2 bg-accent text-navy-950 font-black uppercase tracking-wider text-[10px] rounded-xl hover:bg-accent-hover transition-accent shadow-accent-glow"
                  >
                    Reset Workspace Filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* --- RIGHT SECTION: STICKY GLOBAL TOTALS DASHBOARD (SPAN 1) --- */}
        <section className="lg:col-span-1 print:col-span-3">
          <div className="lg:sticky lg:top-8 flex flex-col gap-6">
            
            {/* STICKY CARD: Final Cumulative Board Dashboard */}
            <div className="glass-panel rounded-2xl p-6 border-white/10 shadow-glass overflow-hidden relative">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full bg-accent/5 blur-[50px] pointer-events-none -z-10 animate-pulse-gold"></div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent transition-accent" />
                  <h3 className="text-base font-black text-white tracking-widest uppercase">Global Dashboard</h3>
                </div>
                {/* Prominent side badge */}
                <div className="self-start sm:self-auto px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/25 text-accent font-black uppercase tracking-widest text-[8px] transition-all shadow-accent-glow hover:bg-accent hover:text-navy-950">
                  POWERED BY OSKA.TECH
                </div>
              </div>

              {/* Master Circular ring and large digits */}
              <div className="flex flex-col items-center py-4 mb-4">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="42" 
                      fill="transparent" 
                      stroke="rgba(255,255,255,0.03)" 
                      strokeWidth="7"
                    />
                    <motion.circle 
                      cx="50" cy="50" r="42" 
                      fill="transparent" 
                      stroke="var(--theme-accent)" 
                      strokeWidth="7"
                      strokeDasharray={2 * Math.PI * 42}
                      strokeDashoffset={2 * Math.PI * 42 * (1 - globalCalculations.fgpa / 4.0)}
                      strokeLinecap="round"
                      className="transition-accent"
                    />
                  </svg>
                  
                  {/* Digital text counters inside circle */}
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-extrabold text-white tracking-tight leading-none gold-text-glow font-mono">
                      <RollingCount value={globalCalculations.fgpa} />
                    </span>
                    <span className="text-[10px] text-accent font-extrabold tracking-widest uppercase mt-1 transition-accent">
                      FGPA
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 font-extrabold uppercase mt-2">
                  Total Points Earned: {globalCalculations.totalPoints.toFixed(1)}
                </div>
              </div>

              {/* Grid mapping for board parameters */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="glass-input rounded-xl p-3 flex flex-col border-white/5 justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Credits</span>
                  <span className="text-lg font-extrabold text-white">{globalCalculations.totalCredits}</span>
                </div>
                <div className="glass-input rounded-xl p-3 flex flex-col border-white/5 justify-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Modules Graded</span>
                  <span className="text-lg font-extrabold text-white">
                    {globalCalculations.completedCount} / {globalCalculations.totalCount}
                  </span>
                </div>
              </div>

              {/* YEARLY GPA METRICS (YGPA BOX - DYNAMIC DURATION) */}
              <div className="flex flex-col gap-2 mb-6 border-t border-white/5 pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent mb-1 transition-accent">
                  Combined Yearly GPA (YGPA)
                </h4>
                
                {Array.from({ length: activeDegreeData.durationYears || 4 }, (_, idx) => idx + 1).map(yr => {
                  const data = getYearlyGpa(yr);

                  return (
                    <div key={yr} className="glass-input border-white/5 rounded-xl p-3 flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">Level {yr} (Year {yr}) Cumulative</span>
                      <div className="text-right">
                        <span className="font-extrabold text-white block">{data.ygpa.toFixed(2)}</span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">{data.credits} GPA Credits</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Formula reference label */}
              <div className="text-[10px] bg-navy-950/40 p-3 rounded-xl border border-white/5 font-mono text-slate-400 leading-relaxed">
                <span className="text-accent font-bold block mb-0.5 transition-accent">Dynamic Board Formula:</span>
                Calculates cumulative GPA across active semesters. Modules marked as <code className="text-red-400 font-bold">category: "NGPA"</code> (e.g. Capstone Project, Industrial Training) are strictly excluded from mathematical calculations.
              </div>
            </div>

            {/* WHAT-IF PLANNER INTERACTIVE CARD */}
            <div className="glass-panel rounded-2xl p-6 border-white/10 shadow-glass">
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Calculator className="w-5 h-5 text-accent transition-accent" />
                <h3 className="text-base font-bold text-white tracking-wide">"What-If" CGPA Planner</h3>
              </div>

              <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">
                Enter your target graduation CGPA and discover the exact average grade required across your remaining ungraded modules.
              </p>

              <div className="flex items-center gap-3 mb-4">
                <label className="text-[10px] font-extrabold text-accent uppercase tracking-widest transition-accent">Target CGPA:</label>
                <input 
                  type="number" 
                  min="0.00" 
                  max="4.00" 
                  step="0.01" 
                  value={targetCgpa}
                  onChange={(e) => setTargetCgpa(e.target.value)}
                  className="w-24 px-3 py-1.5 text-xs font-black text-white text-center glass-input rounded-lg"
                />
              </div>

              {/* Dynamic Warning and success message containers */}
              <div className={`p-4 rounded-xl border flex gap-3 items-start ${
                globalWhatIfStatus.impossible
                  ? 'bg-red-500/5 border-red-500/20 text-red-300'
                  : globalWhatIfStatus.success
                    ? 'bg-green-500/5 border-green-500/20 text-green-300'
                    : 'bg-accent/5 border-accent/15 text-slate-200'
              }`}>
                <AlertCircle className={`w-5 h-5 shrink-0 mt-0.5 ${
                  globalWhatIfStatus.impossible ? 'text-red-400' : 'text-accent transition-accent'
                }`} />
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-wider mb-1">Target Analysis:</h4>
                  <p className="text-[11px] font-bold leading-relaxed">
                    {globalWhatIfStatus.message || globalWhatIfStatus.error}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      {/* --- ELECTIVES SEARCH AND SELECTION MODAL --- */}
      <AnimatePresence>
        {activeElectiveSemester && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            
            {/* Translucent overlay mask */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveElectiveSemester(null)}
              className="absolute inset-0 bg-navy-950/70 backdrop-blur-md"
            ></motion.div>

            {/* Modal Body Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-panel-heavy rounded-2xl w-full max-w-lg p-6 relative border-white/20 shadow-glass-lg overflow-hidden"
            >
              
              {/* Close button */}
              <button 
                onClick={() => setActiveElectiveSemester(null)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3 pr-8">
                <Sparkles className="w-5 h-5 text-accent transition-accent" />
                <div>
                  <h3 className="text-base font-bold text-white">Select Course Module</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
                    Year {activeElectiveSemester.year} Sem {activeElectiveSemester.semester} Elective Pool
                  </p>
                </div>
              </div>

              {/* Dynamic search query input */}
              <div className="relative mb-5">
                <input 
                  type="text"
                  placeholder="Search course code or name..."
                  value={electiveSearch}
                  onChange={(e) => setElectiveSearch(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 text-xs font-bold text-white glass-input rounded-xl focus:ring-0 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>

              {/* Elective Pools List */}
              <div className="max-h-[250px] overflow-y-auto pr-1 flex flex-col gap-2">
                {getFilteredElectives().map((course) => (
                  <div 
                    key={course.code}
                    className="glass-input hover:border-accent/40 rounded-xl p-3.5 flex justify-between items-center text-xs group transition-accent"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono font-bold text-accent group-hover:text-accent-hover transition-accent">
                        {course.code}
                      </span>
                      <span className="font-bold text-white text-xs">{course.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{course.credits} Credits • {course.category}</span>
                    </div>
                    
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAddElectiveToSemester(course)}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-accent text-navy-950 hover:bg-accent-hover transition-accent shadow-accent-glow"
                    >
                      Add Course
                    </motion.button>
                  </div>
                ))}

                {getFilteredElectives().length === 0 && (
                  <div className="text-center text-xs text-slate-500 py-10 font-bold flex flex-col items-center gap-2">
                    <Info className="w-6 h-6 text-slate-600" />
                    <span>No electives available matching search filter.</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- SYSTEM CACHE CLEAR TOAST --- */}
      <AnimatePresence>
        {showClearToast && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 right-6 glass-panel-heavy text-white px-5 py-3.5 rounded-xl border border-white/15 shadow-accent-glow-lg flex items-center gap-3 z-50"
          >
            <CheckCircle2 className="w-5 h-5 text-accent transition-accent shrink-0" />
            <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- FOOTER --- */}
      <footer className="w-full max-w-none px-4 sm:px-6 md:px-12 mt-12 text-center relative z-10 print:mt-24">
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500">
          <p>© {new Date().getFullYear()} SLTCGPA.CALCULATOR. All rights reserved.</p>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-accent/60 font-serif italic text-sm tracking-wide transition-accent">
              "Non scholae sed vitae discimus"
            </p>
            {/* Powered by OSKA.TECH badge */}
            <div className="mt-1 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-bold uppercase tracking-widest text-[9px] transition-accent cursor-pointer shadow-accent-glow hover:bg-accent hover:text-navy-950">
              Powered by OSKA.TECH
            </div>
          </div>
          <p>Official Platform • Sri Lanka Technology Campus</p>
        </div>
      </footer>

    </div>
  );
}
