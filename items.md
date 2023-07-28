# Adding an Item

## 1. Register the item in a [server plugin](server-plugins.md) initializer

In most cases, this can be done in our existing content plugin, unless you want to specifically separate an item out into a separate content module.

```kotlin
class Items(define: RegistryBuilders) : Initializer {
    init {
        // ...
        define.item("cool_sword") {
            // optionally can define properties such as the max stack size or tags
        }
    }
}
```

## 2. Assign an id to the item

When stored in the database or sent over the network, we use a numneric id to represent the item. This id must be statically defined in the id_mappings.ini file of the server.

```ini
[items]
# ...
1300 = "cool_sword"
```

## 3. Create an iso for the item

An "iso" is any visual representation of an isometric object or being - a pig is an iso, a sword is an iso, a tree is an iso and a wall is an iso.

The client does not need to know about the specifics of an item - it only knows isos.

In the `data/isos` folder of the client, create a new resource of type `IsoDefinition`.

The most important properties to fill in are "Scene", which is a Godot scene containing the visual representation of the object (usually just a Sprite with offsets applied), 
and for items that can be held in inventories, "Texture", which is the simple 2d texture to use as an item icon.

## 4. Assign an id to the iso

Just like an item, an iso also needs a numeric id. By convention, item isos should follow a rule of `10000 + itemId`. The first 10000 iso ids are reserved for player races, monsters and animals.

Currently, id mappings must be manually updated on **both client and server** - each repository has its own id_mappings.ini file.

```ini
[isos]
# ...
11300 = "cool_sword"
```

## 5. Test that everything worked

After restarting the server and client, run `/item get cool_sword` and you should find your newly created item in your inventory.

# Reusing an existing item graphic

Sometimes, we may want to have a new item but don't necessarily have a unique graphic for it (e.g. for special quest variants of an item).

In that case, you can skip defining the iso, and instead just specify a custom iso name for the item:

```kotlin
class Items(define: RegistryBuilders) : Initializer {
    init {
        define.item("cool_sword") {
            isoName = "sadakari_sword"
        }
    }
}
```

Our cool sword will still be a completely separate item, but will use the visual of the sadakari sword. This means that items can be added without requiring a client update, as long as they reuse an existing visual.
