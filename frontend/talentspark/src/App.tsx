import NavBar from "./components/NavBar";
import CompanyCard from "./components/CompanyCard";
import JobCard from "./components/JobCard";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import { useEffect, useState } from "react";
import { getCompanies, updateCompany, deleteCompany, createCompany } from "./Services/CompanyService";
import { getJobs, createJob, updateJob, deleteJob } from "./Services/JobService";
import type { Company } from "./types/company";
import type { Job } from "./types/job";
import "./App.css";

function App() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [userRole, setUserRole] = useState<string | null>(null);
    const [showRegister, setShowRegister] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem("darkMode");
        return saved ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    useEffect(() => {
        if (token) {
            const payload = parseJwt(token);
            setUserRole(typeof payload?.role === "string" ? payload.role.toLowerCase() : null);
        } else {
            setUserRole(null);
        }
    }, [token]);

    function parseJwt(tok: string): Record<string, unknown> | null {
        try {
            const base64Url = tok.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch {
            return null;
        }
    }

    async function fetchCompanies() {
        if (!token) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const company = await getCompanies();
            setCompanies(company);
            setError(null);
        } catch (err: any) {
            console.error("Failed to load companies:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
                return;
            }
            setCompanies([]);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }

    async function fetchJobs() {
        if (!token) {
            return;
        }

        try {
            const jobList = await getJobs();
            setJobs(jobList);
        } catch (err: any) {
            console.error("Failed to load jobs:", err);
            if (err.response?.status === 401 || err.response?.status === 403) {
                handleLogout();
                return;
            }
            setJobs([]);
            setError(err as Error);
        }
    }

    async function handleLogin(newToken: string) {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setShowRegister(false);
        const payload = parseJwt(newToken);
        setUserRole(typeof payload?.role === "string" ? payload.role.toLowerCase() : null);
    }

    function handleSwitchToRegister() {
        setShowRegister(true);
        setError(null);
    }

    function handleSwitchToLogin() {
        setShowRegister(false);
        setError(null);
    }

    function handleLogout() {
        localStorage.removeItem("token");
        setToken(null);
        setUserRole(null);
        setCompanies([]);
        setError(null);
    }

    async function handleEdit(company: Company) {
        try {
            const updatedCompany = await updateCompany(company.id, company);
            setCompanies(companies.map((c) => c.id === updatedCompany.id ? updatedCompany : c));
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert("Access Denied: You don't have permission to perform this action.");
            } else {
                setError(err as Error);
            }
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteCompany(id);
            setCompanies(companies.filter((c) => c.id !== id));
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert("Access Denied: You don't have permission to perform this action.");
            } else {
                setError(err as Error);
            }
        }
    }

    async function handleAdd(company: Company) {
        try {
            const newCompany = await createCompany(company);
            setCompanies([...companies, newCompany]);
        } catch (err) {
            setError(err as Error);
        }
    }

    async function handleAddJob(job: Job) {
        try {
            const newJob = await createJob(job);
            setJobs([...jobs, newJob]);
        } catch (err) {
            setError(err as Error);
        }
    }

    async function handleEditJob(job: Job) {
        try {
            const updated = await updateJob(job.id, job);
            setJobs(jobs.map((j) => (j.id === updated.id ? updated : j)));
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert("Access Denied: You don't have permission to perform this action.");
            } else {
                setError(err as Error);
            }
        }
    }

    async function handleDeleteJob(id: number) {
        try {
            await deleteJob(id);
            setJobs(jobs.filter((j) => j.id !== id));
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                alert("Access Denied: You don't have permission to perform this action.");
            } else {
                setError(err as Error);
            }
        }
    }

    useEffect(() => {
        fetchCompanies();
        fetchJobs();
    }, [token]);

    if (!token) {
        return showRegister ? (
            <Register onSwitchToLogin={handleSwitchToLogin} />
        ) : (
            <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
        );
    }

    if (loading) {
        return (
            <div className="loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    if (error) {
        const errorMessage = error.message.includes("401") || error.message.includes("403") 
            ? "Access Denied: You don't have permission to perform this action." 
            : `Error: ${error.message}`;
        return <div className="error">{errorMessage}</div>;
    }

    return (
        <>
            <button 
                className="theme-toggle"
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {darkMode ? "☀️" : "🌙"}
            </button>
            <NavBar />
            <main className="main-container">
                {/* Hero Section */}
                <section className="hero-section" id="home">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            <span className="gradient-text">TalentSpark Dashboard</span>
                        </h1>
                        <p className="hero-subtitle">
                            Your all-in-one platform for job management, AI assistance, and resume analysis
                        </p>
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-value">{companies.length}</span>
                                <span className="stat-label">Companies</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{jobs.length}</span>
                                <span className="stat-label">Jobs</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">AI</span>
                                <span className="stat-label">Powered</span>
                            </div>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </section>
                
                <div className="card-grid">
                    <div className="stats-card">
                        <div className="stats-number">{companies.length}</div>
                        <div className="stats-label">Companies</div>
                    </div>
                    <div className="stats-card">
                        <div className="stats-number">{jobs.length}</div>
                        <div className="stats-label">Jobs</div>
                    </div>
                </div>

                <div id="companies">
                    <CompanyCard
                        companies={companies}
                        onedit={handleEdit}
                        ondelete={handleDelete}
                        onadd={handleAdd}
                        canModify={userRole === "admin" || userRole === "hr"}
                    />
                </div>
                <div id="jobs">
                    <JobCard
                        jobs={jobs}
                        companies={companies}
                        onAdd={handleAddJob}
                        onEdit={handleEditJob}
                        onDelete={handleDeleteJob}
                        canModify={userRole === "admin" || userRole === "hr"}
                    />
                </div>
                <div id="chat">
                    <Chat />
                </div>
                <div id="resume">
                    <ResumeAnalyzer />
                </div>
            </main>
            <Footer />
        </>
    );
}

export default App;