import request from "../utils/request";

// Tìm kiếm người dùng (GET /users?page=1&limit=10)
export const searchUsers = () => {
    return request.get("/users");
};

// Tạo người dùng mới (POST /users)
export const createUsers = (data) => {
    return request.post("/users", data);
};

// Lấy thông tin người dùng theo ID (GET /users/{id})
export const getUsersById = (id) => {
    return request.get(`/users/${id}`);
};

// Cập nhật thông tin người dùng (PUT /users/{id})
export const updateUsers = (id, data) => {
    return request.put(`/users/${id}`, data);
};

// Xóa người dùng (DELETE /users/{id})
export const deleteUsers = (id) => {
    return request.delete(`/users/${id}`);
};

