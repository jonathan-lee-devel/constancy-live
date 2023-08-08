import {AxiosStatic, AxiosResponse} from 'axios';
import {HttpStatus} from '../../../lib/http/HttpStatus';
import {JenkinsAuth} from './interfaces/JenkinsAuth';
import logger from '../../../lib/logger/logger';

/**
 * Jenkins client which is intended to be one per Jenkins host URL and one auth token per client.
 */
export class JenkinsClient {
  private readonly webClient: AxiosStatic;
  private readonly hostUrl: string;
  private readonly auth: JenkinsAuth;

  /**
   * Constructor which takes in Jenkins host URL.
   * This enforces one Jenkins client per Jenkins host.
   * @param {AxiosStatic} webClient underlying web client implementation
   * @param {string} hostUrl base URL of the Jenkins host
   * @param {JenkinsAuth} auth details used to authenticate against Jenkins
   */
  constructor(webClient: AxiosStatic, hostUrl: string, auth: JenkinsAuth) {
    this.webClient = webClient;
    this.hostUrl = hostUrl.replace(/\/+$/, '');
    this.auth = auth;
  }

  /**
   * Starts build based on URL end.
   * @param {string} urlEnd URL end of the Jenkins job to start build for
   * @return {Promise<AxiosResponse<any, any>>} returns promise for axios response
   */
  async startBuild(urlEnd: string): Promise<AxiosResponse<any, any>> {
    return this.webClient.post(
        `/${urlEnd}/build?delay=0sec`,
        {},
        {
          baseURL: this.hostUrl,
          auth: {
            username: this.auth.username,
            password: this.auth.token,
          },
          validateStatus: (status: number): boolean => {
            switch (status) {
              case HttpStatus.CREATED:
                logger.info(`Successfully kicked off Jenkins build for ${this.hostUrl}/${urlEnd}`);
                return true;
              default:
                logger.error(`Status ${status} returned from Jenkins when attempting to kick off build: ${this.hostUrl}/${urlEnd}`);
                return true;
            }
          },
        });
  }

  /**
   * Gets Jenkins build info.
   * @param {string} urlEnd URL end for the Jenkins job
   * @param {number} buildNumber index of the build
   * @return {Promise<AxiosResponse<any, any>>} returns promise for axios response
   */
  async getBuildInfo(urlEnd: string, buildNumber: number)
    : Promise<AxiosResponse<any, any>> {
    return this.webClient.get(
        `/${urlEnd}/${urlEnd}/${buildNumber}/api/json`,
        {
          baseURL: this.hostUrl,
          auth: {
            username: this.auth.username,
            password: this.auth.token,
          },
          validateStatus: (status: number): boolean => {
            switch (status) {
              case HttpStatus.OK:
                logger.info(`Successfully obtained build #${buildNumber} info for ${this.hostUrl}/${urlEnd}`);
                return true;
              default:
                logger.error(`Status ${status} returned from Jenkins when attempting to get build #${buildNumber} info for ${this.hostUrl}/${urlEnd}`);
                return true;
            }
          },
        },
    );
  }

  /**
   * Gets Jenkins console output for build.
   * @param {string} urlEnd URL end for the Jenkins job
   * @param {number} buildNumber index of the build
   * @return {Promise<AxiosResponse<any, any>>} returns promise for axios response
   */
  async getConsoleOutput(
      urlEnd: string,
      buildNumber: number,
  ): Promise<AxiosResponse<any, any>> {
    return this.webClient.get(
        `/${urlEnd}/${urlEnd}/${buildNumber}/logText/progressiveText?start=0`,
        {
          baseURL: this.hostUrl,
          auth: {
            username: this.auth.username,
            password: this.auth.token,
          },
          validateStatus: (status: number): boolean => {
            switch (status) {
              case HttpStatus.OK:
                logger.info(`Successfully obtained build #${buildNumber} console output for ${this.hostUrl}/${urlEnd}`);
                return true;
              default:
                logger.error(`Status ${status} returned from Jenkins when attempting to get build #${buildNumber} console output for ${this.hostUrl}/${urlEnd}`);
                return true;
            }
          }},
    );
  }
}
