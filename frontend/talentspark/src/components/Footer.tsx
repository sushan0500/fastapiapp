function Footer() {
    return (
        <footer className="footer">
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <p style={{ margin: 0 }}>
                    <span>© 2024 TalentSpark. All rights reserved.</span>
                </p>
                <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                    <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Privacy Policy</a>
                    <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Terms of Service</a>
                    <a href="#" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Contact</a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;