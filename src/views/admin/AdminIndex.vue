<template>
  <div class="admin-container">
    <el-header class="header">
      <div class="header-left">
        <i class="el-icon-s-fold"></i>
        <span class="title">家电维修预约管理系统</span>
      </div>
      <div class="header-right">
        <el-dropdown>
          <span class="user-info">
            <img class="avatar" src="@/assets/avatar.png" alt="Avatar">
            <span>管理员</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="showProfile">个人信息</el-dropdown-item>
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-main class="main-content">
      <el-tabs v-model="activeTab" type="card">
        <!-- 维修工管理 -->
        <el-tab-pane label="维修工管理" name="employee">
          <div class="toolbar">
            <el-button type="primary" @click="showCreateDialog">新增员工</el-button>
            <el-input
              v-model="searchKeyword"
              placeholder="请输入手机号或姓名搜索"
              class="search-input"
              clearable
              @clear="handleSearchClear"
              @keyup.enter.native="searchEmployees"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchEmployees"/>
            </el-input>
          </div>

          <el-table
            :data="employees"
            border
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="id" label="ID" width="80"/>
            <el-table-column prop="nickname" label="用户名"/>
            <el-table-column prop="phone" label="手机号"/>
            <el-table-column prop="address" label="地址"/>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          />
        </el-tab-pane>

        <!-- 维修工单管理 -->
        <el-tab-pane label="维修工单管理" name="order">
          <div class="toolbar">
            <el-input
              v-model="searchOrderKeyword"
              placeholder="请输入工单号或客户手机号搜索"
              class="search-input"
              clearable
              @clear="handleOrderSearchClear"
              @keyup.enter.native="searchOrders"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchOrders"/>
            </el-input>
          </div>

          <el-table
            :data="orders"
            border
            style="width: 100%"
            v-loading="orderLoading"
          >
            <el-table-column prop="id" label="工单ID" width="100"/>
            <el-table-column prop="customerName" label="客户姓名"/>
            <el-table-column prop="customerPhone" label="客户手机号"/>
            <el-table-column prop="serviceType" label="服务类型"/>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag :type="getOrderStatusTagType(scope.row.status)">
                  {{ getOrderStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button 
                  size="mini" 
                  type="primary" 
                  v-if="scope.row.status === 'PENDING'"
                  @click="showAssignDialog(scope.row)"
                >
                  分配
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pagination"
            @size-change="handleOrderSizeChange"
            @current-change="handleOrderCurrentChange"
            :current-page="orderCurrentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="orderPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="orderTotal"
          />
        </el-tab-pane>

        <!-- 预约单管理 -->
        <el-tab-pane label="预约单管理" name="appointment">
          <div class="toolbar">
            <el-input
              v-model="searchAppointmentKeyword"
              placeholder="请输入预约单号或客户手机号搜索"
              class="search-input"
              clearable
              @clear="handleAppointmentSearchClear"
              @keyup.enter.native="searchAppointments"
            >
              <el-button slot="append" icon="el-icon-search" @click="searchAppointments"/>
            </el-input>
          </div>

          <el-table
            :data="appointments"
            border
            style="width: 100%"
            v-loading="appointmentLoading"
          >
            <el-table-column prop="id" label="预约单号" width="100"/>
            <el-table-column prop="nickname" label="客户姓名"/>
            <el-table-column prop="phone" label="客户手机号"/>
            <el-table-column prop="serviceTypeDesc" label="服务类型"/>
            <el-table-column prop="appointmentTime" label="预约时间"/>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
                <el-tag :type="getAppointmentStatusTagType(scope.row.status)">
                  {{ getAppointmentStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button 
                  size="mini" 
                  type="primary" 
                  v-if="scope.row.status === 'PENDING'"
                  @click="showAssignAppointmentDialog(scope.row)"
                >
                  分配
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            class="pagination"
            @size-change="handleAppointmentSizeChange"
            @current-change="handleAppointmentCurrentChange"
            :current-page="appointmentCurrentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="appointmentPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="appointmentTotal"
          />
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <!-- 个人信息弹窗 -->
    <el-dialog
      title="个人信息"
      :visible.sync="profileDialogVisible"
      width="30%"
      center
    >
      <el-form :model="profileData" label-width="100px">
        <el-form-item label="用户姓名">
          <el-input v-if="isEditing" v-model="profileData.name"></el-input>
          <span v-else>{{ profileData.name }}</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-if="isEditing" v-model="profileData.phone"></el-input>
          <span v-else>{{ profileData.phone }}</span>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-if="isEditing" v-model="profileData.email"></el-input>
          <span v-else>{{ profileData.email }}</span>
        </el-form-item>
        <el-form-item label="所属角色">
          <span>{{ profileData.role }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="!isEditing" type="primary" @click="toggleEdit">修 改</el-button>
        <el-button v-if="isEditing" type="primary" @click="saveProfile">保 存</el-button>
        <el-button v-if="isEditing" @click="toggleEdit">取 消</el-button>
        <el-button @click="profileDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 新增员工弹窗 -->
    <el-dialog
      title="新增员工"
      :visible.sync="createDialogVisible"
      width="500px"
      @closed="handleCreateDialogClose"
    >
      <el-form 
        ref="createForm"
        :model="formData" 
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="formData.username"
            placeholder="请输入登录用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="formData.password"
            type="password"
            placeholder="请输入登录密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input 
            v-model="formData.nickname"
            placeholder="请输入员工昵称"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="formData.phone"
            placeholder="请输入联系电话"
            clearable
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input 
            v-model="formData.address"
            placeholder="请输入联系地址"
            clearable
            type="textarea"
            :rows="2"
          />
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleCreate">确 定</el-button>
      </span>
    </el-dialog>

     <!-- 编辑员工弹窗 -->
     <el-dialog
      title="编辑员工"
      :visible.sync="editDialogVisible"
      width="500px"
      @closed="handleEditDialogClose"
    >
      <el-form 
        ref="editForm"
        :model="editFormData" 
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input 
            v-model="editFormData.nickname"
            placeholder="请输入员工昵称"
            clearable
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input 
            v-model="editFormData.phone"
            placeholder="请输入联系电话"
            clearable
            maxlength="11"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input 
            v-model="editFormData.address"
            placeholder="请输入联系地址"
            clearable
            type="textarea"
            :rows="2"
          />
        </el-form-item>
      </el-form>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="deleteDialogVisible"
      width="400px"
      center
    >
      <span style="text-align:center">确定要删除该员工吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="confirmDelete">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 其他对话框 -->
  </div>
</template>

<script>
export default {
  data() {
    return {
// 新增编辑相关数据
editDialogVisible: false,
      editFormData: {
        id: null,
        nickname: '',
        phone: '',
        address: ''
      },
      editFormRules: {
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ]
      },
      deleteDialogVisible: false,
      deletingId: null,

      // 新增员工相关数据
      formData: {
        username: '',
        password: '',
        nickname: '',
        phone: '',
        address: ''
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
          { min: 5, max: 50, message: '长度在 5 到 50 个字符', trigger: 'blur' }
        ]
      },

      activeTab: 'employee',
      profileDialogVisible: false,
      profileData: {
        name: '管理员',
        phone: '13800138000',
        email: 'admin@example.com',
        role: '系统管理员'
      },
      isEditing: false,
      // 员工管理数据
      employees: [],
      searchKeyword: '',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      loading: false,

      // 工单管理数据
      orders: [],
      searchOrderKeyword: '',
      orderCurrentPage: 1,
      orderPageSize: 10,
      orderTotal: 0,
      orderLoading: false,

      // 预约单管理数据
      appointments: [
        { id: 1, name: '张三', phone: '13800138000', address: '北京市海淀区', service: '洗车', status: '已完成' },
        { id: 2, name: '李四', phone: '13900139000', address: '上海市浦东新区', service: '保养', status: '进行中' },
        { id: 3, name: '王五', phone: '13700137000', address: '广州市天河区', service: '维修', status: '未开始' }
      ],
      searchAppointmentKeyword: '',
      appointmentCurrentPage: 1,
      appointmentPageSize: 10,
      appointmentTotal: 0,
      appointmentLoading: false,

      // 对话框数据
      createDialogVisible: false,
      assignDialogVisible: false,
      assignAppointmentDialogVisible: false,
      
      // 其他对话框数据...
    }
  },
  methods: {
    showProfile() {
      this.profileDialogVisible = true
      this.isEditing = false
      // 实际项目中应调用API获取最新信息
      // this.$axios.get('/api/profile').then(res => {
      //   this.profileData = res.data
      // })
    },
    
    toggleEdit() {
      this.isEditing = !this.isEditing
    },
    
    saveProfile() {
      this.isEditing = false
      // 实际项目中应调用API保存信息
      // this.$axios.post('/api/profile', this.profileData).then(res => {
      //   this.$message.success('保存成功')
      // })
    },
    
    // 获取员工列表
    fetchEmployees() {
      console.log("获取员工列表")
      this.loading = true
      // API调用
      this.$axios.get('/a/emps', { params: { keyword: this.searchKeyword, page: this.currentPage, size: this.pageSize } })
        .then(res => {
          this.employees = res.data.list
          this.total = res.data.total
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 添加员工信息
    handleCreate() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          // 模拟API调用
          console.log('提交员工数据:', this.formData)
          this.$axios.post('/a/emps', this.formData).then(() => {
            this.$message.success('创建成功')
            this.createDialogVisible = false
            this.fetchEmployees() // 刷新列表
          })
        }
      })
    },

    // 对话框关闭时重置表单
    handleCreateDialogClose() {
      this.$refs.createForm.resetFields()
    },

    // 员工管理方法
    showCreateDialog() {
      // 显示新增员工对话框逻辑
      this.createDialogVisible = true
      console.log('显示新增员工对话框')
    },
    
    // 编辑员工方法
    handleEdit(row) {
      this.editFormData = {
        id: row.id,
        nickname: row.nickname,
        phone: row.phone,
        address: row.address
      }
      this.editDialogVisible = true
    },

    // 编辑提交方法
    handleEditSubmit() {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          console.log('更新员工数据:', this.editFormData)
          this.$axios.put('/a/emps/', this.editFormData)
            .then(() => {
              this.$message.success('修改成功')
              this.editDialogVisible = false
              this.fetchEmployees()
            })
        }
      })
    },
    handleEditDialogClose() {
      this.$refs.editForm.resetFields()
    },
    // 删除员工方法
    handleDelete(id) {
      // 删除员工逻辑
      console.log('删除员工', id)
      this.deletingId = id
      this.deleteDialogVisible = true
    },
    
    confirmDelete() {
      this.$axios.delete(`/a/emps/${this.deletingId}`)
        .then(() => {
          this.$message.success('删除成功')
          this.deleteDialogVisible = false
          this.fetchEmployees()
        })
    },

    handleSearchClear() {
      this.searchKeyword = ''
      this.fetchEmployees()
    },
    
    searchEmployees() {
      // 员工搜索逻辑
      console.log('搜索员工', this.searchKeyword)
      this.fetchEmployees();
    },
    
    handleSizeChange(val) {
      this.pageSize = val
      this.fetchEmployees()
    },
    
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchEmployees()
    },
    
    // 工单管理方法
    handleOrderSearchClear() {
      this.searchOrderKeyword = ''
      this.fetchOrders()
    },
    
    searchOrders() {
      // 工单搜索逻辑
      console.log('搜索工单', this.searchOrderKeyword)
    },
    
    handleOrderSizeChange(val) {
      this.orderPageSize = val
      this.fetchOrders()
    },
    
    handleOrderCurrentChange(val) {
      this.orderCurrentPage = val
      this.fetchOrders()
    },
    
    showAssignDialog(row) {
      // 显示分配工单对话框逻辑
      console.log('分配工单', row)
    },
    
    // 预约单管理方法
    handleAppointmentSearchClear() {
      this.searchAppointmentKeyword = ''
      this.fetchAppointments()
    },
    
    searchAppointments() {
      // 预约单搜索逻辑
      console.log('搜索预约单', this.searchAppointmentKeyword)
      this.appointmentCurrentPage = 1
      this.fetchAppointments()
    },
    
    handleAppointmentSizeChange(val) {
      this.appointmentPageSize = val
      this.fetchAppointments()
    },
    
    handleAppointmentCurrentChange(val) {
      this.appointmentCurrentPage = val
      this.fetchAppointments()
    },
    
    showAssignAppointmentDialog(row) {
      // 显示分配预约单对话框逻辑
      console.log('分配预约单', row)
    },
    
    // 登出方法
    logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
      })
    },

    // 状态转换方法
    getOrderStatusText(status) {
      const map = { PENDING: '待处理', PROCESSING: '进行中', COMPLETED: '已完成' }
      return map[status] || status
    },
    
    getOrderStatusTagType(status) {
      const map = { PENDING: 'warning', PROCESSING: 'primary', COMPLETED: 'success' }
      return map[status] || ''
    },

    // 获取预约列表
  fetchAppointments() {
      this.appointmentLoading = true
      this.$axios.get('/a/app', {
        params: {
          page: this.appointmentCurrentPage,
          size: this.appointmentPageSize,
          keyword: this.searchAppointmentKeyword
        }
      }).then(res => {
        this.appointments = res.data.list
        this.appointmentTotal = res.data.total
      }).finally(() => {
        this.appointmentLoading = false
      })
    },
    // 修改预约状态映射方法
    getAppointmentStatusText(status) {
      const map = { 
        0: '待分配', 
        1: '已派单',
        2: '已完成',
        3: '已取消'
      }
      return map[status] || '未知状态'
    },
    
    getAppointmentStatusTagType(status) {
      const map = { 
        0: 'warning',  // 待处理
        1: 'primary',  // 已确认
        2: 'success',  // 已完成
        3: 'info'      // 已取消
      }
      return map[status] || ''
    },

  },
  
  mounted() {
    this.fetchEmployees()
    this.fetchAppointments()
    // 其他初始化调用...
  }
}
</script>

<style scoped>
.admin-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #409EFF;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-info:hover {
  background: rgba(255,255,255,0.1);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 8px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 15px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-table {
  margin-top: 15px;
}

/* 弹窗优化 */
.el-dialog__body {
  padding: 20px 25px;
}
</style>