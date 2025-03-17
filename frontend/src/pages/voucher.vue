<template>
  <div style="display: flex; flex-direction: column; height: 600px">
    <!-- Header -->
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding: 10px;
        background: #f5f5f5;
      "
    >
      <h3 style="margin: 0">Bảng dữ liệu: Voucher</h3>
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
                <a-menu-item @click="editVoucher(record.id)">
                  <EditOutlined /> Sửa
                </a-menu-item>
                <a-menu-item danger @click="confirmdeleteVouchers(record.id)">
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
      title="Thêm voucher mới"
      @ok="handlecreateVouchers"
    >
      <a-form :model="newVoucher">
        <a-form-item label="Mã Giảm Giá">
          <a-input v-model:value="newVoucher.code" />
        </a-form-item>
        <a-form-item label="Loại Giảm Giá">
          <a-select v-model:value="newVoucher.discount_type">
            <a-select-option value="percentage">Phần trăm</a-select-option>
            <a-select-option value="fixed">Cố định</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Giá Trị Giảm">
          <a-input v-model:value="newVoucher.discount_value" type="number" />
        </a-form-item>
        <a-form-item label="Đơn Hàng Tối Thiểu">
          <a-input v-model:value="newVoucher.min_order_value" type="number" />
        </a-form-item>
        <a-form-item label="Ngày Bắt Đầu">
          <a-date-picker v-model:value="newVoucher.start_date" />
        </a-form-item>
        <a-form-item label="Ngày Hết Hạn">
          <a-date-picker v-model:value="newVoucher.expiry_date" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Modal Chỉnh Sửa -->
    <a-modal
      v-model:open="isEditModalVisible"
      title="Chỉnh sửa voucher"
      @ok="handleupdateVouchers"
    >
      <a-form :model="editVoucherData">
        <a-form-item label="Mã Giảm Giá">
          <a-input v-model:value="editVoucherData.code" />
        </a-form-item>
        <a-form-item label="Loại Giảm Giá">
          <a-select v-model:value="editVoucherData.discount_type">
            <a-select-option value="percentage">Phần trăm</a-select-option>
            <a-select-option value="fixed">Cố định</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Giá Trị Giảm">
          <a-input
            v-model:value="editVoucherData.discount_value"
            type="number"
          />
        </a-form-item>
        <a-form-item label="Đơn Hàng Tối Thiểu">
          <a-input
            v-model:value="editVoucherData.min_order_value"
            type="number"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Modal Xóa -->
    <a-modal
      v-model:open="isDeleteConfirmVisible"
      title="Xác nhận xóa"
      @ok="handledeleteVouchers"
    >
      <p>Bạn có chắc chắn muốn xóa voucher này?</p>
    </a-modal>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import {
  getVouchers,
  getVouchersById,
  createVouchers,
  updateVouchers,
  deleteVouchers,
} from "../services/voucher.service";
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
    const isDeleteConfirmVisible = ref(false);
    const deleteVouchersId = ref(null);

    // Data mẫu
    const newVoucher = ref({
      code: "",
      discount_type: "percentage",
      discount_value: 0,
      min_order_value: 0,
      start_date: null,
      expiry_date: null,
    });

    const editVoucherData = ref({});

    const columns = [
      { title: "ID", dataIndex: "id", key: "id" },
      { title: "Mã Giảm Giá", dataIndex: "code", key: "code" },
      { title: "Loại", dataIndex: "discount_type", key: "discount_type" },
      { title: "Giá Trị", dataIndex: "discount_value", key: "discount_value" },
      {
        title: "Tối Thiểu",
        dataIndex: "min_order_value",
        key: "min_order_value",
      },
      { title: "Ngày Bắt Đầu", dataIndex: "start_date", key: "start_date" },
      { title: "Ngày Hết Hạn", dataIndex: "expiry_date", key: "expiry_date" },
      {
        title: "Thao tác",
        key: "action",
        slots: { customRender: "action" },
        align: "center",
      },
    ];

    const fetchVouchers = async () => {
      loading.value = true;
      try {
        const response = await getVouchers();
        data.value = response.data;
      } catch (error) {
        message.error("Không thể tải danh sách vouchers!");
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchVouchers);

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

    // Thêm voucher mới
    const openAddModal = () => (isAddModalVisible.value = true);
    const handlecreateVouchers = async () => {
      try {
        await createVouchers(newVoucher.value);
        message.success("Voucher đã được thêm thành công");
        isAddModalVisible.value = false;
        fetchVouchers();
      } catch (error) {
        message.error("Lỗi khi thêm voucher!");
      }
    };

    // Sửa voucher
    const editVoucher = async (id) => {
      try {
        loading.value = true;
        const response = await getVouchersById(id);

        console.log("Dữ liệu lấy từ API:", response.data); // Kiểm tra API trả về gì

        editVoucherData.value = { ...response.data[0] }; // Gán dữ liệu vào form
        console.log("Dữ liệu sau khi gán:", editVoucherData.value); // Kiểm tra dữ liệu sau khi gán

        isEditModalVisible.value = true; // Hiển thị modal sửa
      } catch (error) {
        message.error("Lỗi khi lấy dữ liệu voucher!");
      } finally {
        loading.value = false;
      }
    };

    const handleupdateVouchers = async () => {
      try {
        await updateVouchers(editVoucherData.value.id, editVoucherData.value);
        message.success("Cập nhập voucher thành công!");
        isEditModalVisible.value = false;
        fetchVouchers();
      } catch (error) {
        message.error("Lỗi khi cập nhập voucher!");
      }
    };

    // Xóa voucher
    const confirmdeleteVouchers = (id) => {
      deleteVouchersId.value = id;
      isDeleteConfirmVisible.value = true;
    };
    const handledeleteVouchers = async () => {
      try {
        console.log("Đang xóa voucher với ID:", deleteVouchersId.value);
        const response = await deleteVouchers(deleteVouchersId.value);
        console.log("Response từ API:", response);

        message.success("Xóa thành công!");
        isDeleteConfirmVisible.value = false;
        fetchVouchers();
      } catch (error) {
        console.error("Lỗi khi xóa voucher:", error);
        message.error("Không thể xóa voucher!");
      }
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
      newVoucher,
      editVoucherData,
      isDeleteConfirmVisible,
      openAddModal,
      handlecreateVouchers,
      editVoucher,
      handleupdateVouchers,
      confirmdeleteVouchers,
      handledeleteVouchers,
      handlePageChange,
      handlePageSizeChange,
    };
  },
};
</script>
