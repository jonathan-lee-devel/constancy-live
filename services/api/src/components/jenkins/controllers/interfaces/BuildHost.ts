import {BuildJob} from './BuildJob';

export interface BuildHost {
  url: string;
  jobs: Array<BuildJob>;
}
