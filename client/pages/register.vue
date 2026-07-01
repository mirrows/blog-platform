<template>
  <div class="page-container">
    <div class="auth-form card">
      <h2 class="form-title">注册</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" placeholder="邮箱" size="large">
            <template #prefix><el-icon><Message /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码（至少6位）" size="large" show-password>
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" :loading="submitting" @click="handleRegister" class="submit-btn">
            {{ submitting ? '注册中...' : '注册' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="form-footer">
        已有账号？<nuxt-link to="/login">立即登录</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User, Message, Lock } from '@element-plus/icons-vue'

const auth = useAuth()
const router = useRouter()
const formRef = ref()
const submitting = ref(false)

const form = reactive({
  username: '',
  email: '',
  password: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 50, message: '用户名长度在2-50个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' },
  ],
}

const handleRegister = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  const success = await auth.register(form.username, form.email, form.password)
  submitting.value = false

  if (success) {
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } else {
    ElMessage.error('注册失败，用户名或邮箱可能已被占用')
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

  .submit-btn { width: 100%; }

  .form-footer {
    text-align: center;
    margin-top: 16px;
    color: var(--text-muted);
    font-size: 14px;
  }
}
</style>
