import api from "./api";

export interface ResumeRequest {
    resume_text: string;
}

export interface ResumeResponse {
    analysis: string;
}

export async function analyzeResume(request: ResumeRequest): Promise<ResumeResponse> {
    const response = await api.post<ResumeResponse>("/rag/analyse-resume", request);
    return response.data;
}
