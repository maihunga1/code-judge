import { SSMClient, GetParametersCommand } from "@aws-sdk/client-ssm";

class ConfigService {
  private config: Record<string, string> = {};
  private client: SSMClient;

  constructor() {
    this.client = new SSMClient({ region: "ap-southeast-2" });
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

export const configService = new ConfigService();
