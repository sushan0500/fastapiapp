import { useState, useEffect } from "react";
import type { Job } from "../types/job";
import type { Company } from "../types/company";

type Props = {
    jobs: Job[];
    companies: Company[];
    onAdd: (job: Job) => void;
    onEdit: (job: Job) => void;
    onDelete: (id: number) => void;
};

function JobCard({ jobs, companies, onAdd, onEdit, onDelete }: Props) {
    const [jobForm, setJobForm] = useState<Job>({
        id: 0,
        title: "",
        description: "",
        salary: "",
        company_id: companies.length > 0 ? companies[0].id : 0,
    });

    useEffect(() => {
        // If companies were not available at mount, set company_id when they arrive
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
            salary: "",
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
        <div>
            <h2>Jobs</h2>
            {jobs.length === 0 ? (
                <p>No jobs available.</p>
            ) : (
                jobs.map((job) => (
                    <div key={job.id} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px", position: "relative" }}>
                        <div style={{ position: "absolute", right: 8, top: 8, display: "flex", gap: 6 }}>
                            <button onClick={() => startEdit(job)} style={{ padding: "4px 8px" }}>Edit</button>
                            <button onClick={() => handleDeleteClick(job.id)} style={{ padding: "4px 8px" }}>Delete</button>
                        </div>
                        <h3>{job.title}</h3>
                        <p>{job.description}</p>
                        <p>Salary: {job.salary}</p>
                        <p>Company ID: {job.company_id}</p>
                    </div>
                ))
            )}

            <h3>Add Job</h3>
            <input
                type="text"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="Title"
            />
            <input
                type="text"
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                placeholder="Description"
            />
            <input
                type="text"
                value={jobForm.salary}
                onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                placeholder="Salary"
            />
            <select
                value={jobForm.company_id}
                onChange={(e) => setJobForm({ ...jobForm, company_id: Number(e.target.value) })}
            >
                {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                        {company.name}
                    </option>
                ))}
            </select>
            <button onClick={handleAdd}>Add Job</button>
        </div>
    );
}

export default JobCard