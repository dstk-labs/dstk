export const site = {
  description:
    "dstk is an open source data science toolkit for model registries, deployment, "
    + "and monitoring. Register, deploy, and track ML models from Python, CLI, or web.",
  name: "dstk",
  title: "dstk: Model registry, deployment & monitoring that doesn't suck",
};

export const repoUrl = "https://github.com/dstk-labs/dstk";

export const links = {
  discussions: `${repoUrl}/discussions/new/choose`,
  docs: `${repoUrl}#readme`,
  issues: `${repoUrl}/issues/new/choose`,
  repo: repoUrl,
};

export const installCommand = {
  args: "install",
  program: "pip",
  target: "git+https://github.com/dstk-labs/pydstk.git",
};

export const installCommandText = `${installCommand.program} ${installCommand.args} ${installCommand.target}`;
