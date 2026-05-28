import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
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
  Plus, 
  Save, 
  AlertCircle 
} from 'lucide-react';
import { CURRICULUM_DATABASE, GRADING_SYSTEM } from './data/curriculum';

export default function App() {
  // --- STATE SYSTEM ---
  const [selectedDegree, setSelectedDegree] = useState("software-engineering");
  const [selectedYear, setSelectedYear] = useState(1);
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [targetGpa, setTargetGpa] = useState("3.50");
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Persistent Grades state: { [degree]: { [year]: { [semester]: { [courseCode]: grade } } } }
  const [grades, setGrades] = useState(() => {
    const saved = localStorage.getItem("sltc_gpa_grades");
    return saved ? JSON.parse(saved) : {};
  });

  // Persistent Saved Semesters for CGPA Tracker
  const [savedSemesters, setSavedSemesters] = useState(() => {
    const saved = localStorage.getItem("sltc_gpa_saved_semesters");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync grades to localStorage
  useEffect(() => {
    localStorage.setItem("sltc_gpa_grades", JSON.stringify(grades));
  }, [grades]);

  // Sync saved semesters to localStorage
  useEffect(() => {
    localStorage.setItem("sltc_gpa_saved_semesters", JSON.stringify(savedSemesters));
  }, [savedSemesters]);

  // --- DYNAMIC DATABASE RESOLUTION ---
  const activeDegree = CURRICULUM_DATABASE[selectedDegree] || CURRICULUM_DATABASE["software-engineering"];
  
  // Resolve years & semesters dynamically based on the preloaded database to support future additions
  const availableYears = Object.keys(activeDegree.years).map(Number).sort((a, b) => a - b);
  
  // Ensure selected year is valid for the current degree, fallback to first available
  useEffect(() => {
    if (!availableYears.includes(selectedYear) && availableYears.length > 0) {
      setSelectedYear(availableYears[0]);
    }
  }, [selectedDegree, availableYears, selectedYear]);

  const activeYearData = activeDegree.years[selectedYear] || {};
  const availableSemesters = Object.keys(activeYearData).map(Number).sort((a, b) => a - b);

  // Ensure selected semester is valid for the current year, fallback to first available
  useEffect(() => {
    if (!availableSemesters.includes(selectedSemester) && availableSemesters.length > 0) {
      setSelectedSemester(availableSemesters[0]);
    }
  }, [selectedYear, availableSemesters, selectedSemester]);

  const activeModules = activeYearData[selectedSemester] || [];

  // --- ICON MAP FOR DEGREES ---
  const getDegreeIcon = (id) => {
    switch (id) {
      case 'software-engineering': return <Code2 className="w-5 h-5" />;
      case 'cloud-computing': return <Cloud className="w-5 h-5" />;
      case 'cyber-security': return <Shield className="w-5 h-5" />;
      case 'data-science': return <Database className="w-5 h-5" />;
      case 'applied-it': return <Cpu className="w-5 h-5" />;
      default: return <GraduationCap className="w-5 h-5" />;
    }
  };

  // --- GPA CALCULATION ENGINE ---
  const getGradeForModule = (courseCode, courseName) => {
    const compoundKey = `${courseCode}-${courseName}`;
    return grades[selectedDegree]?.[selectedYear]?.[selectedSemester]?.[compoundKey] || "";
  };

  const handleGradeChange = (courseCode, courseName, gradeValue) => {
    const compoundKey = `${courseCode}-${courseName}`;
    setGrades(prev => {
      const updated = { ...prev };
      if (!updated[selectedDegree]) updated[selectedDegree] = {};
      if (!updated[selectedDegree][selectedYear]) updated[selectedDegree][selectedYear] = {};
      if (!updated[selectedDegree][selectedYear][selectedSemester]) updated[selectedDegree][selectedYear][selectedSemester] = {};
      
      updated[selectedDegree][selectedYear][selectedSemester][compoundKey] = gradeValue;
      return updated;
    });
  };

  // Calculate SGPA for current active semester
  const calculateSemesterStats = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    let selectedCount = 0;
    let gpaModulesCount = 0;

    activeModules.forEach(mod => {
      if (mod.category === 'GPA') {
        gpaModulesCount++;
        const grade = getGradeForModule(mod.code, mod.name);
        if (grade && GRADING_SYSTEM[grade]) {
          totalPoints += GRADING_SYSTEM[grade].gp * mod.credits;
          totalCredits += mod.credits;
          selectedCount++;
        }
      }
    });

    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

    return {
      totalPoints: parseFloat(totalPoints.toFixed(2)),
      totalCredits,
      sgpa: parseFloat(sgpa.toFixed(2)),
      allSelected: selectedCount === gpaModulesCount && gpaModulesCount > 0,
      selectedCount,
      gpaModulesCount
    };
  };

  const currentSemesterStats = calculateSemesterStats();

  // Reset grades for current semester
  const resetSemesterGrades = () => {
    setGrades(prev => {
      const updated = { ...prev };
      if (updated[selectedDegree]?.[selectedYear]?.[selectedSemester]) {
        updated[selectedDegree][selectedYear][selectedSemester] = {};
      }
      return updated;
    });
    triggerToast("Semester grades reset successfully.");
  };

  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 3000);
  };

  // --- ACADEMIC RECORD / CGPA TRACKER ACTIONS ---
  const saveSemesterToRecord = () => {
    // Collect active modules and their graded values
    const courseGrades = activeModules.map(mod => ({
      code: mod.code,
      name: mod.name,
      credits: mod.credits,
      category: mod.category,
      grade: getGradeForModule(mod.code, mod.name)
    })).filter(c => c.grade !== ""); // Only save courses where user selected a grade

    if (courseGrades.length === 0) {
      triggerToast("Cannot save: No grades have been selected yet!");
      return;
    }

    // Prevent duplicates by updating if already saved
    setSavedSemesters(prev => {
      const filtered = prev.filter(item => 
        !(item.degreeId === selectedDegree && item.year === selectedYear && item.semester === selectedSemester)
      );

      return [...filtered, {
        degreeId: selectedDegree,
        degreeName: activeDegree.name,
        year: selectedYear,
        semester: selectedSemester,
        courses: courseGrades,
        sgpa: currentSemesterStats.sgpa,
        credits: currentSemesterStats.totalCredits
      }].sort((a, b) => {
        // Sort by Degree, then Year, then Semester
        if (a.degreeName !== b.degreeName) return a.degreeName.localeCompare(b.degreeName);
        if (a.year !== b.year) return a.year - b.year;
        return a.semester - b.semester;
      });
    });

    triggerToast(`Year ${selectedYear} Semester ${selectedSemester} saved to academic record.`);
  };

  const removeSemesterFromRecord = (index) => {
    setSavedSemesters(prev => prev.filter((_, i) => i !== index));
    triggerToast("Semester removed from academic record.");
  };

  const clearAllSavedSemesters = () => {
    if (window.confirm("Are you sure you want to clear your entire saved academic record?")) {
      setSavedSemesters([]);
      triggerToast("Academic record cleared.");
    }
  };

  // Calculate Cumulative GPA (CGPA) from saved semesters
  const calculateCumulativeStats = () => {
    let grandPoints = 0;
    let grandCredits = 0;

    savedSemesters.forEach(sem => {
      sem.courses.forEach(c => {
        if (c.category === 'GPA' && GRADING_SYSTEM[c.grade]) {
          grandPoints += GRADING_SYSTEM[c.grade].gp * c.credits;
          grandCredits += c.credits;
        }
      });
    });

    const cgpa = grandCredits > 0 ? (grandPoints / grandCredits) : 0;

    return {
      cgpa: parseFloat(cgpa.toFixed(2)),
      totalCredits: grandCredits,
      totalPoints: parseFloat(grandPoints.toFixed(2))
    };
  };

  const cumulativeStats = calculateCumulativeStats();

  // --- WHAT-IF GPA PLANNER ENGINE ---
  const calculateWhatIfStatus = () => {
    const target = parseFloat(targetGpa);
    if (isNaN(target) || target < 0 || target > 4.0) return { error: "Please enter a valid GPA target between 0.00 and 4.00" };

    let completedPoints = 0;
    let completedCredits = 0;
    let remainingCredits = 0;

    activeModules.forEach(mod => {
      if (mod.category === 'GPA') {
        const grade = getGradeForModule(mod.code, mod.name);
        if (grade && GRADING_SYSTEM[grade]) {
          completedPoints += GRADING_SYSTEM[grade].gp * mod.credits;
          completedCredits += mod.credits;
        } else {
          remainingCredits += mod.credits;
        }
      }
    });

    const totalExpectedCredits = completedCredits + remainingCredits;
    if (totalExpectedCredits === 0) return { message: "No GPA modules in this semester." };

    const targetPointsTotal = target * totalExpectedCredits;
    const requiredPointsFromRemaining = targetPointsTotal - completedPoints;

    if (remainingCredits === 0) {
      const currentGpa = completedCredits > 0 ? (completedPoints / completedCredits) : 0;
      if (currentGpa >= target) {
        return { success: true, message: `Target Achieved! Current GPA is ${currentGpa.toFixed(2)}.` };
      } else {
        return { success: false, message: `Semester complete. Current GPA ${currentGpa.toFixed(2)} is below target ${target.toFixed(2)}.` };
      }
    }

    const requiredAverageGp = requiredPointsFromRemaining / remainingCredits;

    if (requiredAverageGp > 4.0) {
      return { 
        impossible: true, 
        message: `Mathematically impossible. You would need a grade point of ${requiredAverageGp.toFixed(2)} average, but the maximum is 4.00.` 
      };
    } else if (requiredAverageGp <= 0.0) {
      return { 
        success: true, 
        message: `Target locked! You have already accumulated enough points. You need an average grade point of 0.00 (E) or higher on remaining modules.` 
      };
    } else {
      // Find the closest grade that covers this GP
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
        message: `To achieve ${target.toFixed(2)} GPA, you need to average a ${requiredAverageGp.toFixed(2)} GP (${suggestedGrade}) on the remaining ${remainingCredits} credits.`
      };
    }
  };

  const whatIfStatus = calculateWhatIfStatus();

  // Print Report Handler
  const printReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden select-none pb-12">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-navy-800/20 blur-[120px] pointer-events-none -z-10 animate-pulse-gold"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-900/10 blur-[150px] pointer-events-none -z-10 animate-pulse-gold" style={{ animationDelay: '2s' }}></div>

      {/* --- HEADER --- */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="glass-panel rounded-2xl px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10 border-gold-500/10">
          <div className="flex items-center gap-4">
            {/* Logo Shield SVG */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-gold-glow">
              <GraduationCap className="w-7 h-7" />
              <div className="absolute -inset-0.5 rounded-xl border border-gold-300 opacity-50"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                SLTC<span className="text-gold-500 font-extrabold text-lg sm:text-xl px-1.5 py-0.5 bg-gold-500/10 border border-gold-500/20 rounded-md">GPA</span>.CALCULATOR
              </h1>
              <p className="text-xs text-slate-400 font-medium">Sri Lanka Technology Campus • Academic Excellence Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={printReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white glass-panel glass-panel-hover"
            >
              <Download className="w-4 h-4 text-gold-500" />
              Export Report
            </button>
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/25">
              <Sparkles className="w-4 h-4" />
              Premium Mode Active
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN LAYOUT GRID --- */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 relative z-10">
        
        {/* --- LEFT SIDEBAR: SELECTORS & ACADEMIC PROGRESS SUMMARY --- */}
        <section className="lg:col-span-1 flex flex-col gap-8">
          
          {/* Card 1: Degree & Semester Selector */}
          <div className="glass-panel rounded-2xl p-6 relative border-gold-500/10 shadow-glass">
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Award className="w-5 h-5 text-gold-500" />
              <h2 className="text-lg font-bold text-white tracking-wide">Academic Selections</h2>
            </div>
            
            {/* Step 1: Degree Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">1. Select Your Degree</label>
              <div className="relative">
                <select 
                  value={selectedDegree} 
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="w-full px-4 py-3 pl-10 rounded-xl text-sm font-semibold text-white glass-input appearance-none"
                >
                  {Object.entries(CURRICULUM_DATABASE).map(([key, value]) => (
                    <option key={key} value={key} className="bg-navy-900 text-white">
                      {value.name}
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-3.5 text-gold-500">
                  {getDegreeIcon(selectedDegree)}
                </div>
              </div>
            </div>

            {/* Step 2: Year Selector */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">2. Select Year</label>
              <div className="grid grid-cols-2 gap-2">
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 border ${
                      selectedYear === yr
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 border-gold-400 shadow-gold-glow'
                        : 'glass-panel text-slate-300 border-white/5 hover:border-gold-500/30'
                    }`}
                  >
                    Year {yr}
                  </button>
                ))}
                {availableYears.length === 0 && (
                  <div className="col-span-2 text-center text-xs text-slate-500 p-2">No years configured</div>
                )}
              </div>
            </div>

            {/* Step 3: Semester Selector */}
            <div>
              <label className="block text-xs font-bold text-gold-400 uppercase tracking-wider mb-2">3. Select Semester</label>
              <div className="grid grid-cols-2 gap-2">
                {availableSemesters.map((sem) => (
                  <button
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 border ${
                      selectedSemester === sem
                        ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 border-gold-400 shadow-gold-glow'
                        : 'glass-panel text-slate-300 border-white/5 hover:border-gold-500/30'
                    }`}
                  >
                    Semester {sem}
                  </button>
                ))}
                {availableSemesters.length === 0 && (
                  <div className="col-span-2 text-center text-xs text-slate-500 py-3 glass-panel rounded-xl">
                    No Semesters available for Year {selectedYear}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Real-Time Dashboard (SGPA circular meter) */}
          <div className="glass-panel rounded-2xl p-6 relative border-gold-500/10 shadow-glass overflow-hidden">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gold-500" />
                <h2 className="text-lg font-bold text-white tracking-wide">Semester Stats</h2>
              </div>
              {currentSemesterStats.selectedCount > 0 && (
                <span className="text-[10px] uppercase font-extrabold bg-green-500/10 text-green-400 px-2 py-0.5 border border-green-500/20 rounded-md">
                  Active
                </span>
              )}
            </div>

            {/* Gauge Row */}
            <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
              {/* Circular Gauge */}
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="transparent" 
                    stroke="rgba(255,255,255,0.03)" 
                    strokeWidth="8"
                  />
                  {/* Gauge Highlight Fill */}
                  <circle 
                    cx="50" cy="50" r="42" 
                    fill="transparent" 
                    stroke="url(#goldGradient)" 
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={2 * Math.PI * 42 * (1 - currentSemesterStats.sgpa / 4.0)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FBBD23" />
                      <stop offset="100%" stopColor="#D4AF37" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Internal Center Content */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white tracking-tight gold-text-glow">
                    {currentSemesterStats.sgpa.toFixed(2)}
                  </span>
                  <span className="text-[10px] text-gold-500 font-bold uppercase tracking-wider">SGPA</span>
                </div>
              </div>

              {/* Stat breakdowns */}
              <div className="flex-1 w-full flex flex-col gap-3 justify-center">
                <div className="glass-input rounded-xl p-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Total Points</span>
                  <span className="text-sm font-bold text-white">{currentSemesterStats.totalPoints.toFixed(1)}</span>
                </div>
                <div className="glass-input rounded-xl p-3 flex justify-between items-center">
                  <span className="text-xs font-semibold text-slate-400">Total GPA Credits</span>
                  <span className="text-sm font-bold text-white">{currentSemesterStats.totalCredits}</span>
                </div>
              </div>
            </div>

            {/* Quick Math Summary Formula (Based on manual instructions) */}
            <div className="mt-3 text-xs bg-navy-950/40 p-2.5 rounded-xl border border-white/5 font-mono text-slate-400 flex flex-col gap-1">
              <div className="flex justify-between border-b border-white/5 pb-1">
                <span>Sum (GP * Credits)</span>
                <span className="text-white font-bold">{currentSemesterStats.totalPoints.toFixed(1)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>GPA = {currentSemesterStats.totalPoints.toFixed(1)} / {currentSemesterStats.totalCredits}</span>
                <span className="text-gold-400 font-bold">{currentSemesterStats.sgpa.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions for active semester */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-1">
              <button
                onClick={saveSemesterToRecord}
                disabled={currentSemesterStats.totalCredits === 0}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-gold-500 text-navy-950 hover:bg-gold-400 transition-all duration-200 shadow-gold-glow disabled:opacity-40 disabled:pointer-events-none"
              >
                <Save className="w-3.5 h-3.5" />
                Save Sem
              </button>
              <button
                onClick={resetSemesterGrades}
                className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white glass-panel glass-panel-hover"
              >
                <RefreshCw className="w-3.5 h-3.5 text-gold-500" />
                Reset
              </button>
            </div>
          </div>
        </section>

        {/* --- MIDDLE COLUMN: MAIN PRELOADED MODULES LIST TABLE --- */}
        <section className="lg:col-span-2 flex flex-col gap-8">
          <div className="glass-panel rounded-2xl p-6 relative border-gold-500/10 shadow-glass flex-1 flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 border-b border-white/5 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold-500" />
                  <h2 className="text-lg font-bold text-white tracking-wide">{activeDegree.name}</h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Year {selectedYear} • Semester {selectedSemester} Modules Database
                </p>
              </div>
              <span className="text-xs font-bold text-gold-500 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {activeModules.length} Modules Pre-loaded
              </span>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto rounded-xl border border-white/5 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy-950/60 border-b border-white/5 text-[11px] uppercase tracking-wider font-extrabold text-gold-400">
                    <th className="py-4 px-4">Code</th>
                    <th className="py-4 px-4">Module Name</th>
                    <th className="py-4 px-4 text-center">Credits</th>
                    <th className="py-4 px-4 text-center">Type</th>
                    <th className="py-4 px-4 text-center">Grade Achieved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {activeModules.map((mod) => {
                    const selectedGrade = getGradeForModule(mod.code, mod.name);
                    const gradePoint = selectedGrade ? GRADING_SYSTEM[selectedGrade]?.gp : null;

                    return (
                      <tr 
                        key={`${mod.code}-${mod.name}`} 
                        className={`transition-colors duration-150 ${
                          selectedGrade 
                            ? 'bg-gold-500/5 hover:bg-gold-500/10' 
                            : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-4 px-4 font-mono text-xs font-bold text-slate-300">
                          {mod.code}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{mod.name}</div>
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-slate-300">
                          {mod.credits}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                            mod.category === 'GPA'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {mod.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center">
                            <select
                              value={selectedGrade}
                              onChange={(e) => handleGradeChange(mod.code, mod.name, e.target.value)}
                              className={`w-32 py-1.5 px-3 rounded-lg text-xs font-bold appearance-none text-center cursor-pointer transition-all duration-200 border ${
                                selectedGrade
                                  ? 'bg-gold-500 text-navy-950 border-gold-400 font-extrabold shadow-sm'
                                  : 'glass-input text-slate-400 hover:border-white/20'
                              }`}
                            >
                              <option value="" className="bg-navy-900 text-slate-400 font-semibold">- Select Grade -</option>
                              {Object.entries(GRADING_SYSTEM).map(([g, details]) => (
                                <option key={g} value={g} className="bg-navy-900 text-white font-semibold">
                                  {g} ({details.range})
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {activeModules.length === 0 && (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-500 font-semibold">
                        No modules preloaded for this selection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Manual Logic Reference Label */}
            <div className="mt-4 flex items-start gap-2 bg-blue-500/5 border border-blue-500/10 rounded-xl p-3.5 text-xs text-slate-400">
              <Info className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong className="text-slate-300">Formulas Employed: </strong>
                Module Value = <code className="text-gold-400 font-bold font-mono">Grade Point * Credit</code>. 
                SGPA = <code className="text-gold-400 font-bold font-mono">Sum(Module Values) / Sum(Credits)</code>. 
                Non-GPA modules (NGPA) are preloaded for complete record tracking but are 
                <span className="text-gold-400 font-bold"> strictly omitted</span> from all GPA mathematical models.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* --- CUMULATIVE & WHAT-IF EXTRA DASHBOARD AREA --- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 relative z-10">
        
        {/* WHAT-IF TARGET CALCULATOR */}
        <div className="glass-panel rounded-2xl p-6 border-gold-500/10 shadow-glass flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
              <Calculator className="w-5 h-5 text-gold-500" />
              <h3 className="text-lg font-bold text-white tracking-wide">"What-If" Semester Planner</h3>
            </div>
            
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Plan ahead! Enter your target GPA for this semester and discover exactly what average grades you must achieve on any remaining courses.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <label className="text-xs font-bold text-gold-400 uppercase tracking-wider">Target GPA:</label>
              <input 
                type="number" 
                min="0.00" 
                max="4.00" 
                step="0.01" 
                value={targetGpa}
                onChange={(e) => setTargetGpa(e.target.value)}
                className="w-24 px-3 py-1.5 text-xs font-extrabold text-white text-center glass-input rounded-lg"
              />
            </div>

            {/* Dynamic Message Box based on state */}
            <div className={`p-4 rounded-xl border flex gap-3 items-start ${
              whatIfStatus.impossible
                ? 'bg-red-500/5 border-red-500/20 text-red-300'
                : whatIfStatus.success
                  ? 'bg-green-500/5 border-green-500/20 text-green-300'
                  : 'bg-gold-500/5 border-gold-500/15 text-gold-200'
            }`}>
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-gold-500" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-1">Calculation Output:</h4>
                <p className="text-xs font-semibold leading-relaxed">
                  {whatIfStatus.message || whatIfStatus.error}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 text-[10px] text-slate-500 border-t border-white/5 text-right font-semibold">
            Based on active grades selected in table
          </div>
        </div>

        {/* CGPA TRACKER / MULTI-SEMESTER RECORD */}
        <div className="glass-panel rounded-2xl p-6 border-gold-500/10 shadow-glass flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-gold-500" />
              <h3 className="text-lg font-bold text-white tracking-wide">Academic Record (CGPA)</h3>
            </div>
            {savedSemesters.length > 0 && (
              <button
                onClick={clearAllSavedSemesters}
                className="text-[10px] text-red-400 hover:text-red-300 font-extrabold uppercase flex items-center gap-1 transition-all"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Your saved semesters map. Calculate your absolute Cumulative GPA (CGPA) across your university career.
          </p>

          {/* List of saved semesters */}
          <div className="flex-1 overflow-y-auto max-h-[160px] pr-1 mb-4 flex flex-col gap-2">
            {savedSemesters.map((sem, index) => (
              <div 
                key={index} 
                className="glass-input hover:border-gold-500/20 rounded-xl p-3 flex justify-between items-center text-xs transition-all duration-200"
              >
                <div className="flex flex-col">
                  <span className="font-extrabold text-white">{sem.degreeName}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Year {sem.year} Sem {sem.semester} • {sem.credits} GPA Credits</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-extrabold text-gold-500 text-sm block">{sem.sgpa.toFixed(2)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold block">SGPA</span>
                  </div>
                  <button
                    onClick={() => removeSemesterFromRecord(index)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-md transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {savedSemesters.length === 0 && (
              <div className="text-center text-xs text-slate-500 py-8 border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-2">
                <Save className="w-6 h-6 text-slate-600" />
                <span>No semesters saved to your Academic Record yet.</span>
                <span className="text-[10px] text-slate-600">Select grades and click "Save Sem" above to calculate your CGPA!</span>
              </div>
            )}
          </div>

          {/* CGPA display */}
          <div className="bg-navy-950/60 border border-white/5 rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">Cumulative Career GPA</span>
              <span className="text-xs text-gold-500/80 font-bold block">{cumulativeStats.totalCredits} GPA Credits Cumulative</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-gold-400 tracking-tight gold-text-glow">
                {cumulativeStats.cgpa.toFixed(2)}
              </span>
              <span className="text-[10px] block font-bold text-slate-500 uppercase tracking-wider">CGPA</span>
            </div>
          </div>
        </div>

      </section>

      {/* --- TOAST SYSTEM --- */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 glass-panel-heavy text-white px-5 py-3.5 rounded-xl border border-gold-500/20 shadow-gold-glow-lg flex items-center gap-3 z-50 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
          <span className="text-xs font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 text-center relative z-10">
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
          <p>© {new Date().getFullYear()} SLTCGPA.CALCULATOR. All rights reserved.</p>
          <p className="text-gold-500/60 font-serif italic text-sm tracking-wide">
            "Non scholae sed vitae discimus"
          </p>
          <p>Designed for Sri Lanka Technology Campus</p>
        </div>
      </footer>
    </div>
  );
}
