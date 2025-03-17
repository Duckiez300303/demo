import axios from "axios";
import config from "../constants/config"

const request = axios.create({
    baseURL: config.BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true // Cho phép gửi cookies nếu cần
});


// Thêm interceptors để xử lý response và lỗi
request.interceptors.response.use(
    (response) => response.data, // Tự động lấy `data`
    (error) => {
        console.error("API Error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export default request;
