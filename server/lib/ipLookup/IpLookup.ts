import twemoji from "twemoji";
import { GeoIpDbName, type WrappedReader, open } from "geolite2-redist";
import maxmind, { type Reader, type CityResponse } from "maxmind";

/**
 * IP LOOKUPS ARE HARD
 *
 * In most case a redis instance is what you need
 * 1. you'll need to query the database from maxmind https://www.maxmind.com/en/geoip-demo
 * 2. in our case we want the simplest infra possible so we use a local redistribution of the database: https://github.com/GitSquared/node-geolite2-redist
 * 3. The city database is ~70mo... querying via filesystem is slow, putting the db in memory is very fast but cost a lot of memory
 *
 * tested:
 * - jgeoip (https://github.com/jclo/jgeoip), in memory, very fast, but Nuxt output file is readonly and we can't download databases. Nuxt also handle dirname weirdly, file structure is not stable
 * - maxmind (https://www.npmjs.com/package/maxmind) uses propriatary format (.mmdb) so no conversion from .csv still veryslow
 * - fast-geoip (https://github.com/onramper/fast-geoip#readme) very interisting implementation both fast and simple to setup but only returns country ?
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
type CityReader = WrappedReader<Reader<CityResponse>>;

export class IpLookup {
  private ip: string;

  city: string | null;

  country: {
    code: string;
    name: string;
    flagSrc: string;
  } | null;

  static readerInstance: CityReader | null = null;

  constructor(ip: string, reader: CityReader) {
    this.ip = ip;
    this.city = null;
    this.country = null;

    const data = reader.get(ip);
    reader.close();

    this.city = data?.city?.names.en ?? null;
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

  static async createReader(): Promise<CityReader> {
    if (!this.readerInstance) {
      this.readerInstance = await open(GeoIpDbName.City, (path) =>
        maxmind.open<CityResponse>(path)
      );
    }

    return this.readerInstance;
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
}
