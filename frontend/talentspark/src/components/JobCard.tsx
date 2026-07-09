import { useState, useEffect } from "react";
import type { Job } from "../types/job";
import type { Company } from "../types/company";

type Props = {
    jobs: Job[];
    companies: Company[];
    onAdd: (job: Job) => void;
    onEdit: (job: Job) => void;
    onDelete: (id: number) => void;
    canModify?: boolean;
};

function JobCard({ jobs, companies, onAdd, onEdit, onDelete, canModify = false }: Props) {
    const [jobForm, setJobForm] = useState<Job>({
        id: 0,
        title: "",
        description: "",
        salary: 0,
        company_id: companies.length > 0 ? companies[0].id : 0,
    });

    useEffect(() => {
        if ((jobForm.company_id === 0 || jobForm.company_id === undefined) && companies.length > 0) {
            setJobForm((prev) => ({ ...prev, company_id: companies[0].id }));
        }
    }, [companies]);

    const handleAdd = () => {
        if (jobForm.id && jobForm.id > 0) {
            onEdit(jobForm);
        } else {
            onAdd(jobForm);
        }
        setJobForm({
            id: 0,
            title: "",
            description: "",
            salary: 0,
            company_id: companies.length > 0 ? companies[0].id : 0,
        });
    };

    const startEdit = (job: Job) => {
        setJobForm({ ...job });
    };

    const handleDeleteClick = (id: number) => {
        onDelete(id);
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">💼</span>
                    Jobs
                </h2>
                <span className="badge">{jobs.length} Total</span>
            </div>

            {jobs.length === 0 ? (
                <div style={{ 
                    textAlign: "center", 
                    padding: "40px 20px",
                    color: "var(--text-secondary)"
                }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                    <p>No jobs available. Add your first job below!</p>
                </div>
            ) : (
                jobs.map((job) => (
                    <div key={job.id} className="job-card">
                        <div className="job-header">
                            <div>
                                <h3 className="job-title">{job.title}</h3>
                                <p className="job-description">{job.description}</p>
                                <div className="job-details">
                                    <span className="job-detail">
                                        <span>💰</span>
                                        <strong>Salary:</strong> {job.salary}
                                    </span>
                                    <span className="job-detail">
                                        <span>🔗</span>
                                        <strong>Company:</strong> {companies.find(c => c.id === job.company_id)?.name || `ID: ${job.company_id}`}
                                    </span>
                                </div>
                            </div>
                            <div className="company-actions">
                                {canModify ? (
                                    <>
                                        <button className="btn btn-secondary" onClick={() => startEdit(job)}>
                                            ✏️ Edit
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDeleteClick(job.id)}>
                                            🗑️ Delete
                                        </button>
                                    </>
                                ) : (
                                    <span className="permission-note">Admin/HR only</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}

            <div style={{ marginTop: "24px" }}>
                {canModify ? (
                    <>
                        <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>➕</span> Add New Job
                        </h3>
                        <div className="form-row">
                            <input
                                type="text"
                                className="form-input"
                                value={jobForm.title}
                                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                                placeholder="Job title"
                            />
                            <input
                                type="text"
                                className="form-input"
                                value={jobForm.description}
                                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                                placeholder="Job description"
                            />
                            <input
                                type="number"
                                className="form-input"
                                value={jobForm.salary}
                                onChange={(e) => setJobForm({ ...jobForm, salary: Number(e.target.value) })}
                                placeholder="Salary"
                            />
                            <select
                                className="form-input"
                                value={jobForm.company_id}
                                onChange={(e) => setJobForm({ ...jobForm, company_id: Number(e.target.value) })}
                            >
                                {companies.map((company) => (
                                    <option key={company.id} value={company.id}>
                                        {company.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={handleAdd}>
                            {jobForm.id && jobForm.id > 0 ? "🔄 Update Job" : "🚀 Add Job"}
                        </button>
                    </>
                ) : (
                    <div className="permission-note" style={{ marginTop: "16px" }}>
                        Job create/edit/delete actions are only available for Admin or HR users.
                    </div>
                )}
            </div>
        </div>
    );
}

export default JobCard;