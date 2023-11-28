import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public secretKey = environment.mailDecryptKey
  constructor() { }

  public encrypt_user_name(name:string){
    const encrypted = CryptoJS.AES.encrypt(name, this.secretKey);
    console.log("test_user_namejson", JSON.stringify(encrypted))
    
    // localStorage.setItem('test_user_name', JSON.stringify(encrypted))
    // console.log("test_user_name", localStorage.getItem('test_user_name') || '')
  }

  public decrypt_user_name(){
    const encrypted = localStorage.getItem('test_user_name') || '';
    console.log("encrypted",encrypted)
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.secretKey);
    console.log("decryptedText",decrypted.toString(CryptoJS.enc.Utf8))
    return  decrypted.toString(CryptoJS.enc.Utf8)
  }
}
