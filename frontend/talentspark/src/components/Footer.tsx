import { useState, useEffect } from "react";

function Footer() {
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="footer">
            <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                gap: "16px" 
            }}>
                <p style={{ margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>© 2024 TalentSpark. All rights reserved.</span>
                </p>
                <div style={{ 
                    display: "flex", 
                    gap: "24px", 
                    fontSize: "14px",
                    flexWrap: "wrap",
                    justifyContent: "center"
                }}>
                    <a href="#" style={{ 
                        color: "var(--text-secondary)", 
                        textDecoration: "none",
                        transition: "var(--transition)"
                    }}>
                        Privacy Policy
                    </a>
                    <a href="#" style={{ 
                        color: "var(--text-secondary)", 
                        textDecoration: "none",
                        transition: "var(--transition)"
                    }}>
                        Terms of Service
                    </a>
                    <a href="#" style={{ 
                        color: "var(--text-secondary)", 
                        textDecoration: "none",
                        transition: "var(--transition)"
                    }}>
                        Contact
                    </a>
                </div>
                {showBackToTop && (
                    <button 
                        onClick={scrollToTop}
                        className="fab"
                        title="Back to top"
                        style={{ 
                            position: "static",
                            width: "40px",
                            height: "40px",
                            fontSize: "20px"
                        }}
                    >
                        ⬆️
                    </button>
                )}
            </div>
        </footer>
    );
}

export default Footer;