import axios from "axios";

const BASE_URL = "https://your-backend.onrender.com";

export const getTasks = async () => {
    const res = await axios.get(BASE_URL + "/tasks");
    return res.data;
}

export const createTask = async (data) => {
    const res = await axios.post(BASE_URL + "/tasks", data);
    return res.data;
}

export const deleteTask = async (id) => {
    const res = await axios.delete(BASE_URL + "/tasks/" + id);
    return res.data;
};

export const updateTask = async (id, data) => {
    const res = axios.put(BASE_URL + "/tasks/" + id, data);
    return res.data;
};