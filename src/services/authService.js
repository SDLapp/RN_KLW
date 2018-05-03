
import { post, get } from '../dvapack/request';
// 全局api文件
import api from '../config/globalapi';

/**
 * 通讯录
 * HelenChen
 * @param {*} param 
 */

export const getcontactlist = async (param) => {
  const body={

  };
  const result=await get(api.system.contactlist,body,null); 
  return result;
}
/**
 * 登录
 * houxiaofeng
 * @param {*} param 
 */
export const login = async (param) => {
  const body = {
    User_Name: param.username,
    User_Pwd: param.password
  };
  let result = await post(api.system.login, body, null);
  return result;
};
/**
 * 修改密码
 * HelenChen
 * @param {*} param 
 */
export const resetPwd = async (param) => {
  const body = {
    authorCode: param.authorCode,
    UserPwdOld: param.userPwdOld,
    UserPwdNew: param.userPwdNew,
    UserPwdTwo: param.userPwdTwo,
    Phone:-1,
  };
  const result = await post(api.system.resetpwd, body, null);
  return result;
};
/**
 * 获取污染物类型(例：颗粒物、标准站)
 * houxiaofeng
 * @param {*} param 
 */
export const getPolluntType = async (param) => {
  const body = {
  };
  const result = await get(api.system.GetPolluntType, body, null);
  return result;
};