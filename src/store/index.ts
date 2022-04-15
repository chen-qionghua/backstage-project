import { defineStore } from 'pinia'
import {userType} from '../utils/types'
export const useAuthStore = defineStore('auth', {
  state: () => {
    return { 
      isAuthenticated: false,  //是否登录成功
      user:{}     //解析到的token数据
     }
  },
  getters:{
    getAuthenticated:(state) => state.isAuthenticated,
    getUser:(state) => state.user
  },
  actions: {

    setAuth(isAuth:boolean){
      this.isAuthenticated = isAuth
    },
    
    setUser(user:userType) {
      if(user){
      this.user = user
      }else{
        this.user = {}
      }
    }
  },
})