import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

export class ConfigService {
  private static instance: ConfigService;
  private config: Record<string, string> = {};
  private client: SSMClient;

  private constructor() {
    this.client = new SSMClient({ region: "ap-southeast-2" });
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      const response = await this.client.send(
        new GetParametersCommand({
          Names: [
            "/n11744260/auth/userPoolID",
            "/n11744260/auth/clientID",
            "/n11744260/docker-images/python",
            "/n11744260/docker-images/node",
            "/n11744260/docker-images/golang",
          ],
          WithDecryption: true,
        })
      );

      this.config =
        response.Parameters?.reduce((acc, param) => {
          if (param.Name && param.Value) {
            acc[param.Name] = param.Value;
          }
          return acc;
        }, {} as Record<string, string>) || {};
    } catch (error) {
      console.error("Error fetching parameters:", error);
      throw error;
    }
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
