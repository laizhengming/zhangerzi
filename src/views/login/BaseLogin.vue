<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="brand-wrapper">
        <i class="el-icon-s-tools brand-icon"></i>
        <h1 class="brand-title">设备维修预约系统</h1>
      </div>

      <el-form ref="loginForm" :model="form" :rules="rules" label-position="top">
        <!-- 账户输入 -->
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入工号/账号" prefix-icon="el-icon-user" clearable></el-input>
        </el-form-item>

        <!-- 密码输入 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-lock" show-password
            clearable></el-input>
        </el-form-item>

        <!-- 验证码输入 -->
        <el-form-item prop="code" v-if="loginCount >= 5">
          <div class="captcha-wrapper">
            <el-input v-model="form.code" placeholder="请输入验证码" style="width: 50%" clearable></el-input>
            <div class="captcha-code" @click="refreshCaptcha">
              <img :src="captchaCode" alt="验证码">
            </div>
          </div>
        </el-form-item>

        <!-- 登录按钮 -->
        <el-button type="primary" class="login-btn" @click="handleLogin">
          立即登录
        </el-button>

        <!-- 错误提示 -->
        <transition name="el-zoom-in-top">
          <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon class="error-tip"></el-alert>
        </transition>
      </el-form>

      <div class="footer-tip">
        <span>技术支持 © 2024 设备管理部</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        code: '',
        key: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账户', trigger: 'blur' },
          { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 4, message: '验证码为4位数字', trigger: 'blur' }
        ]
      },
      captchaCode: '',
      errorMessage: '',
      loginCount: 0
    };
  },
  created() {
    this.refreshCaptcha();
  },
  methods: {
    // 刷新验证码
    refreshCaptcha() {
      this.$axios.get("/auth/utils/code")
        .then(res => {
          this.form.key = res.msg;
          this.captchaCode = res.data;
        })
        .catch(err => {
          console.error('获取验证码失败:', err);
        });
    },
    // 登录处理
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {

          // 执行登录逻辑
          this.$axios.post("/auth/login", this.form).then(res => {
            if (res.code == 200) {
              this.$message({
                type: 'success',
                message: '登录成功'
              })
              this.$router.push('/a/home')
            } else {
              this.loginCount++
              if(this.loginCount >= 5) {
                this.refreshCaptcha()
              }
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        }
      });
    }
  }
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f2f5;
}

.login-card {
  width: 420px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.brand-wrapper {
  text-align: center;
  margin-bottom: 24px;
}

.brand-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 12px;
}

.brand-title {
  font-size: 20px;
  color: #303133;
  margin: 0;
  font-weight: 500;
}

.captcha-wrapper {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-code {
  width: 100px;
  height: 40px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
  cursor: pointer;
  user-select: none;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.captcha-code:hover {
  background: #ebedf0;
}

.login-btn {
  width: 100%;
  margin-top: 20px;
  height: 40px;
  font-size: 14px;
}

.error-tip {
  margin-top: 16px;
}

.footer-tip {
  margin-top: 24px;
  text-align: center;
  color: #909399;
  font-size: 12px;
}

@media (max-width: 480px) {
  .login-card {
    width: 90%;
    margin: 20px;
  }

  .captcha-wrapper {
    flex-direction: column;
  }

  .captcha-code {
    width: 100%;
  }
}
</style>