export interface registerType{
  name?: string;
  email: string;
  password: string;
  password2?: string;
  identity?: string;
}
export interface registerRulesType {
  name?: ({
      require: boolean;
      message: string;
      trigger: string;

  } | {
      min: number;
      max: number;
      message: string;
      trigger: string;
  })[];
  email: {
      type: string;
      require: boolean;
      message: string;
      trigger: string;
  }[];
  password: ({
    require: boolean;
    message: string;
    trigger: string;

} | {
    min: number;
    max: number;
    message: string;
    trigger: string;
})[];
  password2?: ({
    require: boolean;
    message: string;
    trigger: string;

} | {
    min: number;
    max: number;
    message: string;
    trigger: string;
} | {
  validator?: (rule: any, value: string, callback: any) => void,
  trigger: string
})[];
}

export interface userType {
  avatar:string;
  exp:number;
  iat:number;
  id:string;
  identity:string;
  name:string;
}