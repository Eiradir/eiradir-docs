---
title: Interactions
---

# Adding an Interaction

Interactions are actions that the client can take against the world, such as picking a fruit from a tree, casting a spell, talking to an NPC, or dropping an item.

In most cases, an interaction itself just consists of a name (e.g. "eat") and a handler (the logic for eating).

```kotlin
class Items(define: RegistryBuilders) : Initializer {
    init {
        val eat = define.interaction("eat") {
            handle {
                println("nomnom")
            }
        }
}
```

We could then define an "interactable", which is the connection between an item and an interaction.

```kotlin
define.interactable("edible", eat) // grant the "eat" interaction to all items that have the tag "edible"

define.interactable(items.apple, eat) // or specifically grant the "eat" interaction to the apple item
```

It is also possible to override an interaction for a specific item. In that case, the default handler for the interaction (printing "nomnom" in this example) will not run.

```kotlin
define.interactable(items.apple, eat) {
    handle {
        // this will run instead of the default handler for "eat"
        println("apples are delicious!")
    }
}
```

And finally, as interactables also automatically populate the right click menu of an iso, you can specify requirements and conditions for an interactable.

```kotlin
define.interactable(items.beehive, interactions.eat) {
    handle {
        println("omG you are eating BEEEEES")
    }
    conditionally {
        // if this condition fails, the interaction will not show up in the right click menu
        it.actor.reallyLovesHoney == true
    }
    requires {
        // otherwise, if this condition fails, the interaction would still display but will show up as disabled in the menu
        it.actor.desperateForHoney == true
    }
}
```

## Next Steps

- See [Processes](processes.md) to learn how to have an interaction trigger a time-based process or status effect.
