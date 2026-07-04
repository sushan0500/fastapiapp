function NavBar() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="navbar">
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                <ul>
                    <li>
                        <a href="#" onClick={() => scrollToSection("home")} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>🏠</span> Home
                        </a>
                    </li>
                    <li>
                        <a href="#companies" onClick={() => scrollToSection("companies")} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>🏢</span> Companies
                        </a>
                    </li>
                    <li>
                        <a href="#jobs" onClick={() => scrollToSection("jobs")} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>💼</span> Jobs
                        </a>
                    </li>
                    <li>
                        <a href="#chat" onClick={() => scrollToSection("chat")} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>🤖</span> Chat
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;