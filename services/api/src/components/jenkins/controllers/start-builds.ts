import {Request, RequestHandler} from 'express';
import axios, {AxiosResponse, isAxiosError} from 'axios';
import {HttpStatus} from '../../../lib/http/HttpStatus';
import requestMiddleware from '../../../middleware/request-middleware';
import {JenkinsClient} from '../clients/jenkins-client';
import {HostJob} from './interfaces/HostJob';
import {StartBuildBody} from './interfaces/StartBuildBody';
import {startBuildsSchema} from './request-schemas/start-builds';
import logger from '../../../lib/logger/logger';


const postStartBuilds: RequestHandler = async (req: Request<{}, {}, StartBuildBody>, res) => {
  const {build} = req.body;
  const requests: {promise: Promise<AxiosResponse<any, any>>, hostUrl: string, jobEnd: string}[] = [];
  const successfulBuilds: HostJob[] = [];
  const failedBuilds: HostJob[] = [];
  build.hosts.forEach((host) => {
    const hostUrl = host.url;
    const jenkinsClient = new JenkinsClient(axios, hostUrl,
        {username: 'jonathan', token: '114d8d2b3ab2593b60f7aca6360279b217'});
    host.jobs.forEach((job) => {
      requests.push({promise: jenkinsClient.startBuild(job.end), hostUrl: host.url, jobEnd: job.end});
    });
  });

  for (const request of requests) {
    let status: number = 500;
    try {
      logger.info(`Starting Jenkins build for : ${request.hostUrl}/${request.jobEnd}`);
      const response = await request.promise;
      status = response.status;
    } catch (err) {
      if (isAxiosError(err)) {
        logger.error(`Axios Error: ${err}`);
      } else {
        logger.error(`Error occurred: ${err}`);
      }
    }
    if (status === HttpStatus.CREATED) {
      successfulBuilds.push({hostUrl: request.hostUrl, jobEnd: request.jobEnd});
    } else {
      failedBuilds.push({hostUrl: request.hostUrl, jobEnd: request.jobEnd});
    }
  }

  return res.status(HttpStatus.OK).json({failedBuilds, successfulBuilds});
};

export default requestMiddleware(
    postStartBuilds,
    {validation: {body: startBuildsSchema}, requiresAuthentication: false},
);
