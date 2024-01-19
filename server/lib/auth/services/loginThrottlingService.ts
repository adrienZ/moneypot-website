import { createStorage, prefixStorage } from "unstorage";
import memoryDriver from "unstorage/drivers/memory";
import { generateId } from "lucia";
import { generateState } from "arctic";
import { createError } from "h3";

const isDev = process.env.NODE_ENV === "development";

type StorageMap = {
  timeoutUntil: number;
  timeoutSeconds: number;
};

type DeviceCookie = {
  email: string;
  attempts: number;
};
type H3Event = Parameters<Parameters<typeof defineEventHandler>[0]>[0];

export class LoginThrottlingService {
  private static instance: LoginThrottlingService;

  private storage = createStorage({
    driver: memoryDriver()
  });

  timeoutStorage = prefixStorage<StorageMap>(this.storage, "timeout");

  deviceCookie = prefixStorage<DeviceCookie>(this.storage, "device_cookie");

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): LoginThrottlingService {
    if (!LoginThrottlingService.instance) {
      LoginThrottlingService.instance = new LoginThrottlingService();
    }

    return LoginThrottlingService.instance;
  }

  private async isValidateDeviceCookie(
    deviceCookieId: string | null,
    email: string
  ) {
    if (!deviceCookieId) return false;
    const deviceCookieAttributes =
      (await this.deviceCookie.getItem(deviceCookieId)) ?? null;
    if (!deviceCookieAttributes) return false;
    const currentAttempts = deviceCookieAttributes.attempts + 1;
    if (currentAttempts > 5 || deviceCookieAttributes.email !== email) {
      await this.deviceCookie.removeItem(deviceCookieId, true);
      return false;
    }
    await this.deviceCookie.setItem(deviceCookieId, {
      email,
      attempts: currentAttempts
    });
    return true;
  }

  /**
   * Finally, any singleton should define some business logic, which can be
   * executed on its instance.
   */
  async run(event: H3Event, email: string) {
    const storedTimeout = await this.timeoutStorage.getItem(email);
    const timeoutUntil = storedTimeout?.timeoutUntil ?? 0;

    const storedDeviceCookieId = getCookie(event, "device_cookie") ?? null;
    const validDeviceCookie = await this.isValidateDeviceCookie(
      storedDeviceCookieId,
      email
    );

    if (!validDeviceCookie) {
      setCookie(event, "device_cookie", generateState(), {
        path: "/",
        secure: !isDev, // true for production
        maxAge: 0,
        httpOnly: true,
        sameSite: true
      });

      if (Date.now() < timeoutUntil) {
        // 429 too many requests
        throw createError({
          status: 429
        });
      }

      // increase timeout
      const timeoutSeconds = storedTimeout
        ? storedTimeout.timeoutSeconds * 2
        : 1;
      await this.timeoutStorage.setItem(email, {
        timeoutUntil: Date.now() + timeoutSeconds * 1000,
        timeoutSeconds
      });
    } else {
      const newDeviceCookieId = generateId(40);
      this.deviceCookie.setItem(newDeviceCookieId, {
        email,
        attempts: 0
      });
      setCookie(event, "device_cookie", newDeviceCookieId, {
        path: "/",
        secure: !isDev, // true for production
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true
      });
    }
  }

  async onValidate(email: string) {
    await this.timeoutStorage.removeItem(email, true);
  }
}
