<template>
  <div style="display: flex; flex-direction: column; height: 600px">
    <div style="flex: 1; overflow-y: auto">
      <a-table
        :dataSource="paginatedData"
        :columns="columns"
        :pagination="false"
        bordered
      />
    </div>
    <div
      style="
        padding: 10px;
        background: #fff;
        border-top: 1px solid #ddd;
        text-align: center;
      "
    >
      <a-pagination
        :total="groupedUserVoucher.length"
        :pageSize="pageSize"
        :current="currentPage"
        @change="handlePageChange"
        @showSizeChange="handlePageSizeChange"
        :showSizeChanger="true"
        :pageSizeOptions="['5', '10', '15', '20', '50']"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: Array.from({ length: 100 }, (_, i) => ({
        userId: i + 1,
        userName: `User ${i + 1}`,
      })),
      vouchers: Array.from({ length: 100 }, (_, i) => ({
        voucherId: i + 1,
        voucherCode: `VC-${1000 + i}`,
      })),
      // Quan hệ nhiều - nhiều (1 user có thể có nhiều voucher)
      userVoucherData: Array.from({ length: 40 }, () => ({
        userId: Math.floor(Math.random() * 100) + 1,
        voucherId: Math.floor(Math.random() * 100) + 1,
      })),
      columns: [
        { title: "STT", dataIndex: "stt", key: "stt" },
        { title: "User Name", dataIndex: "userName", key: "userName" },
        {
          title: "Voucher Code",
          dataIndex: "voucherCode",
          key: "voucherCode",
          customRender: ({ text }) => text.join(", "), // Hiển thị danh sách voucher
        },
      ],
      currentPage: 1,
      pageSize: 5,
    };
  },
  computed: {
    groupedUserVoucher() {
      const grouped = this.userVoucherData.reduce((acc, item) => {
        const user = this.users.find((u) => u.userId === item.userId);
        const voucher = this.vouchers.find(
          (v) => v.voucherId === item.voucherId
        );

        if (!user || !voucher) return acc;

        const existingUser = acc.find((u) => u.userId === user.userId);
        if (existingUser) {
          existingUser.voucherCode.push(voucher.voucherCode);
        } else {
          acc.push({
            userId: user.userId,
            userName: user.userName,
            voucherCode: [voucher.voucherCode],
          });
        }
        return acc;
      }, []);

      // Sắp xếp mảng theo userId (hoặc có thể theo userName nếu muốn)
      const sorted = grouped.sort((a, b) => a.userId - b.userId);

      // Thêm số thứ tự (STT) cho mỗi phần tử
      return sorted.map((item, index) => ({
        stt: index + 1,
        ...item,
      }));
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.groupedUserVoucher.slice(start, end);
    },
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
    },
    handlePageSizeChange(current, size) {
      this.pageSize = size;
      this.currentPage = 1; // Reset về trang đầu khi đổi pageSize
    },
  },
};
</script>
