# Prerequisites

- Git
- Java Development Kit 17 or higher for building and running a local server (if you install IntelliJ, it can manage JDKs for you)
- [Godot Engine - .NET 4.x](https://godotengine.org/) (with C# support) for client development or running the development version of the client
- [Visual Studio Code](https://code.visualstudio.com/) (not Visual Studio) for developing client-side code (GDScript and C#)
- [IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/?section=windows#:~:text=free%20to%20use-,IntelliJ%20IDEA%20Community%20Edition,-The%20IDE%20for) for developing server-side code or content

It's a good idea to create a folder to hold everything Eiradir related, as you'll be cloning at least two different repositories.

Clone the client and server repositories:

```sh
git clone https://github.com/Eiradir/eiradir-server.git
git clone https://github.com/Eiradir/eiradir-client.git
```

This may take a minute or two to complete.

# Getting Started with the Server

## Quickstart

If you don't intend to develop any server-side code or want to get started quickly, you can start the server instantly by running:

```sh
cd eiradir-server
./gradlew run
```

## Setup

To properly setup a server development environment, open the `eiradir-server` folder in IntelliJ IDEA.

It should automatically detect the Gradle project and start importing it - if not, it may prompt you in a toast notification to do so.

Once the project has finished importing, you can select a Run Configuration at the top (next to the Play button), where you should select `EiradirServer`. 
You can then press the Run button to start the server normally, or the Debug button to start it in debug mode.

# Getting Started with the Client

## Quickstart

If you are only going to work on server-side content, the easiest way is to just launch the [latest public release of the client](https://blaytheninth.itch.io/eiradir). 
However, this version may not always play well with the latest development version of the server, and won't contain any recently made changes.

A better alternative, even if you don't intend to develop any client-side code, is to simply launch Godot and import the `eiradir-client` folder's `project.godot` file to load the project.

It may take a minute or two to perform the initial asset import. Wait until the main scene is fully loaded (which indicates that importing has likely completed), then press Play.

If you press Play early, you may run into errors about missing resources or dependencies. In that case, simply press "Next" or "Ignore", stop the game, wait for the importing to finish, and only then press Play to start the game again.

## Setup

Start by following the Quickstart guide above, as you need the project imported into Godot either way.

In order to edit client-side code, it is best to use Visual Studio Code as it can offer some more advanced features over the inbuilt Godot code editor.

Open the `eiradir-client` folder in VS Code and install the [godot-tools](https://marketplace.visualstudio.com/items?itemName=geequlim.godot-tools) extension.

Then inside Godot, under `Editor -> Editor Settings`, find `Text Editor -> External` and enable `Use External Editor`. Select the `Code.exe` executable of VS Code, usually found under `C:\Users\YOURUSERNAME\AppData\Local\Programs\Microsoft VS Code\Code.exe`.

It might also be a good idea to enable `Auto Reload Scripts on External Change` in `Text Editor -> Behavior`, as there's an issue in Godot where it overwrites script files with an outdated local state when it runs into errors. While we haven't tested if this option helps mitigate that, it should probably do the trick and we'll find out for sure soon.

# First Steps

Now that you have both the server and client set up, it's time to try logging in and seeing if things worked as expected.

If you already have an Eiradir account, you can simply login through that - our authentication system allows you to login to local servers using that same account.

Characters however only live locally within each server, so you will have to create a new character. If this works without issues, that's already a good sign, as it means both the server and client are functional.

Finally, join the game with your newly created character and, assuming everything was set up correctly, you should be able to see the map and be able to walk around.

# Next Steps

- Some examples for things you could do next:
  - [Add a new item](https://github.com/Eiradir/eiradir-docs/blob/main/items.md) and [add functionality to it](https://github.com/Eiradir/eiradir-docs/blob/main/interactions.md)
  - [Add a new process](https://github.com/Eiradir/eiradir-docs/blob/main/processes.md) and [apply it to a trait](https://github.com/Eiradir/eiradir-docs/blob/main/traits.md)
  - [Add a new command](https://github.com/Eiradir/eiradir-docs/blob/main/commands.md)
- If you are interested in contributing to the project, read through the [Contribution Guide](https://github.com/Eiradir/eiradir-docs/blob/main/CONTRIBUTING.md).
