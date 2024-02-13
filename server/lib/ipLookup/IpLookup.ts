import { GeoIpDbName } from "geolite2-redist";
import type { CityResponse } from "maxmind";
import twemoji from "twemoji";
// @ts-expect-error no types definition for jgeoip
import jGeoIP from "jgeoip";
import { getMmdbPath } from "./plugins/mmdb-storage";

type Reader = any;

export class IpLookup {
  private ip: string;

  city: string | null;

  country: {
    code: string;
    name: string;
    flagSrc: string;
  } | null;

  static readerInstance: Reader | null;

  constructor(ip: string) {
    this.ip = ip;
    this.city = null;
    this.country = null;
  }

  async parse() {
    const reader = await IpLookup.getReader();

    const data: CityResponse | null = await reader.getRecord(this.ip);

    // @ts-ignore
    this.city = data?.city?.names.en ?? null;
    // @ts-ignore
    const country = data?.country;

    if (country?.iso_code && country.names) {
      const flagUnicode = this.getFlagEmoji(country.iso_code);
      const twemojiFlag = twemoji.parse(flagUnicode);
      const flagSrc = this.extractImgSrc(twemojiFlag) as string; // cast as string as twemoji returns HTML

      this.country = {
        code: country.iso_code,
        name: country.names.en,
        flagSrc
      };
    } else {
      this.country = null;
    }
  }

  private extractImgSrc(htmlString: string): string | null {
    // Regular expression to match the src attribute within an img tag
    const regex = /<img[^>]+src="([^">]+)"/g;
    const match = regex.exec(htmlString);

    // If a match is found, return the first capture group (the URL)
    if (match) {
      return match[1];
    }

    // If no match is found, return null
    return null;
  }

  static async getReader() {
    if (!this.readerInstance) {
      const dbPath = await getMmdbPath(GeoIpDbName.City);
      this.readerInstance = new jGeoIP(dbPath.path);
    } else {
      return this.readerInstance;
    }
  }

  private getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }
}
