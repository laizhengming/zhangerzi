<template>
  <div class="mobile-container">
    <!-- 顶部导航栏 -->
    <div class="mobile-header">
      <div class="header-title">维修工单系统</div>
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
      <!-- 任务列表 -->
      <div v-show="currentView === 'tasks'">
        <div class="list-header">
          <h3>当前维修任务</h3>
          <el-button 
            size="mini" 
            icon="el-icon-refresh"
            @click="getTasks"
          />
        </div>
        
        <div class="task-list">
          <div 
            v-for="task in tasks"
            :key="task.id"
            class="task-card"
          >
            <div class="card-header">
              <span class="task-id">#{{ task.id }}</span>
              <el-tag 
                :type="statusTagMap[task.status]"
                size="mini"
              >
                {{ statusTextMap[task.status] }}
              </el-tag>
            </div>
            
            <div class="card-content">
              <div class="info-item">
                <i class="el-icon-office-building"></i>
                {{ task.serviceType }}
              </div>
              <div class="info-item">
                <i class="el-icon-user"></i>
                {{ task.customerName }}
              </div>
              <div class="info-item">
                <i class="el-icon-time"></i>
                {{ task.appointmentTime }}
              </div>
              <div class="info-item">
                <i class="el-icon-location"></i>
                {{ task.address }}
              </div>
            </div>

            <div class="card-actions">
              <el-button 
                v-if="task.status !== 'COMPLETED'"
                size="mini"
                @click="showStatusDialog(task)"
              >
                更新状态
              </el-button>
            </div>
          </div>
        </div>
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
              <label>姓名：</label>
              <el-input v-if="isEditing" v-model="profileData.name" size="mini"/>
              <span v-else>{{ profileData.name }}</span>
            </div>
            <div class="info-item">
              <label>电话：</label>
              <el-input v-if="isEditing" v-model="profileData.phone" size="mini"/>
              <span v-else>{{ profileData.phone }}</span>
            </div>
            <div class="info-item">
              <label>邮箱：</label>
              <el-input v-if="isEditing" v-model="profileData.email" size="mini"/>
              <span v-else>{{ profileData.email }}</span>
            </div>
            <div class="info-item">
              <label>角色：</label>
              <span>{{ profileData.role }}</span>
            </div>

            <div v-if="isEditing" class="form-actions">
              <el-button 
                type="primary" 
                size="mini"
                @click="saveProfile"
              >
                保存
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
        :class="{active: currentView === 'tasks'}"
        @click="switchView('tasks')"
      >
        <i class="el-icon-tickets"></i>
        <span>维修任务</span>
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

    <!-- 状态更新对话框 -->
    <el-dialog
      title="更新任务状态"
      :visible.sync="statusDialog.visible"
      width="90%"
    >
      <div class="dialog-content">
        <div class="current-status">
          <span>当前状态：</span>
          <el-tag :type="statusTagMap[currentTask.status]">
            {{ statusTextMap[currentTask.status] }}
          </el-tag>
        </div>
        
        <div class="new-status">
          <el-select 
            v-model="statusDialog.newStatus" 
            placeholder="选择新状态"
            size="small"
            class="full-width"
          >
            <el-option
              v-for="item in allowedStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>

        <div class="dialog-actions">
          <el-button 
            size="small"
            @click="statusDialog.visible = false"
          >
            取消
          </el-button>
          <el-button 
            type="primary" 
            size="small"
            @click="updateTaskStatus"
          >
            确认
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const STATUS_MAP = {
  PENDING: { text: '待处理', tag: 'warning', next: ['ACCEPTED'] },
  ACCEPTED: { text: '已接单', tag: 'primary', next: ['PROCESSING'] },
  PROCESSING: { text: '进行中', tag: 'info', next: ['COMPLETED'] },
  COMPLETED: { text: '已完成', tag: 'success', next: [] }
}

export default {
  data() {
    return {
      currentView: 'tasks',
      isEditing: false,
      profileData: {
        name: '李景隆',
        phone: '13812345678',
        email: 'tech@example.com',
        role: '高级维修工程师'
      },
      tasks: [
        {
          id: '67',
          serviceType: '空调维修',
          customerName: '张先生',
          appointmentTime: '2025-04-05 14:00',
          address: '北京市朝阳区',
          status: 'ACCEPTED'
        },
        {
          id: '25',
          serviceType: '冰箱维修',
          customerName: '张女士',
          appointmentTime: '2025-04-07 10:30',
          address: '北京市双流区',
          status: 'PROCESSING'
        },
        {
          id: '12',
          serviceType: '洗衣机维修',
          customerName: '陈先生',
          appointmentTime: '2025-07-22 09:00',
          address: '北京市海淀区',
          status: 'COMPLETED'
        }
      ],
      statusDialog: {
        visible: false,
        newStatus: null
      },
      currentTask: {}
    }
  },
  computed: {
    statusTextMap() {
      return Object.keys(STATUS_MAP).reduce((map, key) => {
        map[key] = STATUS_MAP[key].text
        return map
      }, {})
    },
    statusTagMap() {
      return Object.keys(STATUS_MAP).reduce((map, key) => {
        map[key] = STATUS_MAP[key].tag
        return map
      }, {})
    },
    allowedStatusOptions() {
      if (!this.currentTask.status) return []
      return STATUS_MAP[this.currentTask.status].next.map(status => ({
        value: status,
        label: STATUS_MAP[status].text
      }))
    }
  },
  methods: {
    switchView(view) {
      this.currentView = view
    },
    toggleEdit() {
      this.isEditing = !this.isEditing
      if (!this.isEditing) this.resetProfile()
    },
    resetProfile() {
      // 实际项目中应从接口获取最新数据
      this.profileData = {
        name: '李景隆',
        phone: '13812345678',
        email: 'tech@example.com',
        role: '高级维修工程师'
      }
    },
    saveProfile() {
      this.$message.success('信息已保存')
      this.isEditing = false
    },
    getTasks() {
      // 模拟刷新数据
      this.$message.success('任务列表已更新')
    },
    showStatusDialog(task) {
      this.currentTask = { ...task }
      this.statusDialog = {
        visible: true,
        newStatus: null
      }
    },
    updateTaskStatus() {
      if (!this.statusDialog.newStatus) {
        return this.$message.warning('请选择新状态')
      }
      this.$message.success('状态更新成功')
      this.statusDialog.visible = false
      this.getTasks()
    },
    logout() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
  font-size: 16px;
  font-weight: 600;
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

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 8px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-id {
  color: #666;
  font-size: 14px;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
}

.info-item i {
  margin-right: 8px;
  color: #999;
  font-size: 16px;
}

.card-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
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
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.form-actions {
  margin-top: 24px;
  text-align: center;
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
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12px;
  color: #666;
  padding: 8px;
  cursor: pointer;
}

.nav-item.active {
  color: #409EFF;
}

.nav-item i {
  font-size: 20px;
  margin-bottom: 4px;
}

.dialog-content {
  padding: 16px 0;
}

.current-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.dialog-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.full-width {
  width: 100%;
}
</style>