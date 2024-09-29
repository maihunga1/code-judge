import { Client, ClientOptions } from "memjs";

class MemcacheClient {
  private client: Client;

  constructor(
    serverLocation: string = "localhost:11211",
    options: ClientOptions = {}
  ) {
    this.client = Client.create(serverLocation, options);
  }

  async set<T>(
    key: string,
    value: T,
    expirationInSeconds: number = 0
  ): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);

      await this.client.set(key, serializedValue, {
        expires: expirationInSeconds,
      });

      return true;
    } catch (error) {
      console.error("Error setting value in Memcache:", error);
      return false;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await this.client.get(key);

      if (!value) return null;

      return JSON.parse(value.toString()) as T;
    } catch (error) {
      console.error("Error getting value from Memcache:", error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      await this.client.delete(key);
      return true;
    } catch (error) {
      console.error("Error deleting value from Memcache:", error);
      return false;
    }
  }
}

export const memcacheClient = new MemcacheClient();
