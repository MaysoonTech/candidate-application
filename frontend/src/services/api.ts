const BASE_URL = "http://localhost:8000/api/v1";

export const registerCandidate = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/candidates/`, {
    method: "POST",
    body: formData,
  });
  return await res.json();
};

export const getCandidateStatus = async (id: number) => {
  const res = await fetch(`${BASE_URL}/candidates/${id}/status`);
  return await res.json();
};

export const listCandidates = async (token: string, skip: number = 0, limit: number = 10) => {
  const res = await fetch(`${BASE_URL}/admin/candidates/?skip=${skip}&limit=${limit}`, {
    headers: { "X-ADMIN": token },
  });
  return await res.json();
};

export const updateCandidateStatus = async (
  id: number,
  data: { status: string; feedback?: string },
  token: string
) => {
  const res = await fetch(`${BASE_URL}/admin/candidates/${id}/status`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-ADMIN": token,
    },
    body: JSON.stringify(data),
  });
  return await res.json();
};

export const getCandidateStatusHistory = async (id: number) => {
  const res = await fetch(`${BASE_URL}/candidates/${id}/status`);
  return await res.json();
};

