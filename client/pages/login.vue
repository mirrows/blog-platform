<template>
  <div class="page-container">
    <div class="auth-form card">
      <h2 class="form-title">登录</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名或邮箱" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password>
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="submitting" @click="handleLogin" class="submit-btn">
            {{ submitting ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="form-footer">
        还没有账号？<nuxt-link to="/register">立即注册</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'

const auth = useAuth()
const router = useRouter()
const formRef = ref()
const submitting = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  const success = await auth.login(form.username, form.password)
  submitting.value = false

  if (success) {
    ElMessage.success('登录成功')
    router.push('/')
  } else {
    ElMessage.error('用户名或密码错误')
  }
}
</script>

<style scoped lang="scss">
.auth-form {
  max-width: 400px;
  margin: 60px auto;
  padding: 40px;

  .form-title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 32px;
  }

  .submit-btn {
    width: 100%;
  }

  .form-footer {
    text-align: center;
    margin-top: 16px;
    color: var(--text-muted);
    font-size: 14px;
  }
}
</style>
