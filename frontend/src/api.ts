export type User = {
  id: number;
  login: string;
  name: string;
};

export type Tag = {
  id: number;
  title: string;
  approved: boolean;
};

export type Section = {
  id: number;
  title: string;
  description: string | null;
  counter: number;
  approved: boolean;
  tag_ids: number[];
};

export type Rule = {
  id: number;
  section_id: number;
  description: string | null;
  rule: string;
  checks: string | null;
  counter: number;
  approved: boolean;
  tag_ids: number[];
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  if (res.status === 204) {
    return undefined as T;
  }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { error?: string }).error || res.statusText);
  }
  return body as T;
}

export const api = {
  auth: {
    me: () => request<User>("/api/auth/me"),
    login: (data: { login: string; password: string }) =>
      request<User>("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
    logout: () => request<void>("/api/auth/logout", { method: "POST" }),
  },
  users: {
    list: () => request<User[]>("/api/users"),
    create: (data: { login: string; password: string; name: string }) =>
      request<User>("/api/users", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: { login?: string; password?: string; name?: string }) =>
      request<User>(`/api/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/api/users/${id}`, { method: "DELETE" }),
  },
  sections: {
    list: () => request<Section[]>("/api/sections"),
    create: (data: Partial<Section>) =>
      request<Section>("/api/sections", { method: "POST", body: JSON.stringify(data) }),
    propose: (data: { title: string; description?: string | null; tag_ids?: number[] }) =>
      request<Section>("/api/sections/propose", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Section>) =>
      request<Section>(`/api/sections/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/api/sections/${id}`, { method: "DELETE" }),
    attachTag: (id: number, tagId: number) =>
      request<Section>(`/api/sections/${id}/tags/${tagId}`, { method: "PUT" }),
    detachTag: (id: number, tagId: number) =>
      request<Section>(`/api/sections/${id}/tags/${tagId}`, { method: "DELETE" }),
  },
  rules: {
    list: (params?: { section_id?: number; tag_id?: number }) => {
      const query = new URLSearchParams();
      if (params?.section_id) query.set("section_id", String(params.section_id));
      if (params?.tag_id) query.set("tag_id", String(params.tag_id));
      const suffix = query.toString() ? `?${query}` : "";
      return request<Rule[]>(`/api/rules${suffix}`);
    },
    create: (data: Partial<Rule> & { section_id: number; rule: string }) =>
      request<Rule>("/api/rules", { method: "POST", body: JSON.stringify(data) }),
    propose: (data: {
      section_id: number;
      rule: string;
      checks?: string | null;
      description?: string | null;
      tag_ids?: number[];
    }) => request<Rule>("/api/rules/propose", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Rule>) =>
      request<Rule>(`/api/rules/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    increment: (id: number) =>
      request<Rule>(`/api/rules/${id}/counter`, { method: "POST" }),
    remove: (id: number) => request<void>(`/api/rules/${id}`, { method: "DELETE" }),
    attachTag: (id: number, tagId: number) =>
      request<Rule>(`/api/rules/${id}/tags/${tagId}`, { method: "PUT" }),
    detachTag: (id: number, tagId: number) =>
      request<Rule>(`/api/rules/${id}/tags/${tagId}`, { method: "DELETE" }),
  },
  tags: {
    list: () => request<Tag[]>("/api/tags"),
    create: (data: Partial<Tag>) =>
      request<Tag>("/api/tags", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Tag>) =>
      request<Tag>(`/api/tags/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/api/tags/${id}`, { method: "DELETE" }),
  },
};
