import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly shift = 3;

  public secretKey = environment.mailDecryptKey;
  public hashedId : string = "";
  constructor() {}

  public encrypt(key:string,text: string): string {
    let encryptedText = '';

    for (let i = 0; i < text.length; i++) {
      let charCode = text.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        encryptedText += String.fromCharCode(
          ((charCode - 65 + this.shift) % 26) + 65
        );
      } else if (charCode >= 97 && charCode <= 122) {
        encryptedText += String.fromCharCode(
          ((charCode - 97 + this.shift) % 26) + 97
        );
      } else {
        encryptedText += text[i];
      }
    }
    localStorage.setItem(key, encryptedText);
    this.decrypt(key);
    return encryptedText;
  }

  public decrypt(key: string): string {
    let encryptedText = localStorage.getItem(key) ?? ''
    let decryptedText = '';
    for (let i = 0; i < encryptedText.length; i++) {
      let charCode = encryptedText.charCodeAt(i);
      if (charCode >= 65 && charCode <= 90) {
        decryptedText += String.fromCharCode(
          ((charCode - 65 - this.shift + 26) % 26) + 65
        );
      } else if (charCode >= 97 && charCode <= 122) {
        decryptedText += String.fromCharCode(
          ((charCode - 97 - this.shift + 26) % 26) + 97
        );
      } else {
        decryptedText += encryptedText[i];
      }
    }
    return decryptedText;
  }
  public generateUniqueKey (key : string) 
  {
    this.hashedId = CryptoJS.SHA256(key).toString();
    return this.hashedId; 
  }
}
