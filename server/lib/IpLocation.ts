import {
  GeoIpDbName,
  open as createGeolite2Reader,
  type WrappedReader,
  downloadDbs
} from "geolite2-redist";
import maxmind, { type Reader, type CityResponse } from "maxmind";
import twemoji from "twemoji";

// @ts-expect-error
type CityReader = WrappedReader<Reader<CityResponse>>;

export class IpLocation {
  private ip: string;

  city: string | null;

  country: {
    code: string;
    name: string;
    flagSrc: string;
  } | null;

  constructor(ip: string, reader: CityReader) {
    this.ip = ip;
    const data = reader.get(this.ip);

    this.city = data?.city?.names.en ?? null;

    const country = data?.country;

    if (country?.iso_code && country.names) {
      const flagUnicode = this.getFlagEmoji(country.iso_code);
      const twemojiFlag = twemoji.parse(flagUnicode);
      // cast as string as twemoji returns HTML
      const flagSrc = this.extractImgSrc(twemojiFlag) as string;

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

  private getFlagEmoji(countryCode: string) {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  static async createReader(): Promise<CityReader> {
    return await createGeolite2Reader(GeoIpDbName.City, (filePath) =>
      maxmind.open<CityResponse>(filePath)
    );
  }

  static loadDbs(): Promise<void> {
    return downloadDbs();
  }
}
