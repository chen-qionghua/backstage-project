<template>
  <div class="login">
    <section class="form-container">
      <div class="manage-tip">
        <span class="title">后台管理系统</span>
        <el-form
          ref="ruleFormRef"
          :rules="rules"
          label-width="80px"
          class="loginForm"
          :model="loginUser"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="loginUser.email"
              placeholder="请输入邮箱"
            ></el-input> </el-form-item
          ><el-form-item label="密码" prop="password">
            <el-input
              v-model="loginUser.password"
              placeholder="请输入密码"
              type="password"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="handleSubmit(ruleFormRef)" class="submit-btn"
              >登录</el-button
            >
          </el-form-item>
          <div class="tiparea">
            <p>
              还没有账号? 现在<router-link to="/register">注册</router-link>
            </p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>


<script setup lang="ts" >
import { reactive, ref } from "vue";
import { registerType, registerRulesType, userType } from "../utils/types";
import { FormInstance } from "element-plus";
import axios from "../utils/http";
import { useRouter } from "vue-router";
import jwt_decode from "jwt-decode";
import { useAuthStore } from "../store/index";

const store = useAuthStore();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const loginUser = ref<registerType>({
  email: "1169121469@qq.com",
  password: "123456",
});
const handleSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const {
        data: { success, token },
      } = await axios.post("/api/users/login", loginUser.value);
      if (success && token) {
        localStorage.setItem("token", token);
        const decode: userType = jwt_decode(token);
        //修改全局状态
        store.setAuth(!!decode);
        store.setUser(decode);

        // @ts-ignore
        ElMessage({
          message: "登录成功，跳转至首页.",
          type: "success",
        });
        router.push("/");
      }
    } else {
      console.log("error submit!");
      return false;
    }
  });
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请重新输入密码"));
  } else if (value !== loginUser.value.password) {
    callback(new Error("两次密码不一致!"));
  } else {
    callback();
  }
};
const rules = reactive<registerRulesType>({
  email: [
    {
      type: "email",
      require: true,
      message: "邮箱格式不正确",
      trigger: "blur",
    },
  ],
  password: [
    { require: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, max: 30, message: "长度在6到30个字符之间", trigger: "blur" },
  ],
});
</script>


<style lang="scss" scoped>
</style>