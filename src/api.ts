// src/api.ts
// API utility for CRUD operations (users & doors)

export const API_BASE_URL = 'http://localhost:3000/api'; // Change to your backend URL

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
