import {BuildHost} from './BuildHost';

export interface StartBuildBody {
  build: {
    hosts: Array<BuildHost>;
  }
}
