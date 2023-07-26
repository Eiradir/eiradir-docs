# Server Plugins

The Eiradir server utilizes a modular structure in which functionality and content is separated into individual "plugins".
The philosophy here is that it should be easy to extend or modify the server software without requiring intensive knowledge of the inner workings of different systems.

While currently there is no strictly defined API (either between the server and plugins, or between plugins themselves), 
the goal would be to eventually end up with an extensible platform where entire systems can be swapped out between different server distributions without requiring large refactors across the board. 

This approach also simplifies the learning curve and encourages a clean separation of concerns, as developers can be sure that all code related to a particular system will be self-contained within its plugin, 
rather than being hardcoded and spread across different internal server classes.

## Creating a Plugin

The first thing to do in a new plugin is creating a plugin's entrypoint class. These are usually suffixed `Plugin` (e.g. `VeryCoolPlugin`) and they must implement the `EiradirPlugin` interface.
These entrypoint classes should not contain any logic, and instead only provide a module to the dependency injection context - essentially "registering" this plugin's classes with the server.

```kotlin
class VeryCoolPlugin : EiradirPlugin {
    override fun provide() = module {
        // TODO Register your plugin's initializers etc. here - see next step
    }
}
```

Plugins are loaded through a Java ServiceLoader. Therefore, once you've created your plugin class, you also have to add it to the services file in the `server-dist` project, found in the resources under `META-INF/services/net.eiradir.server.plugin.EiradirPlugin`.

In that file, simply append a new line referencing the full class name incl. package of your plugin's entrypoint class, e.g. `net.eiradir.server.verycool.VeryCoolPlugin`.

## Adding an Initializer

Let's say you want your plugin to add a new command - you will need to register an `Initializer` in your plugin's module that can use the `CommandDispatcher` to register a new command.

```kotlin
class VeryCoolPlugin : EiradirPlugin {
    override fun provide() = module {
        singleOf(::VeryCoolCommands) bind Initializer::class
    }
}
```

It is important to specifically bind the special interfaces (such as `Initializer`) as shown above for them to be picked up by the dependency injection system.

```kotlin
class VeryCoolCommands(dispatcher: CommandDispatcher<CommandSource>) : Initializer {
    init {
        dispatcher.register(
            literal("hello").executes {
                it.source.respond("Hello World!")
            }
        )
    }
}
```

The dispatcher in the class constructor will automatically be provided by the dependency injection system. In a similar manner, this class or any classes you provide in the plugin's module can gain access to other components of the server as well.

In a similar manner, you could also register new items (using `RegistryBuilders`), new packets (using `PacketFactory`) or run any arbitrary startup code for your plugin.

## Adding an EventBusSubscriber

An EventBusSubscriber is much like an Initializer in that it gets eagerly loaded, but additionally it will also be registered to the server's event bus, meaning any methods annotated with `@Subscribe` and an event parameter will be eligible for receiving event calls.

```kotlin
class VeryCoolPlugin : EiradirPlugin {
    override fun provide() = module {
        singleOf(::VeryCoolEvents) bind EventBusSubscriber::class
    }
}
```

```kotlin
class VeryCoolEvents : EventBusSubscriber {
    @Subscribe
    fun onServerStopped(event: ServerStoppedEvent) {
        println("Goodbye Cruel World")
    }
}
```

## Adding a KtorInitializer

This should be rarely ever needed, but the dependency injection system allows for us to specify initializers specific to Ktor, which is the framework we use to run an embedded HTTP server.
This HTTP server is generally only used for authentication and account interactions such as creating or deleting a character. For actual gameplay code and client-server interactions we use raw TCP packets via Eiradir's own protocol instead. 

```kotlin
class VeryCoolPlugin : EiradirPlugin {
    override fun provide() = module {
        singleOf(::VeryCoolKtorSetup) bind KtorInitializer::class
    }
}
```

```kotlin
class VeryCoolKtorSetup : KtorInitializer {
    override fun Application.configureRoutes() {
        get("/hello") {
            call.respond("Hello World")
        }
    }
}
```

## Adding an EntitySystem

Much like in the other examples, you can also provide and bind an `EntitySystem` to have it automatically registered to the server's ECS engine.
