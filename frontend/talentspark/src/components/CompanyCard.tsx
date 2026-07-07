import type { Company } from "../types/company";
import { useState } from "react";

type Props = {
    companies: Company[];
    onedit: (company: Company) => void;
    ondelete: (id: number) => void;
    onadd: (company: Company) => void;
};

function CompanyCard({ companies, onadd, onedit, ondelete }: Props) {
    const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
    const [addForm, setAddForm] = useState<Company>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        location: "",
        jobs: [],
    });
    const [editForm, setEditForm] = useState<Company>({
        id: 0,
        name: "",
        email: "",
        phone: "",
        location: "",
        jobs: [],
    });

    const handleAdd = () => {
        onadd(addForm);
        setAddForm({
            id: 0,
            name: "",
            email: "",
            phone: "",
            location: "",
            jobs: [],
        });
    };

    const handleSave = () => {
        onedit(editForm);
        setEditForm({
            id: 0,
            name: "",
            email: "",
            phone: "",
            location: "",
            jobs: [],
        });
        setEditCompanyId(null);
    };

    const handleCancel = () => {
        setEditCompanyId(null);
        setEditForm({
            id: 0,
            name: "",
            email: "",
            phone: "",
            location: "",
            jobs: [],
        });
    };

    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">
                    <span className="card-icon">🏢</span>
                    Companies
                </h2>
                <span className="badge">{companies.length} Total</span>
            </div>

            {companies.length === 0 ? (
                <div style={{ 
                    textAlign: "center", 
                    padding: "40px 20px",
                    color: "var(--text-secondary)"
                }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                    <p>No companies found. Add your first company below!</p>
                </div>
            ) : (
                companies.map((company) => (
                    <div key={company.id} className="company-card">
                        {editCompanyId === company.id ? (
                            <div className="form-row">
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder="Company name"
                                />
                                <input
                                    type="email"
                                    className="form-input"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                    placeholder="Company email"
                                />
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    placeholder="Company phone"
                                />
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editForm.location}
                                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    placeholder="Company location"
                                />
                            </div>
                        ) : (
                            <div className="company-header">
                                <div>
                                    <h3>{company.name}</h3>
                                    <p>📧 {company.email}</p>
                                    <p>📱 {company.phone}</p>
                                    <p>📍 {company.location}</p>
                                    {company.jobs && company.jobs.length > 0 && (
                                        <div style={{ marginTop: "12px" }}>
                                            <span style={{ 
                                                fontSize: "12px", 
                                                color: "var(--text-muted)",
                                                background: "var(--surface-alt)",
                                                padding: "4px 10px",
                                                borderRadius: "12px"
                                            }}>
                                                {company.jobs.length} job{company.jobs.length > 1 ? 's' : ''} posted
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="company-actions">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setEditCompanyId(company.id);
                                            setEditForm({ ...company });
                                        }}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => ondelete(company.id)}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        )}

                        {editCompanyId === company.id && (
                            <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                                <button className="btn btn-success" onClick={handleSave}>
                                    💾 Save
                                </button>
                                <button className="btn btn-secondary" onClick={handleCancel}>
                                    ❌ Cancel
                                </button>
                            </div>
                        )}
                    </div>
                ))
            )}

            <div style={{ marginTop: "24px" }}>
                <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>➕</span> Add New Company
                </h3>
                <div className="form-row">
                    <input
                        type="text"
                        className="form-input"
                        value={addForm.name}
                        onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                        placeholder="Company name"
                    />
                    <input
                        type="email"
                        className="form-input"
                        value={addForm.email}
                        onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                        placeholder="Company email"
                    />
                    <input
                        type="tel"
                        className="form-input"
                        value={addForm.phone}
                        onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                        placeholder="Company phone"
                    />
                    <input
                        type="text"
                        className="form-input"
                        value={addForm.location}
                        onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
                        placeholder="Company location"
                    />
                </div>
                <button className="btn btn-primary" onClick={handleAdd}>
                    🚀 Add Company
                </button>
            </div>
        </div>
    );
}

export default CompanyCard;