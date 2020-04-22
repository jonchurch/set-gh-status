# Set Github Status

## Description

Set your [Github User Status](https://help.github.com/en/github/setting-up-and-managing-your-github-profile/personalizing-your-profile#setting-a-status) from the command line.

## Usage

**Requires a Gitub Personal Access Token with the `user` and `notifications` scopes. Go [here to create one](https://github.com/settings/tokens).**

You can either export your token as an environment variable `SET_STATUS_TOKEN`, or pass it as an option:

```sh
export SET_STATUS_TOKEN=<your_token>

set-gh-status -t <your_token> -m "Shoveling code"
```

To use `set-gh-status`, either install it globally from npm, or run it with `npx`:

```shell
npx set-gh-status -t <your_token> -m "Squashing bugs and giving hugs" -e ❤️

npm i -g set-gh-status
```

### Options

To see all options run `set-gh-status --help`.

```sh
npx set-gh-status --help

Options:
  -m, --message  status message to set
  -e, --emoji    status emoji, in unicode or :emoji: form
  -b, --busy     indicate if busy                                      [boolean]
  -t, --token    Github personal access token, requires user scopes
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]
```
