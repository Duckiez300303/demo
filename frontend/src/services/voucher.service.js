import request from "../utils/request";

// Lấy danh sách vouchers (GET /vouchers?page=1&limit=10)
export const getVouchers = (params) => {
    return request.get("/vouchers", { params });
};

// Lấy chi tiết một vouchers theo ID (GET /vouchers/{id})
export const getVouchersById = (id) => {
    return request.get(`/vouchers/${id}`);
};

// Tạo mới vouchers (POST /vouchers)
export const createVouchers = (data) => {
    return request.post("/vouchers", data, {
        headers: { "Content-Type": "application/json" }
    });
};

// Cập nhật vouchers theo ID (PUT /vouchers/{id})
export const updateVouchers = (id, data) => {
    return request.put(`/vouchers/${id}`, data, {
        headers: { "Content-Type": "application/json" }
    });
};

// Xóa vouchers theo ID (DELETE /vouchers/{id})
export const deleteVouchers = (id) => {
    return request.delete(`/vouchers/${id}`);
};
