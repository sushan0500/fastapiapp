import { useState, type ChangeEvent } from "react";
import { analyzeResume } from "../Services/ResumeService";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";

GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

async function extractTextFromPdf(file: File): Promise<string> {
    const data = await file.arrayBuffer();
    const pdf = await getDocument({ data }).promise;
    const pageTexts: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const text = content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
        pageTexts.push(text);
    }

    return pageTexts.join("\n\n");
}

function ResumeAnalyzer() {
    const [resumeText, setResumeText] = useState("");
    const [analysis, setAnalysis] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string>("text");
    const [analysisType, setAnalysisType] = useState<string>("comprehensive");

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        setError(null);
        setFileName(file.name);
        setFileType(file.name.endsWith(".pdf") ? "pdf" : "text");

        const lowerName = file.name.toLowerCase();
        const textFileTypes = [
            "text/plain",
            "text/markdown",
            "text/csv",
            "text/html",
            "application/json",
            "application/xml",
            "application/javascript",
            "application/xhtml+xml",
        ];
        const extensionSupported = /\.(txt|md|csv|json|html|xml|js|ts|jsx|tsx|py|java|c|cpp|cs)$/i;

        try {
            if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
                const pdfText = await extractTextFromPdf(file);
                setResumeText(pdfText);
                return;
            }

            if (textFileTypes.includes(file.type) || extensionSupported.test(lowerName)) {
                const text = await file.text();
                setResumeText(text);
                return;
            }

            setError(
                "The selected file type cannot be automatically extracted in the browser. Please upload a PDF or text-based resume file, or paste the content manually."
            );
        } catch (err) {
            console.error("Failed to parse uploaded file:", err);
            setError("Unable to read the selected file. Please try again or use a different file.");
        }
    };

    const handleAnalyze = async () => {
        if (!resumeText.trim()) {
            setError("Please paste your resume text or upload a resume file before analyzing.");
            return;
        }

        setLoading(true);
        setError(null);
        setAnalysis("");

        try {
            const response = await analyzeResume({ resume_text: resumeText });
            setAnalysis(response.analysis);
        } catch (err: any) {
            console.error("Resume analysis failed", err);
            setError(
                err.response?.data?.detail ||
                err.message ||
                "Unable to analyze resume. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setResumeText("");
        setAnalysis("");
        setError(null);
        setFileName(null);
    };

    const handleCopyAnalysis = () => {
        navigator.clipboard.writeText(analysis);
    };

    const analysisOptions = [
        { value: "comprehensive", label: "Comprehensive Analysis" },
        { value: "skills", label: "Skills Focus" },
        { value: "experience", label: "Experience Focus" },
        { value: "ats", label: "ATS Optimization" },
    ];

    return (
        <section className="resume-analyzer-section">
            <div className="section-header">
                <h2>📄 Resume Analyzer</h2>
                <p>Upload your resume file or paste resume text and get an AI-powered analysis of skills, experience, and role fit.</p>
            </div>

            <div className="form-row" style={{ marginBottom: "16px" }}>
                <select
                    className="form-input"
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    style={{ maxWidth: "250px" }}
                >
                    {analysisOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="file-upload-group">
                <label className="file-upload-label" htmlFor="resume-upload">
                    Upload Resume File (PDF or text-based)
                </label>
                <input
                    id="resume-upload"
                    type="file"
                    accept="application/pdf, text/plain, .txt, .md, .csv, .json, .html, .xml, .js, .ts, .jsx, .tsx"
                    onChange={handleFileChange}
                    className="file-input"
                />
                {fileName && (
                    <div className="file-name" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>📎</span>
                        <span>Selected file: {fileName}</span>
                        <span style={{ 
                            background: "var(--primary)", 
                            color: "white", 
                            padding: "2px 8px", 
                            borderRadius: "12px", 
                            fontSize: "12px" 
                        }}>
                            {fileType === "pdf" ? "PDF" : "Text"}
                        </span>
                    </div>
                )}
            </div>

            <div style={{ position: "relative" }}>
                <textarea
                    value={resumeText}
                    onChange={(event) => setResumeText(event.target.value)}
                    placeholder="Paste your resume text here... (Name, Experience, Skills, Education, etc.)"
                    rows={10}
                    className="textarea"
                />
                {resumeText && (
                    <div style={{ 
                        position: "absolute", 
                        bottom: "8px", 
                        right: "8px", 
                        fontSize: "12px", 
                        color: "var(--text-muted)" 
                    }}>
                        {resumeText.length} characters
                    </div>
                )}
            </div>

            <div className="button-row">
                <button 
                    onClick={handleAnalyze} 
                    disabled={loading || !resumeText.trim()} 
                    className="btn btn-primary"
                >
                    {loading ? (
                        <>
                            <span className="loading-spinner" style={{ width: "16px", height: "16px", borderWidth: "2px" }}></span>
                            Analyzing...
                        </>
                    ) : (
                        <>✨ Analyze Resume</>
                    )}
                </button>
                <button 
                    onClick={handleClear} 
                    disabled={!resumeText && !analysis} 
                    className="btn btn-secondary"
                >
                    🗑️ Clear
                </button>
            </div>

            {error && (
                <div className="error-message" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {analysis && (
                <div className="analysis-result">
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        marginBottom: "12px",
                        paddingBottom: "8px",
                        borderBottom: "1px solid var(--border)"
                    }}>
                        <h3 style={{ margin: 0 }}>📊 Analysis Result</h3>
                        <button 
                            onClick={handleCopyAnalysis}
                            className="btn btn-secondary"
                            style={{ fontSize: "12px", padding: "6px 12px" }}
                        >
                            📋 Copy
                        </button>
                    </div>
                    <div style={{ 
                        background: "var(--surface)", 
                        padding: "16px", 
                        borderRadius: "8px",
                        maxHeight: "400px",
                        overflow: "auto"
                    }}>
                        <ReactMarkdown 
                            rehypePlugins={[rehypeHighlight, rehypeRaw]}
                            components={{
                                h1: ({ children }) => <h1 style={{ color: "var(--text-primary)", marginTop: "16px" }}>{children}</h1>,
                                h2: ({ children }) => <h2 style={{ color: "var(--text-primary)", marginTop: "12px" }}>{children}</h2>,
                                h3: ({ children }) => <h3 style={{ color: "var(--text-primary)", marginTop: "8px" }}>{children}</h3>,
                                p: ({ children }) => <p style={{ color: "var(--text-secondary)", marginBottom: "8px" }}>{children}</p>,
                                ul: ({ children }) => <ul style={{ color: "var(--text-secondary)", marginLeft: "20px" }}>{children}</ul>,
                                ol: ({ children }) => <ol style={{ color: "var(--text-secondary)", marginLeft: "20px" }}>{children}</ol>,
                                li: ({ children }) => <li style={{ marginBottom: "4px" }}>{children}</li>,
                                strong: ({ children }) => <strong style={{ color: "var(--primary)" }}>{children}</strong>,
                                code: ({ children, className }) => {
                                    const isBlock = className?.includes("language-");
                                    return isBlock ? (
                                        <code className={className} style={{ 
                                            background: "var(--surface-alt)",
                                            padding: "12px",
                                            borderRadius: "8px",
                                            display: "block",
                                            overflow: "auto"
                                        }}>
                                            {children}
                                        </code>
                                    ) : (
                                        <code style={{ 
                                            background: "var(--surface-alt)",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                            fontSize: "14px"
                                        }}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {analysis}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ResumeAnalyzer;