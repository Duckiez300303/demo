<template>
  <div style="display: flex; flex-direction: column; height: 600px">
    <!-- Header bảng -->
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background: #f5f5f5;
      "
    >
      <h3 style="margin: 0">Bảng dữ liệu: User</h3>
      <a-button type="primary" @click="openAddModal">Thêm mới</a-button>
    </div>

    <!-- Table -->
    <div style="flex: 1; overflow-y: auto">
      <a-table
        :dataSource="paginatedData"
        :columns="columns"
        :loading="loading"
        :pagination="false"
        bordered
        rowKey="id"
      >
        <template #action="{ record }">
          <a-dropdown>
            <a-button type="text">
              <template #icon>
                <SettingOutlined />
              </template>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item @click="editUser(record.id)">
                  <EditOutlined /> Sửa
                </a-menu-item>
                <a-menu-item danger @click="confirmDeleteUser(record.id)">
                  <DeleteOutlined /> Xóa
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </a-table>
    </div>

    <!-- Pagination -->
    <div
      style="
        padding: 10px;
        background: #fff;
        border-top: 1px solid #ddd;
        text-align: center;
      "
    >
      <a-pagination
        :total="data.length"
        :pageSize="pageSize"
        :current="currentPage"
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
        :showSizeChanger="true"
        :pageSizeOptions="[5, 10, 15, 20, 50]"
      />
    </div>

    <!-- Modal Thêm Mới -->
    <a-modal
      v-model:open="isAddModalVisible"
      title="Thêm người dùng mới"
      @ok="handlecreateUsers"
    >
      <a-form :model="newUser">
        <a-form-item label="Họ và Tên">
          <a-input v-model:value="newUser.name" />
        </a-form-item>
        <a-form-item label="Email">
          <a-input v-model:value="newUser.email" />
        </a-form-item>
        <a-form-item label="Mật khẩu">
          <a-input type="password" v-model:value="newUser.password" />
        </a-form-item>
        <a-form-item label="Vai Trò">
          <a-select v-model:value="newUser.role">
            <a-select-option value="admin">Admin</a-select-option>
            <a-select-option value="staff">Staff</a-select-option>
            <a-select-option value="customer">Customer</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Modal Chỉnh Sửa -->
    <a-modal
      v-model:open="isEditModalVisible"
      title="Chỉnh sửa người dùng"
      @ok="handleupdateUsers"
    >
      <a-form :model="editUserData">
        <a-form-item label="Họ và Tên">
          <a-input v-model:value="editUserData.name" />
        </a-form-item>
        <a-form-item label="Email">
          <a-input v-model:value="editUserData.email" />
        </a-form-item>
        <a-form-item label="Vai Trò">
          <a-select v-model:value="editUserData.role">
            <a-select-option value="admin">Admin</a-select-option>
            <a-select-option value="staff">Staff</a-select-option>
            <a-select-option value="customer">Customer</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Modal Xóa -->
    <a-modal
      v-model:open="isDeleteConfirmVisible"
      title="Xác nhận xóa"
      @ok="handleDeleteUser"
    >
      <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
    </a-modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import {
  searchUsers,
  getUsersById,
  createUsers,
  updateUsers,
  deleteUsers,
} from "../services/user.service";
import { message } from "ant-design-vue";
import {
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons-vue";

export default {
  components: {
    SettingOutlined,
    EditOutlined,
    DeleteOutlined,
  },
  setup() {
    const data = ref([]);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const loading = ref(false);

    // Modal state
    const isAddModalVisible = ref(false);
    const isEditModalVisible = ref(false);
    const isDeleteConfirmVisible = ref(false); // Modal Xác nhận xóa
    const deleteUserId = ref(null);

    // Dữ liệu người dùng
    const newUser = ref({
      name: "",
      email: "",
      password: "",
      role: "",
    });

    const editUserData = ref({
      name: "",
      email: "",
      role: "",
    });

    const columns = [
      { title: "ID", dataIndex: "id", key: "id" },
      {
        title: "Thao tác",
        key: "action",
        slots: { customRender: "action" },
        align: "center",
      },
      { title: "Họ và Tên", dataIndex: "name", key: "name" },
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Vai Trò", dataIndex: "role", key: "role" },
    ];

    // Lấy danh sách người dùng
    const fetchUsers = async () => {
      loading.value = true;
      try {
        const response = await searchUsers();
        if (response.data) {
          data.value = response.data;
        }
      } catch (error) {
        message.error("Không thể tải danh sách người dùng!");
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchUsers);

    // Phân trang
    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      return data.value.slice(start, start + pageSize.value);
    });

    const handlePageChange = (page) => {
      currentPage.value = page;
    };

    const handlePageSizeChange = (current, size) => {
      pageSize.value = size;
      currentPage.value = 1;
    };

    // Thêm người dùng mới
    const openAddModal = () => {
      isAddModalVisible.value = true;
    };

    const handlecreateUsers = async () => {
      try {
        await createUsers(newUser.value);
        message.success("Người dùng đã được thêm thành công!");
        isAddModalVisible.value = false;
        fetchUsers();
      } catch (error) {
        message.error("Lỗi khi thêm người dùng!");
      }
    };

    // Sửa người dùng
    const editUser = async (userId) => {
      try {
        loading.value = true;
        const response = await getUsersById(userId);

        console.log("Dữ liệu lấy từ API:", response.data); // Kiểm tra API trả về gì

        editUserData.value = { ...response.data[0] }; // Gán dữ liệu vào form
        console.log("Dữ liệu sau khi gán:", editUserData.value); // Kiểm tra dữ liệu sau khi gán

        isEditModalVisible.value = true; // Hiển thị modal sửa
      } catch (error) {
        message.error("Lỗi khi lấy dữ liệu người dùng!");
      } finally {
        loading.value = false;
      }
    };

    const handleupdateUsers = async () => {
      try {
        await updateUsers(editUserData.value.id, editUserData.value);
        message.success("Cập nhật người dùng thành công!");
        isEditModalVisible.value = false;
        fetchUsers();
      } catch (error) {
        message.error("Lỗi khi cập nhật người dùng!");
      }
    };

    //Xóa người dùng
    const confirmDeleteUser = (id) => {
      deleteUserId.value = id;
      isDeleteConfirmVisible.value = true;
    };
    const handleDeleteUser = async () => {
      await deleteUsers(deleteUserId.value);
      message.success("Xóa thành công!");
      isDeleteConfirmVisible.value = false;
      fetchUsers();
    };

    return {
      data,
      columns,
      paginatedData,
      currentPage,
      pageSize,
      loading,
      isAddModalVisible,
      isEditModalVisible,
      newUser,
      editUserData,
      openAddModal,
      handlecreateUsers,
      editUser,
      handleupdateUsers,
      confirmDeleteUser,
      isDeleteConfirmVisible,
      handleDeleteUser,
      handlePageChange,
      handlePageSizeChange,
    };
  },
};
</script>
