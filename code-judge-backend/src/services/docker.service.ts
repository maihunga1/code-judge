import axios, { AxiosInstance } from "axios";
import stream from "stream";

const socketPath = "/var/run/docker.sock";

export type dockerImage = {
  name: string;
  tag: string;
};

export class DockerService {
  // TODO: refactor to not use !
  private dockerDaemonClient!: AxiosInstance;

  constructor() {
    this.initializeDockerClient();
  }

  private async initializeDockerClient() {
    const dockerVersion = await this.getDockerVersion();

    this.dockerDaemonClient = axios.create({
      socketPath,
      baseURL: `http://localhost/v${dockerVersion}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async getDockerVersion(): Promise<string> {
    try {
      const response = await axios.get("http://localhost/version", {
        socketPath,
      });
      return response.data.ApiVersion;
    } catch (error) {
      throw new Error(
        "Error fetching Docker version " +
          error +
          "\n Docker is likely not running"
      );
    }
  }

  async hasImage(image: dockerImage): Promise<boolean> {
    if (!image || !image.name || !image.tag) {
      throw new Error("Image name and tag are required");
    }

    try {
      const rsp = await this.dockerDaemonClient.get(
        `/images/${image.name}:${image.tag}/json`
      );

      return rsp.status === 200;
    } catch (error) {
      return false;
    }
  }

  async pullImage(image: dockerImage): Promise<void> {
    if (!image || !image.name || !image.tag) {
      throw new Error("Image name and tag are required");
    }

    try {
      await this.dockerDaemonClient.post(
        `/images/create?fromImage=${image.name}&tag=${image.tag}`
      );
      console.log(`Successfully pulled image ${image.name}:${image.tag}`);
    } catch (error) {
      console.error(`Error pulling image ${image.name}:${image.tag}:`, error);
      throw error;
    }
  }

  async createContainer(image: dockerImage): Promise<string> {
    try {
      await this.ensureImageExists(image);

      const response = await this.dockerDaemonClient.post(
        "/containers/create",
        {
          Image: `${image.name}:${image.tag}`,
          Cmd: ["sleep", "infinity"],
          HostConfig: {
            AutoRemove: false,
          },
        }
      );

      console.log(
        `Successfully created container with ID: ${response.data.Id}`
      );

      return response.data.Id;
    } catch (error) {
      console.error(
        `Error creating container with image ${image.name}:${image.tag}:`,
        error
      );

      throw error;
    }
  }

  private async ensureImageExists(image: dockerImage): Promise<void> {
    const imageExists = await this.hasImage(image);

    if (!imageExists) {
      await this.pullImage(image);
    }
  }

  async startContainer(containerID: string): Promise<void> {
    try {
      await this.dockerDaemonClient.post(`/containers/${containerID}/start`);
      console.log(`Successfully started container with ID: ${containerID}`);
    } catch (error) {
      console.error(`Error starting container with ID ${containerID}:`, error);
      throw error;
    }
  }

  async execCommand(containerID: string, command: string[]): Promise<string> {
    try {
      // Create exec instance
      const createExecResponse = await this.dockerDaemonClient.post(
        `/containers/${containerID}/exec`,
        {
          AttachStdout: true,
          AttachStderr: true,
          Cmd: command,
          WorkingDir: "/",
        }
      );

      const execID = createExecResponse.data.Id;

      const execOutput = await this.dockerDaemonClient.post(
        `/exec/${execID}/start`,
        {
          Detach: false,
          Tty: false,
        },
        {
          responseType: "arraybuffer",
        }
      );

      return this.parseMultiplexedStream(execOutput.data);
    } catch (error) {
      console.error(
        `Error executing command in container ${containerID}:`,
        error
      );
      throw error;
    }
  }

  async copyFileToContainer(
    containerID: string,
    tarBuffer: Buffer
  ): Promise<void> {
    try {
      await this.dockerDaemonClient.put(
        `/containers/${containerID}/archive`,
        stream.Readable.from(tarBuffer),
        {
          params: { path: "/" },
          headers: { "Content-Type": "application/x-tar" },
        }
      );
    } catch (error) {
      console.error("Error copying file to container:", error);
      throw error;
    }
  }

  private parseMultiplexedStream(buffer: Buffer): string {
    let output = "";
    let offset = 0;

    while (offset < buffer.length) {
      const headerSize = 8;
      const size = buffer.readUInt32BE(offset + 4);
      offset += headerSize;
      output += buffer.subarray(offset, offset + size).toString();
      offset += size;
    }

    return output;
  }

  async killAndRemoveContainer(containerID: string): Promise<void> {
    try {
      // Kill the container
      await this.dockerDaemonClient.post(`/containers/${containerID}/kill`);
      console.log(`Successfully killed container with ID: ${containerID}`);

      // Remove the container
      await this.dockerDaemonClient.delete(`/containers/${containerID}`);
      console.log(`Successfully removed container with ID: ${containerID}`);
    } catch (error) {
      console.error(`Error killing and removing container ${containerID}:`, error);
      throw error;
    }
  }
}

export const containerService = new DockerService();
