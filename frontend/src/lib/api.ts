const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type UserCreatePayload = {
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
};

export type StatsResponse = {
  messages_responded: number;
  tasks_extracted: number;
  memories_created: number;
};

export type ActivityItem = {
  id: string;
  type: "memory" | "task";
  text: string;
  created_at: string;
  source: string;
  status?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const fallback = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      throw new Error(data.detail ?? fallback);
    } catch {
      throw new Error(fallback);
    }
  }

  return (await response.json()) as T;
}

export async function createUser(payload: UserCreatePayload) {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, is_active: payload.is_active ?? true }),
  });

  return parseJson(response);
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  return parseJson<LoginResponse>(response);
}

export async function fetchMeStats(token: string): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE_URL}/me/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return parseJson<StatsResponse>(response);
}

export async function fetchMeActivities(token: string): Promise<ActivityItem[]> {
  const response = await fetch(`${API_BASE_URL}/me/activities`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  return parseJson<ActivityItem[]>(response);
}

export { API_BASE_URL };
