import Storage from "good-storage";
import {tokenKey, userInfoKey} from "@/config/app.ts";
import {User} from "@/store/user.ts";


export function getUserInfo():User {
  return Storage.get(userInfoKey, {});
}


export function setUserInfo(user:User):User {
  Storage.set(userInfoKey, user);
  return user;
}
export function isLogin() : boolean{
  return Storage.get(tokenKey,false)
}

export function getToken():string {
  // const jwt = JSON.parse(Storage.get(tokenKey))
  // console.log(jwt.token)
  return Storage.get(tokenKey);
}

/**
 * 设置Token
 * @param token
 * @returns {*|undefined}
 */
export function setToken(token:string) : void{
  return Storage.set(tokenKey, token);
}

/**
 * 移除Token
 * @returns {*}
 */
export function removeToken():void {
  return Storage.remove(tokenKey);
}
