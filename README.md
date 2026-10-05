# Hello DevOps

A beginner website with GitHub Actions CI. AWS deployment comes in a later lesson.

## Files

- `index.html`: page content; open it directly in a browser.
- `styles.css`: colors and layout.
- `script.js`: Say hello button behavior.
- `package.json`: named test and build commands.
- `tests/site.test.mjs`: page, asset, and button smoke tests.
- `scripts/build.mjs`: packages public files into `dist/`.
- `.github/workflows/ci.yml`: GitHub automation recipe.
- `.gitignore`: excludes generated files from Git.

## Try locally

Install Node.js 24 from https://nodejs.org/ if needed. In this project directory:

```sh
npm test
npm run build
```

No external dependencies are used, so no npm install is needed. The build copies
HTML/CSS/JS into dist/. Static files need packaging here, not compilation.
Open index.html in your browser and click Say hello.

## Publish to GitHub

Create an empty repository named hello-devops at https://github.com/new.
Do not initialize it with a README, license, or .gitignore. In this project folder:

```sh
git init -b main
git add .
git commit -m "Create hello website and CI workflow"
git remote add origin https://github.com/YOUR_USERNAME/hello-devops.git
git push -u origin main
```

Replace YOUR_USERNAME first. If Git asks for identity, use `git config user.name
"Your Name"` and `git config user.email "YOUR_GITHUB_EMAIL"`, then retry the commit.
Authenticate with GitHub's supported Git sign-in method; your account password
is not an HTTPS Git password. GitHub CLI users can use `gh auth login`.

`git add` selects changes; `git commit` records a local snapshot; `git push`
sends commits to GitHub. Saving or committing locally does not trigger Actions.

## Watch the run

Repository → Actions → Website CI → newest run → test-and-build.
Expand steps to read logs. After success, open the run summary and download the
website artifact, extract it, and open index.html. Sign in to download artifacts.
An artifact is a saved package, not a publicly hosted website.

## Understand the workflow

| Key | Meaning |
| --- | --- |
| name | Workflow display name |
| on | Trigger events |
| push.branches | Only pushes to main trigger automatic runs |
| workflow_dispatch | Allow manual runs from the Actions tab |
| permissions | Allow reading repository contents |
| jobs | Groups of work; we have one job |
| runs-on | The runner machine: GitHub-hosted Ubuntu |
| steps | Tasks executed sequentially in the job |
| uses | Invoke a reusable action |
| run | Execute a shell command |
| with | Configure an action's inputs |

GitHub creates a temporary runner. checkout downloads your repository onto it;
setup-node prepares Node 24; npm test checks the site; npm run build creates dist/;
upload-artifact saves that output before the temporary runner disappears.
Your laptop can be off after pushing. Steps in one job share a filesystem;
separate jobs can run concurrently unless dependencies are set with `needs`.
The @v7 suffix is the action's version, not Node's version.

Tests check a title, heading, mobile viewport, existing nonempty CSS/JS files,
and button behavior using a simulated document. They are smoke tests, not full
visual/browser tests. A failed test normally skips later build/upload steps.
Open the first failed step's logs to diagnose it. A new fix needs a new push;
rerunning an old workflow run uses its old commit.

## Make a change

Change Version 1.0 to Version 2.0 in index.html:

```sh
npm test
git add index.html
git commit -m "Update website to version 2.0"
git push
```

Watch the new run and download its artifact. It should show Version 2.0.
The earlier run's artifact still contains its earlier version.

Optional failure exercise: change the stylesheet href to missing.css, commit,
and push. The asset test fails; build and upload are skipped. Restore styles.css,
commit, and push again to get a green run.

CI automatically checks and packages code. CD will deploy the tested files to
S3 and expose them through CloudFront in the next lesson.

## Official documentation

- https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows
- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
- https://docs.github.com/en/actions/tutorials/store-and-share-data
- https://github.com/actions/checkout
- https://github.com/actions/setup-node
- https://github.com/actions/upload-artifact
