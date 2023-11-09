---
title: How to Contribute
---

# Contribution Guide

Thank you for your interest in contributing to Eiradir! This contribution guide aims to provide you with all the necessary information to get started.

## Ways to Contribute

There are several ways you can contribute to the project:

### Bug Reports

If you encounter any bugs or issues, please report them. You can create an issue in our issue tracker. Make sure to describe the issue in detail, and if possible, provide screenshots, logs, and steps to reproduce the issue.

### Feature Requests

If you have a new idea for a feature or think something could be improved, feel free to suggest it! Please create an issue in our issue tracker and describe your idea in detail.

### Code and Asset Contributions

You can contribute by writing code or making assets. This could be fixing bugs, adding new features, or improving the existing codebase. To do this:

1. Fork the repository
2. Create a new branch for your changes
3. Make your changes
4. Submit a pull request

This process is described in more detail in the following sections.

### Documentation

This documentation itself is open source as well, and we encourage you to help us improve it by creating Issues or Pull Requests for things you've found lacking or missing.

### Testing

Testing new features and changes is critical. You can help by testing the game and providing feedback.

### Community

Become active in our community. Help answer questions, provide support to others, and promote our project!

However, if you do choose to promote the project, please do not make it appear as though you were an official source.

## Finding tasks to work on

The best way to learn and to stay motivated is by choosing tasks that you personally wish to work on. 
These don't necessarily need to be tasks that already been posted on the issue tracker - 
if there's a bug that's been bugging you, or you have an idea for how to enhance an existing feature, or even want to build a completely new feature - then that's probably a good place to start!

We do have to follow some direction of course, so we can't guarantee that your work will be included in our releases. Therefore, feel free to bring your ideas up to the Core team if you are not quite sure whether your idea would work out.

If you really can't think of anything or have already contributed before, we label issues that are open and ready for contribution as `help wanted`, 
and issues that may be a good starting point for beginners are additionally labeled as `good first issue`.

- [Find Tasks for the Client](https://github.com/Eiradir/eiradir-client/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)
- [Find Tasks for the Server](https://github.com/Eiradir/eiradir-server/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)

## Contributing to the Server

When contributing server-side code or content, keep the following things in mind:

- Use an appropriate IDE and ensure your code compiles and runs.
- Follow the example of existing code when it comes to formatting and naming decisions.
  - Avoid conditions or loops without braces.
  - Avoid lifting return values out of branches unless you have a one-liner akin to a ternary operator.
- All code must adhere to the official Kotlin formatting guide.
  - If you are using IntelliJ, simply triggering an auto-format using `CTRL+Alt+L` will be enough.
  - You can also enable `Reformat Code` and `Optimize Imports` in the Commit dialog of IntelliJ (press the cog button at the bottom).

## Contributing to the Client

When contributing client-side code or content, keep the following things in mind:

- Follow the example of existing code when it comes to formatting and naming decisions.
  - Avoid conditions or loops without braces.
  - Follow the official Godot naming conventions for GDScript.
- When adding third party assets
  - ensure that its license allows `commercial use`, `redistribution` and is `not infectious`.
  - include the license text in a LICENSE file either in the repository root or alongside the file(s)
  - add an entry in the repository's README file indicating the existence of this third party asset and its license
- When adding non-code assets you've created yourself
  - You get the option on whether you want to license your asset submission under the repository's open source license or only grant rights to the official Eiradir project specifically.
  - Make sure you read through the [CLA](https://gist.github.com/BlayTheNinth/cdf103e092aa98abd7a15b7781c007c9) and state that you would like to submit your content as `All Rights Reserved` within your Pull Request.

## Pull Request Process

1. Ensure your code meets our style guidelines (see above).
2. Make sure your changes are well tested.
3. Write a clear and detailed description of the changes in your pull request.
4. After submitting a pull request, wait for a project maintainer to review it. They may request changes.

Please note that we follow a code review process to ensure the quality of the codebase.

## Contact

If you have any questions or need further clarification, please don't hesitate to contact us:

- [Discord](https://discord.gg/BsDu2JB)
- [Forums](https://forum.eiradir.net)
