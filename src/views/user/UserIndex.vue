<template>
  <div class="mobile-container">
    <!-- 顶部导航栏 -->
    <div class="mobile-header">
      <div class="header-title">设备维修服务</div>
      <el-dropdown trigger="click">
        <div class="user-info">
          <img class="avatar" src="@/assets/avatar.png" alt="头像">
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="switchView('profile')">个人信息</el-dropdown-item>
          <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 内容区域 -->
    <div class="mobile-content">
      <!-- 维修预约 -->
      <div v-show="currentView === 'appointment'">
        <el-tabs v-model="activeTab" class="mobile-tabs">
          <!-- 预约申请 -->
          <el-tab-pane label="立即预约" name="apply">
            <div class="form-card">
              <el-form ref="applyForm" :model="applyForm" :rules="applyRules">
                <el-form-item label="服务类型" prop="serviceType">
                  <el-select 
                    v-model="applyForm.serviceType"
                    placeholder="请选择"
                    class="full-width"
                  >
                    <el-option label="空调维修" value="空调维修"/>
                    <el-option label="冰箱维修" value="冰箱维修"/>
                    <el-option label="洗衣机维修" value="洗衣机维修"/>
                    <el-option label="电视维修" value="电视维修"/>
                    <el-option label="热水器维修" value="热水器维修"/>
                  </el-select>
                </el-form-item>

                <el-form-item label="预约时间" prop="appointmentTime">
                  <el-date-picker
                    v-model="applyForm.appointmentTime"
                    type="datetime"
                    placeholder="选择时间"
                    class="full-width"
                    value-format="yyyy-MM-dd HH:mm:ss"
                  />
                </el-form-item>

                <el-form-item label="详细地址" prop="address">
                  <el-input 
                    v-model="applyForm.address" 
                    placeholder="输入详细地址"
                    clearable
                  />
                </el-form-item>

                <el-form-item label="问题描述" prop="desc">
                  <el-input 
                    v-model="applyForm.desc" 
                    placeholder="输入问题描述"
                    clearable
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 5 }"
                  />
                </el-form-item>
                

                <div class="form-actions">
                  <el-button 
                    type="primary" 
                    class="submit-btn"
                    @click="createAppointment"
                    :loading="submitting"
                  >
                    立即提交
                  </el-button>
                  <el-button class="reset-btn" @click="resetApplyForm">清空</el-button>
                </div>
              </el-form>
            </div>
          </el-tab-pane>

          <!-- 预约记录 -->
          <el-tab-pane label="我的预约" name="list">
            <div class="list-container">
              <div 
                v-for="item in appointments"
                :key="item.id"
                class="list-card"
              >
                <div class="card-header">
                  <span class="service-type">{{ item.serviceType }}</span>
                  <el-tag 
                    :type="statusTagMap[item.status]"
                    size="mini"
                    class="status-tag"
                  >
                    {{ getStatusText(item.status) }}
                  </el-tag>
                </div>
                <div class="card-content">
                  <div class="info-item">
                    <i class="el-icon-time"></i>
                    {{ formatTime(item.appointmentTime) }}
                  </div>
                  <div class="info-item">
                    <i class="el-icon-location"></i>
                    {{ item.address }}
                  </div>
                </div>
                
                <div class="card-actions">
                  <el-button 
                    size="mini" 
                    class="action-btn"
                    @click="showDetailDialog(item)"
                  >
                    详情
                  </el-button>
                  <el-button 
                    v-if="item.status === 0"
                    size="mini" 
                    type="danger"
                    class="action-btn"
                    @click="showCancelDialog(item.id)"
                  >
                    取消
                  </el-button>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 个人信息 -->
      <div v-show="currentView === 'profile'" class="profile-view">
        <el-card>
          <div class="card-header">
            <h3>个人信息</h3>
            <el-button 
              size="mini"
              @click="toggleEdit"
              :icon="isEditing ? 'el-icon-close' : 'el-icon-edit'"
            />
          </div>

          <div class="profile-content">
            <div class="info-item">
              <label>昵称：</label>
              <el-input 
                v-if="isEditing" 
                v-model="profileForm.nickname"
                size="mini"
                placeholder="输入昵称"
              />
              <span v-else>{{ profileForm.nickname }}</span>
            </div>

            <div class="info-item">
              <label>性别：</label>
              <el-radio-group 
                v-if="isEditing" 
                v-model="profileForm.gender" 
                size="mini"
              >
                <el-radio :label="0">男</el-radio>
                <el-radio :label="1">女</el-radio>
              </el-radio-group>
              <span v-else>
                {{ {0:'男',1:'女'}[profileForm.gender] }}
              </span>
            </div>

            <div class="info-item">
              <label>手机：</label>
              <el-input 
                v-if="isEditing" 
                v-model="profileForm.phone"
                size="mini"
                placeholder="输入手机号"
              />
              <span v-else>{{ profileForm.phone }}</span>
            </div>

            <div class="info-item">
              <label>地址：</label>
              <el-input 
                v-if="isEditing" 
                v-model="profileForm.address"
                type="textarea"
                :rows="2"
                size="mini"
                placeholder="输入详细地址"
              />
              <span v-else>{{ profileForm.address }}</span>
            </div>

            <!-- 密码修改部分 -->
            <div class="security-section">
              <h4>安全设置</h4>
              <div class="info-item">
                <label>新密码：</label>
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  size="mini"
                  placeholder="6-20位密码"
                />
              </div>
              <div class="info-item">
                <label>确认密码：</label>
                <el-input
                  v-model="passwordForm.checkPassword"
                  type="password"
                  size="mini"
                  placeholder="再次输入密码"
                />
              </div>
            </div>

            <div class="form-actions">
              <el-button 
                v-if="isEditing"
                type="primary" 
                size="mini"
                @click="saveProfile"
                :loading="updating"
              >
                保存修改
              </el-button>
              <el-button 
                type="primary" 
                size="mini"
                @click="changePassword"
                :loading="changingPassword"
              >
                修改密码
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 底部导航 -->
    <div class="mobile-footer">
      <div 
        class="nav-item"
        :class="{active: currentView === 'appointment'}"
        @click="switchView('appointment')"
      >
        <i class="el-icon-tickets"></i>
        <span>维修预约</span>
      </div>
      <div 
        class="nav-item"
        :class="{active: currentView === 'profile'}"
        @click="switchView('profile')"
      >
        <i class="el-icon-user"></i>
        <span>个人中心</span>
      </div>
    </div>

    <!-- 弹窗 -->
    <el-dialog 
      :title="`预约详情`" 
      :visible.sync="detailDialogVisible"
      width="90%"
      class="mobile-dialog"
    >
      <div class="dialog-content">
        <div class="detail-item">
          <label>服务类型：</label>
          <span>{{ detailForm.serviceType }}</span>
        </div>
        <div class="detail-item">
          <label>预约时间：</label>
          <span>{{ formatTime(detailForm.appointmentTime) }}</span>
        </div>
        <div class="detail-item">
          <label>服务地址：</label>
          <span>{{ detailForm.address }}</span>
        </div>
        <div class="detail-item">
          <label>问题描述：</label>
          <span>{{ detailForm.desc }}</span>
        </div>
        <div class="detail-item">
          <label>当前状态：</label>
          <el-tag :type="statusTagMap[detailForm.status]" size="mini">
            {{ getStatusText(detailForm.status) }}
          </el-tag>
        </div>
        <div v-if="detailForm.status == 1 || detailForm.status == 2" class="detail-item">
          <label>维修员：</label>
          <span>{{ detailForm.status == 2 ? employeeInfo.name.substring(0, 1) + "师傅" : employeeInfo.name}}</span>
        </div>
        <div v-if="detailForm.status == 1" class="detail-item">
          <label>联系电话：</label>
          <span>{{employeeInfo.phone}}</span>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="取消预约"
      :visible.sync="cancelDialogVisible"
      width="90%"
      class="mobile-dialog"
    >
      <div class="dialog-content">
        <p class="confirm-text">确定要取消该预约吗？</p>
        <div class="dialog-actions">
          <el-button class="cancel-btn" @click="cancelDialogVisible = false">取消</el-button>
          <el-button type="danger" class="confirm-btn" @click="confirmCancelAppointment">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
var ID_INDEX = 1;

const STATUS_MAP = {
  0: { text: '待处理', tag: 'warning' },
  1: { text: '已受理', tag: 'primary' },
  2: { text: '已完成', tag: 'success' },
  3: { text: '已取消', tag: 'danger' }
}

export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    return {
      isEditing: false,
      currentView: 'appointment',
      activeTab: 'apply',
      profileActiveTab: 'basic',
      submitting: false,
      updating: false,
      changingPassword: false,
      detailDialogVisible: false,
      cancelDialogVisible: false,

      applyForm: {
        serviceType: '',
        appointmentTime: '',
        desc: '',
        address: ''
      },
      profileForm: {
        nickname: '',
        gender: 0,
        phone: '',
        address: ''
      },
      passwordForm: {
        newPassword: '',
        checkPassword: ''
      },

      userInfo: {
        name: '用户',
        phone: '13800138000'
      },

      employeeInfo: {
        name: '李国庆',
        phone: '13828576920'
      },
      appointments: [
        {
          id: 1001,
          serviceType: '空调维修',
          appointmentTime: '2023-07-20 14:00:00',
          address: '北京市朝阳区XX路1号',
          desc: '空调故障，需要维修',
          status: 0
        },
        {
          id: 1002,
          serviceType: '冰箱维修',
          appointmentTime: '2023-07-21 10:00:00',
          address: '北京市海淀区XX路2号',
          desc: '冰箱漏水，需要维修',
          employeeInfo: {
          name: '李国庆',
          phone: '13828576920'
          },
          status: 2
        }
      ],
      detailForm: {},
      currentCancelId: null,

      applyRules: {
        serviceType: [{ required: true, message: '请选择服务类型', trigger: 'change' }],
        appointmentTime: [{ required: true, message: '请选择预约时间', trigger: 'change' }],
        address: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      profileRules: {
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ]
      },
      passwordRules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在6到20个字符', trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    statusTagMap() {
      return Object.keys(STATUS_MAP).reduce((map, key) => {
        map[key] = STATUS_MAP[key].tag
        return map
      }, {})
    }
  },
  mounted() {
    this.loadData()
  },
  created: function () {
    this.appointments = [];
    ID_INDEX = 1;
    console.log(this.appointments);
    for (let i = 1; i <= 10; i++) {
      const appointment = JSON.parse(localStorage.getItem("user_appointment:" + i));
      if (appointment) {
        console.log(appointment);
        this.appointments.push(appointment);
        if (ID_INDEX <= appointment.id) {
          ID_INDEX = appointment.id + 1;
        }
      }
    }  
  },
  methods: {
    toggleEdit() {
      this.isEditing = !this.isEditing
      if (!this.isEditing) this.loadData()
    },
    formatTime(time) {
      if (!time) return '--'
      const date = new Date(time)
      const pad = num => num.toString().padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    },
    switchView(view) {
      this.currentView = view
    },
    async createAppointment() {
      try {
        this.submitting = true
        await this.$refs.applyForm.validate()
        
        const newAppointment = {
          id: ID_INDEX,
          ...this.applyForm,
          status: 0
        }
        this.appointments.unshift(newAppointment)
        localStorage.setItem("user_appointment:" + ID_INDEX++, JSON.stringify(newAppointment));
        this.$message.success('预约申请提交成功')
        this.resetApplyForm()
        this.activeTab = 'list'
      } catch (error) {
        console.error(error)
      } finally {
        this.submitting = false
      }
    },
    resetApplyForm() {
      this.$refs.applyForm.resetFields()
    },
    showDetailDialog(item) {
      this.detailForm = { ...item }
      this.detailDialogVisible = true
    },
    showCancelDialog(id) {
      this.currentCancelId = id
      this.cancelDialogVisible = true
    },
    async confirmCancelAppointment() {
      if (!this.currentCancelId) return
      
      try {
        this.appointments = this.appointments.map(item => 
          item.id === this.currentCancelId 
            ? { ...item, status: 3 } 
            : item
        )
        localStorage.setItem("user_appointment:" + this.currentCancelId, JSON.stringify(this.appointments[this.currentCancelId - 1]));
        this.$message.success('预约已取消')
        this.cancelDialogVisible = false
      } catch (error) {
        this.$message.error('取消失败')
      }
    },
    getStatusText(status) {
      return STATUS_MAP[status]?.text || '未知状态'
    },
    async saveProfile() {
      try {
        this.updating = true
        this.userInfo.name = this.profileForm.nickname
        this.$message.success('个人信息更新成功')
        this.isEditing = false
      } catch (error) {
        console.error(error)
      } finally {
        this.updating = false
      }
    },
    async changePassword() {
      try {
        this.changingPassword = true
        await this.$refs.passwordForm.validate()
        this.$message.success('密码修改成功')
        this.$refs.passwordForm.resetFields()
      } catch (error) {
        console.error(error)
      } finally {
        this.changingPassword = false
      }
    },
    loadData() {
      this.profileForm = { ...this.userInfo }
    },
    logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style scoped>
.mobile-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f0f2f5;
}

.mobile-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.mobile-tabs {
  margin-top: 8px;
}

.mobile-tabs >>> .el-tabs__nav-wrap {
  padding: 0 12px;
}

.mobile-tabs >>> .el-tabs__item {
  padding: 0 12px;
  font-size: 14px;
}

.form-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin: 8px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.full-width {
  width: 100%;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.submit-btn {
  flex: 1;
  padding: 12px;
  font-size: 14px;
}

.reset-btn {
  flex: 1;
  padding: 12px;
  background: #f8f8f8;
  border-color: #eee;
  color: #666;
  font-size: 14px;
}

.list-container {
  padding: 8px 0;
}

.list-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.service-type {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.status-tag {
  font-size: 12px;
  height: 24px;
  line-height: 22px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin: 10px 0;
}

.info-item i {
  margin-right: 8px;
  color: #999;
  font-size: 16px;
}

.card-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  padding: 8px;
  font-size: 13px;
}

.mobile-footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  background: #fff;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
  position: sticky;
  bottom: 0;
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #666;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-item i {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-item.active {
  color: #409EFF;
  transform: translateY(-2px);
}

.mobile-dialog >>> .el-dialog {
  border-radius: 12px;
}

.dialog-content {
  padding: 8px 0;
}

.detail-item {
  display: flex;
  align-items: center;
  margin: 16px 0;
  font-size: 14px;
}

.detail-item label {
  color: #999;
  min-width: 80px;
}

.confirm-text {
  text-align: center;
  font-size: 16px;
  color: #333;
  margin: 16px 0;
}

.dialog-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.confirm-btn {
  flex: 1;
  padding: 12px;
  font-size: 14px;
}

.radio-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.radio-group >>> .el-radio {
  margin: 0;
  flex: 1;
}



.profile-view {
  padding: 8px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-item label {
  color: #666;
  min-width: 60px;
  margin-right: 16px;
}

.info-item >>> .el-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.security-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.security-section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
}

.form-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.info-item >>> .el-input__inner {
  text-align: right;
  padding: 0 8px;
}

.info-item >>> .el-textarea__inner {
  min-height: 60px !important;
}
</style>