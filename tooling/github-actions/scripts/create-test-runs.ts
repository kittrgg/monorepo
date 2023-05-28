import { setFailed, info } from '@actions/core';
import { context, getOctokit } from '@actions/github';

interface Context {
  eventName: 'deployment_status' | 'deployment';
  sha: string;
  ref: string;
  payload: {
    deployment: {
      sha: string;
      ref: string;
    };
    deployment_status: {
      state: 'error' | 'failure' | 'success';
      target_url: string;
      environment: string;
    };
  };
}

const owner = 'kittrgg';
const repo = 'kittr';

const SHA = process.env.SHA;
if (!SHA) {
  setFailed('No SHA was provided.');
  throw new Error('No SHA was provided.');
}

const ref = process.env.REF;
if (!ref) {
  setFailed('No HEAD_REF was provided.');
  throw new Error('No HEAD_REF was provided.');
}

export function getOctokitClient(): ReturnType<typeof getOctokit> {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    const errorMessage = 'GITHUB_TOKEN is not defined';
    setFailed(errorMessage);
    throw new Error(errorMessage);
  }

  return getOctokit(GITHUB_TOKEN);
}

const getContext = () => context as unknown as Context;
const getTargetUrl = () => getContext().payload.deployment_status.target_url;
const getEnvironment = () =>
  getContext().payload.deployment_status.environment.split(' ').slice(-1)[0];

info('Hello, I am here to help you.');
info(`Your ref is: ${ref}`);

const main = async () => {
  const check = await getOctokitClient().rest.checks.create({
    owner,
    repo,
    name: `Playwright - ${getEnvironment()}`,
    head_sha: SHA,
    status: 'in_progress',
  });

  const dispatch = await getOctokitClient().rest.actions.createWorkflowDispatch(
    {
      workflow_id: `playwright-${getEnvironment()}`,
      ref,
      owner,
      repo,
      inputs: {
        deployment_url: getTargetUrl(),
        // @ts-expect-error Incomplete types from library.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        check_run_id: check.id,
      },
    },
  );

  return { dispatch, check };
};

main()
  .then(({ dispatch, check }) => {
    info(`Check created on PR: ${check.url}`);
    info(`Tests running: ${dispatch.url}`);
  })
  .catch((err) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    setFailed(err.message);
  });
