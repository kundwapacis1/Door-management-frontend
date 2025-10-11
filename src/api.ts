// src/api.ts
// API utility for CRUD operations (users & doors)

export const API_BASE_URL = 'http://localhost:3001/api'; // Your Node.js backend URL

// User CRUD
export async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/users`);
  return res.json();
}

export async function getUser(id: string) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`);
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createUser(data: any) {
  const res = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateUser(id: string, data: any) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Password management functions
export async function resetUserPassword(id: string, newPassword: string) {
  const res = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: newPassword }),
  });
  return res.json();
}

export async function generateUserPassword() {
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Door CRUD
export async function getDoors() {
  const res = await fetch(`${API_BASE_URL}/doors`);
  return res.json();
}

export async function getDoor(id: string) {
  const res = await fetch(`${API_BASE_URL}/doors/${id}`);
  return res.json();
}

export async function createDoor(data: unknown) {
  const res = await fetch(`${API_BASE_URL}/doors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

interface DoorData {
  name: string;
  location: string;
  status: string;
}

export async function updateDoor(id: string, data: DoorData) {
  const res = await fetch(`${API_BASE_URL}/doors/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteDoor(id: string) {
  const res = await fetch(`${API_BASE_URL}/doors/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Door Control Functions
export async function controlDoor(doorId: string, action: 'open' | 'close' | 'lock' | 'unlock') {
  const res = await fetch(`${API_BASE_URL}/doors/${doorId}/control`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action }),
  });
  return res.json();
}

export async function getDoorStatuses() {
  const res = await fetch(`${API_BASE_URL}/doors/statuses`);
  return res.json();
}

// Dashboard Functions
export async function getDashboardStats() {
  const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
  return res.json();
}