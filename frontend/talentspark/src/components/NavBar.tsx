import { useState, useEffect } from "react";

function NavBar() {
    const [activeSection, setActiveSection] = useState<string>("home");

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            setActiveSection(sectionId);
        }
    };

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = ["home", "companies", "jobs", "chat", "resume"];
            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { id: "home", label: "Home", icon: "🏠" },
        { id: "companies", label: "Companies", icon: "🏢" },
        { id: "jobs", label: "Jobs", icon: "💼" },
        { id: "chat", label: "Chat", icon: "🤖" },
        { id: "resume", label: "Resume Analyzer", icon: "📄" },
    ];

    return (
        <nav className="navbar">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <ul>
                    {navItems.map((item) => (
                        <li key={item.id}>
                            <a 
                                href={`#${item.id}`} 
                                onClick={() => scrollToSection(item.id)} 
                                style={{ 
                                    display: "flex", 
                                    alignItems: "center", 
                                    gap: "8px",
                                    background: activeSection === item.id ? "var(--surface-alt)" : "transparent",
                                    borderRadius: "var(--radius-xl)",
                                }}
                            >
                                <span>{item.icon}</span> {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;