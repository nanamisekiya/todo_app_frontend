import axios from "axios";

const API_URL = 'http://localhost:3000';

axios.defaults.withCredentials = true;

export const getTasks = () => axios.get(`${API_URL}/tasks`);
export const createTask = (title: string) => axios.post(`${API_URL}/tasks`, { task: { title } });
export const updateTask = (id: number, data: Partial<{ title: string; completed: boolean; time_spend: number; }>) => axios.put(`${API_URL}/tasks/${id}`, { task: data });
export const deleteTask = (id: number) => axios.delete(`${API_URL}/tasks/${id}`);
export const startTimer = (id: number) => axios.post(`${API_URL}/tasks/${id}/start_timer`);
export const stopTimer = (id: number) => axios.patch(`${API_URL}/tasks/${id}/stop_timer`);