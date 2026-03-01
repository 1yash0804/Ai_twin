const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// ─── Response Types ───────────────────────────────────────────────────────────

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

export type TelegramMessage = {
  id: number;
  external_message_id: string;
  source: string;
  raw_payload: string;
  created_at: string;
};

export type TelegramTask = {
  id: number;
  title?: string | null;
  description: string;
  due_date?: string | null;
  priority: "low" | "medium" | "high";
  confidence_score: number;
  created_at: string;
};

export type TelegramMemory = {
  id: number;
  text: string;
  created_at: string;
};

export type TelegramOverviewResponse = {
  messages: TelegramMessage[];
  tasks: TelegramTask[];
  memories: TelegramMemory[];
};

export type Task = {
  id: number;
  user_id: string;
  title?: string | null;
  description: string;
  status: string;
  due_date?: string | null;
  priority: "low" | "medium" | "high";
  confidence_score: number;
  source?: string | null;
  created_at: string;
};

export type Memory = {
  id: number;
  user_id: string;
  text: string;
  source: string;
  created_at: string;
};

export type TaskCreatePayload = {
  title: string;
  description: string;
  priority?: "low" | "medium" | "high";
  due_date?: string | null;
};

// ─── OTP Types ────────────────────────────────────────────────────────────────

export type SignupOtpRequestPayload = {
  username: string;
  email: string;
  password: string;
};

export type OtpSentResponse = {
  status: string;
  email?: string;
  username?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Auth ─────────────────────────────────────────────────────────────────────

/** Legacy direct signup — no OTP. Kept for backward compat. */
export async function createUser(payload: UserCreatePayload) {
  const response = await fetch(`${API_BASE_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, is_active: payload.is_active ?? true }),
  });
  return parseJson(response);
}

/** Legacy direct login — no OTP. */
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

// ─── Signup OTP ───────────────────────────────────────────────────────────────

/** Step 1: Submit signup details — triggers OTP email. */
export async function requestSignupOtp(
  payload: SignupOtpRequestPayload
): Promise<OtpSentResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/request-signup-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<OtpSentResponse>(response);
}

/** Step 2: Verify signup OTP — creates the user account. */
export async function verifySignupOtp(email: string, otp: string) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-signup-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  return parseJson(response);
}

// ─── Login OTP ────────────────────────────────────────────────────────────────

/** Step 1: Validate credentials — triggers OTP email. */
export async function requestLoginOtp(
  username: string,
  password: string
): Promise<OtpSentResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/request-login-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parseJson<OtpSentResponse>(response);
}

/** Step 2: Verify login OTP — returns access token. */
export async function verifyLoginOtp(
  username: string,
  otp: string
): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/verify-login-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, otp }),
  });
  return parseJson<LoginResponse>(response);
}

// ─── Dashboard Data ───────────────────────────────────────────────────────────

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

export async function fetchMeTasks(token: string): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/me/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return parseJson<Task[]>(response);
}

export async function createTask(token: string, payload: TaskCreatePayload): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/me/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  return parseJson<Task>(response);
}

export async function fetchMeMemories(token: string): Promise<Memory[]> {
  const response = await fetch(`${API_BASE_URL}/me/memories`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return parseJson<Memory[]>(response);
}

export async function fetchTelegramOverview(token: string): Promise<TelegramOverviewResponse> {
  const response = await fetch(`${API_BASE_URL}/me/telegram/overview`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  return parseJson<TelegramOverviewResponse>(response);
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  response: string;
  intent: string;
  used_model: string;
};

export async function chatWithTwin(
  token: string,
  query: string
): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, model_type: "general" }),
  });
  return parseJson<ChatResponse>(response);
}

export { API_BASE_URL };