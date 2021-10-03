const core = require('@actions/core')
const { context, getOctokit } = require('@actions/github')

async function run() {
  try {
    // Get authenticated GitHib client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const token = process.env.GITHUB_TOKEN
    const github = getOctokit(token)

    // Get owner and repo form context of payload that trigger the action
    const { owner, repo } = context.repo

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const tagName = core.getInput('tag_name', {
      required: true,
    })

    // This removes the 'refs/tags' portion of the string, i.e. from 'refs/tags/v1.10.15' to 'v1.10.15'
    const tag = tagName.replace('refs/tags/', '')
    const releaseName =
      core.getInput('release_name', { required: false }) || tag
    const body = core.getInput('body', { required: false }) || ''
    const draft = core.getInput('draft', { required: false }) === 'true'
    const prerelease = /\d-[a-z]/.test(tag)

    // Create a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#create-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/#octokit-routes-repos-create-release
    github.rest.repos.createRelease({
      owner,
      repo,
      tag_name: tag,
      name: releaseName,
      body,
      draft,
      prerelease,
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
