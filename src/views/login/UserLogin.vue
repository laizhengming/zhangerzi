<template>
  <div class="user-login-container">
    <div class="login-bg"></div>
    <el-card class="login-card">
      <div class="brand-wrapper">
        <i class="el-icon-user-solid brand-icon"></i>
        <h1 class="brand-title">设备维修服务平台</h1>
        <p class="brand-subtitle">专业设备维护解决方案</p>
      </div>

      <el-form 
        ref="loginForm"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入手机号"
            prefix-icon="el-icon-message"
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item prop="captcha" v-if="loginCount >= 5">
          <div class="captcha-wrapper">
            <el-input
              v-model="form.code"
              placeholder="验证码"
              style="width: 60%"
            ></el-input>
            <div class="captcha-code" @click="refreshCaptcha">
              <img :src="captchaCode" alt="">
            </div>
          </div>
        </el-form-item>

        <el-button 
          type="primary" 
          class="login-btn"
          @click="handleLogin"
        >
          立即登录
        </el-button>

        <div class="extra-actions">
          <router-link to="/register" class="register-link">
            立即注册
          </router-link>
          <span class="divider">|</span>
          <a class="forgot-password">忘记密码？</a>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode';

export default {
  data() {
    return {
      form: {
        username: '',
        password: '',
        key: '',
        code: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账账号', trigger: 'blur' },
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
      loginCount: 0
    }
  },
  created() {
  },
  methods: {
    // 刷新验证码
    refreshCaptcha() {
      this.$axios.get("/auth/utils/code")
        .then(res => {
          console.log(res)
          this.form.key = res.msg;
          this.captchaCode = res.data
          console.log("key = " + this.form.key)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          // 执行登录逻辑
          this.$axios.post("/auth/login", this.form).then(res => {
            if (res.code == 200) {
              localStorage.setItem('token', res.data);
              let data = res.data;
              localStorage.setItem('accountType', jwtDecode(data).type)
              this.$message({
                type: 'success',
                message: '登录成功'
              })
              this.$router.push('/index')
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
      })
    }
  }
}
</script>

<style scoped>
.user-login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('~@/assets/login-bg.jpg') no-repeat center/cover;
  opacity: 0.2;
}

.login-card {
  width: 450px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  position: relative;
  z-index: 1;
  background: rgba(255,255,255,0.95);
}

.brand-wrapper {
  text-align: center;
  margin-bottom: 30px;
}

.brand-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 15px;
}

.brand-title {
  font-size: 24px;
  color: #303133;
  margin: 10px 0;
}

.brand-subtitle {
  color: #909399;
  font-size: 14px;
  margin: 0;
}

.captcha-wrapper {
  display: flex;
  gap: 10px;
}

.captcha-code {
  width: 120px;
  height: 40px;
  background: #f5f7fa;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.3s;
}

.captcha-code:hover {
  background: #ebedf0;
}

.login-btn {
  width: 100%;
  height: 45px;
  margin-top: 20px;
  font-size: 16px;
}

.extra-actions {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.register-link {
  color: #409EFF;
  text-decoration: none;
}

.divider {
  color: #dcdfe6;
  margin: 0 10px;
}

.forgot-password {
  color: #909399;
  cursor: pointer;
}
</style>