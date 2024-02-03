import {
  encodeBase64,
  decodeBase64,
  encodeHex,
  decodeHex
} from "oslo/encoding";
import { sha1 } from "oslo/crypto";

export class SessionData {
  input: string;

  constructor(params: string) {
    this.input = params;
  }

  static async encodeUserAgent(userAgent: string): Promise<string> {
    let nstr = "";

    for (let i = 0; i < userAgent.length; i++) {
      nstr += String.fromCharCode(userAgent.charCodeAt(i) ^ 1);
    }

    return nstr;
  }

  static decodeUserAgent(encodedString: string): string {
    const ostr = encodedString.toString();
    let x,
      nstr = "";
    const len = ostr.length;

    for (x = 0; x < len; x += 2) {
      nstr += String.fromCharCode(255 - parseInt(ostr.substr(x, 2), 36));
    }
    return nstr;
  }
}
