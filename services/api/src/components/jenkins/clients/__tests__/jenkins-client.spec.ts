import {JenkinsClient} from '../jenkins-client';

describe('Jenkins Client Unit Tests', () => {
  const hostUrl = 'http://localhost:8080';
  const jenkinsAuth = {username: 'jenkins', password: 'password'};
  it('Able to instantiate class', async () => {
    const jenkinsClient = new JenkinsClient(
        // @ts-ignore
        {},
        hostUrl,
        jenkinsAuth,
    );

    expect(jenkinsClient).not.toBeNull();
    expect(jenkinsClient).not.toBeUndefined();
    expect(jenkinsClient).toBeInstanceOf(JenkinsClient);
  });
});
