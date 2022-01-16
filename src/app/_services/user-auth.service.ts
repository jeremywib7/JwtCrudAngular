import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import * as CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  secretKey = "nih71h8dh1j2spaksnjabx1092k1osom1inu1b27y17u2e9109io1ksoj2ih1udubfkkvk12j819291kd00k[pkajkncwniq";

  constructor(private cookieService: CookieService) {
  }

  public setRoles(roles: []) {
    this.cookieService.set('_security_role',
      CryptoJS.AES.encrypt(roles['roleName'].toString(), this.secretKey.trim()).toString());
  }

  public getRoles() {
    return CryptoJS.AES.decrypt(this.cookieService.get('_security_role'), this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  public setToken(accessToken: string) {
    this.cookieService.set('_security_accessToken',
      CryptoJS.AES.encrypt(accessToken, this.secretKey.trim()).toString());
  }

  public getToken() {
    return CryptoJS.AES.decrypt(this.cookieService.get('_security_accessToken'), this.secretKey.trim()).toString(CryptoJS.enc.Utf8);
  }

  public clear() {
    this.cookieService.delete('_security_role');
    this.cookieService.delete('_security_accessToken');
  }

  public isLoggedIn() {
    return this.getRoles() && this.getToken();
  }

}
