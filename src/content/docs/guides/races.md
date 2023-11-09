---
title: Races
---

# Adding a Race

Races are the base definition for any generally motile entity such as humanoids, animals and monsters.

## 1. Register the race in a [server plugin](server-plugins.md) initializer

In most cases, this can be done in our existing content plugin, unless you want to specifically separate a race out into a separate content module.

```kotlin
class Races(define: RegistryBuilders) : Initializer {
    init {
        // ...
        define.race("chicken") {
            // optionally can define properties about the race
        }
    }
}
```

### Assign an id to the race

When stored in the database or sent over the network, we use a numeric id to represent the race. This id must be statically defined in the `id_mappings.ini` file of the server.

```ini
[races]
# ...
11 = "chicken"
```

## 3a. Create an iso for the race (optional)

An "iso" is any visual representation of an isometric object or being - a pig is an iso, a sword is an iso, a tree is an iso and a wall is an iso.

The client does not need to know about the specifics of an item - it only knows isos.

In the `data/isos` folder of the client, create a new resource of type `IsoDefinition`.

The most important properties to fill in are "Scene", which is a Godot scene containing the visual representation of the object (usually just an animated sprite with offsets applied).

Reference existing iso definitions (`data/isos`) and iso scenes (`assets/characters`) to find your way around.

### Assign an id to the iso

Just like a race, an iso also needs a numeric id. By convention, a race's iso id should match the race id.

Currently, id mappings must be manually updated on **both client and server** - each repository has its own id_mappings.ini file.

```ini
[isos]
# ...
11 = "chicken"
```

## 3b. Reuse an existing race graphic

Sometimes, we may want to have a new race but don't necessarily have a unique graphic for it (e.g. for special variants of a race).

In that case, you can skip defining the iso, and instead just specify a custom iso name for the race:

```kotlin
class Races(define: RegistryBuilders) : Initializer {
    init {
        define.race("chicken_of_doom") {
            isoName = "chicken"
        }
    }
}
```

Our chicken of doom will still be a completely separate race, but will use the visual of the regular chicken. This means that races can be added without requiring a client update, as long as they reuse an existing visual.

## 4. Test that everything worked

After restarting the server and client, run `/race set chicken_of_doom` and you should find yourself in your new body.
