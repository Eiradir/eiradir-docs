# Defining Processes

A process is any triggerable sequence of asynchronous and potentially interruptible actions and effects. 
Or in more human terms, a process would be a time-based action such as picking fruits from a tree, or a status effect such as being poisoned.

Processes can be active or passive, whereas an active process is generally interruptible through actions such as movement, combat, taking damage, or starting another active process, while passive processes run in the background (much like status effects).

## Foreword

This guide is still largely based on the first proof of concept for processes. While the majority of what is shown here is already implemented, things may change slightly over time as we start implementing actual game systems and fine-tune the framework.

## Simple Example: Fruit Picking

Here is a very simplified example of picking fruits from a tree.

We define a process that waits for a second (1000 milliseconds) and then gives the player an apple. This process does not repeat on its own - it is essentially just a delayed action.

We also define an interaction for picking fruits - this interaction triggers the `fruitPicking` process we defined above, and should it complete successfully, will `repeat` it.

This means the process will run indefinitely until interrupted, giving the player an apple every second. By default, processes interrupt on a few default factors, such as movement, combat, or taking damage.

Lastly we also grant this interaction to all items tagged `fruit_tree`, which will make the action available in their interaction menu.

```kotlin
val fruitPicking = define.process("picking_fruit") {
    timed {
        duration = 1000
    }
    item("apple", 1)
}

val pickFruits = define.interaction("pick_fruits") {
    handle {
        it.process(fruitPicking)?.onSuccess {
            it.repeat()
        }
    }
}

define.interactable("fruit_tree", pickFruits)
```

## Declarative vs Imperative Blocks

Processes are the most advanced system the Eiradir server offers, as they are designed to cover a wide variety of use cases.

When we define a process, we are in a declarative block. That means, even though our code looks like it would run sequentially and block execution, it only actually creates a list of asynchronous tasks for the process to go through.

```kotlin
define.process("picking_fruit") {
    timed {
        duration = 1000
    }
    println("Hello World") // this will print only once, immediately on server startup as the process gets registered, as we are in a declarative block
    item("apple", 1)
}
```

In the above example, while it may look like we would print "Hello World" after a second has passed, that is not the case. In reality, the above code is more akin to something like this:

```kotiln
tasks.add(TimedTask {
    duration = 1000
})
println("Hello World")
tasks.add(ItemTask("apple", 1))
```

Within the process definition itself, we are always in this declarative state. However, individual tasks may provide you with an imperative block.
An imperative block runs only once the task is actually executed, and you will have access to the `ProcessContext` within them, which is an object holding information about the active process that triggered this task.

An example for such an imperative block is the timed task: it is very likely that a process may want to make the duration of an action such as picking a fruit be dependent on the player's skills and attributes.
Therefore, the duration of the timer is set within an imperative block, meaning it can access the `ProcessContext`, meaning it can access the attributes and skills of the player that triggered the process.

```kotlin
define.process("picking_fruit") {
    timed {
        println("FRUITS!!") // this will print whenever this process is triggered and executes the timed task
        duration = 1000 * it.entity.attributes.dexterity / 10
    }
    println("Hello World") // this will print only once, immediately on server startup as the process gets registered, as we are in a declarative block
    item("apple", 1)
}
```

The easiest way to tell whether you're in a declarative block (runs only once on registration) or an imperative block (runs upon execution) is by looking for the availability of a ProcessContext in your `it` variable.

## Advanced Example: Mining

```kotlin
define.process("mining") {
    timed {
        name = "Mining"
        duration = 2000 // we also have access to the ProcessContext in here so we could vary duration based on skill/buff
    }
    chance(0.05f) {
        pick(
            InformTask("Your pickaxe gets stuck in the ore. You take a moment to pull it out."),
            InformTask("As you strike the node, a stone chip flies towards your face."),
            InformTask("You take a moment to rest."),
            InformTask("You get distracted by something else."),
            InformTask("The pickaxe almost slips from your hands. You regain your grip."),
            InformTask("You get tired. You take a moment to wipe the sweat from your forehead.")
        )
        learn("mining", 1)
        failure()
    }
    damageTool()
    applyHunger()
    depleteOreVein()
    chance(0.7f) {
        pick(
            ItemTask("stones") to 90,
            ItemTask("iron_ore") to 60
        )
        learn("mining", 2) // learn twice as fast on success
        success()
    }
}
```

Like I mentioned before, processes are an advanced system. :) However, once you understand the general idea, they are very powerful and can represent a variety of different game systems in a consice and flexible manner.

In the above example, we define a mining process that yields some form of result every 2 seconds.

First, there is a 5% chance for the process to interrupt itself and fail here.

If we do run into that chance, we use a `pick` task, which chooses on of the tasks within, allowing us to specify different kinds of interruption messages to display to the user using an `InformTask`.
From there, we grant the player some mining skill xp, and then mark the process as failed using a `failure` task. Once the process runs into a failure task, it will stop executing.

If we did not run into the 5% chance of interruption, failure will not be called, and as such, the process will continue with the next instructions.
We damage the pickaxe that was used, apply some hunger to the player, and deplete the ore vein we're mining from.
These are all helper functions for tasks that operate on the context and it's also possible to create custom tasks for custom behaviour.

Finally, we specify a 70% chance for a successful mine. 
We use a pick task again to choose an item from the list of items, although this time we use `to 90` and `to 60` to apply different weights to the choices, making stones more likely to appear then iron ore.
In the end, we grant the player mining skill xp and mark the process as succeeded. Marking a process successful is more so a formality at the moment, as there is no special handling for a process that completed vs a process that succeeded.

### Caveat in this Example

The Gigabrains amongst you will have noticed a problem with the above process, and if you have, you are correct.

As we are in a declarative block when defining the `chance` tasks, we are unable to have the chance be dependent on any context information, such as the player's mining skill or attributes.
The same goes for the `pick` task - the weights are statically defined upon process creation, making it impossible to support effects such as potions that make the player more likely to find certain ores.

This was an oversight when initially implementing this proof of concept, but it's not a big problem to solve. In the future, the chance task will likely end up looking more like the timed task, such as

```kotlin
chance { // imperative block
  of = 0.7
  then { // a funny declarative block that gets triggered by an imperative block?
    // ..
  }
}
```

or

```kotlin
chance({ // imperative block
  of = 0.7
}) {
  // declarative block
}
```

or

```kotlin
chance { // declarative block
  of = { 0.7 /* imperative block */ }
  then {
     // declarative block
  }
}
```

which would then once again grant us access to the ProcessContext for determining the chance value.

Or maybe we'll get rid of declarative blocks in the future altogether, and just construct a fresh individual task list whenever the process gets applied (probably not as that makes persistence a lot harder).
Or maybe we'll try to make use of coroutines and write theses processes as suspend functions ((probably not as that makes persistence a lot harder).
The future implementation details are still somewhat up in the air, and processes may see minor changes in how they are declared, however, the general idea and DSL-like style of defining them is here to stay.

## Forking and Interruptions

At some point, I'll have to clean this document up and replace these with real-life examples. The following defines a process that loops forever, but fails if it gets interrupted.

First, it makes use of an `initialize` block. This block is executed whenever the process is first applied, or loaded back in (did I mention processes can be persisted? there's a checkpoint feature).
To be completely honest I can't remember why I used initialize in this case - since there is no checkpoints defined in this process, all declared tasks would always run anyways.

Either way, what we do here is to then fork into a subprocess. This will create a child process, which will passively run alongside the other process, and by default, interruptions and failures are shared between the two.
This can be useful for having passive side effects run alongside an active process.
In our example here, we have this subprocess repeat indefinitely every second, and give it a 10% chance to interrupt itself (and with it, the parent process as well).

Then, within our actual process, we define how we want to handle interruptions using the `interrupted` block. In this case, we inform the player and fail the process.

From there, we start repeating indefinitely every second, informing the player with our loop message. When run, this process will repeat a few times until the subprocess hits its 10% chance and interrupts both processes.

```kotlin
initialize {
    fork {
        repeat {
            chance(0.1f) {
                interrupt()
            }
            timed {
                duration = 1000
            }
        }
    }
}

interrupted {
    inform("I GOT INTERRUPTED")
    failure()
}

repeat {
    inform("I WILL LOOP FOREVER WAHAHAHA unless I get interrupted")
    timed {
        duration = 1000
    }
}
```

## Checkpoints and Events

Here's another overly complex example, this time implementing a curse that will kill the player after 60 seconds.

The first new task we introduce here is the `either` block. This is a task that will block until either of the tasks within have completed.

We define a timer and this time, we also give it a name: "curseTimer01". By default, a task will generate its own name at random - 
by specifying a name ourselves, we ensure that the data belonging to this timer can be persisted and loaded back in properly.
This means that if the player logs out and back in, while the process will start from the beginning (including informing "ayo something wrong"), the timer will remember the time that had already passed.

Another option for the either block to proceed is if the `awaitProcess` task finishes. This task specifically waits for a process to be triggered on the player, and then stops the curse.
This means you could create an antidote for this curse by having it trigger the "curse_lifted" process. Remember that execution will always stop after `failure()`, 
so the only way for this proceed to actually proceed past the either block is for the timer to run out.

Once the timer does run out, we have another new task: the `checkpoint` task. This is used in conjunction with persistent processes.
Once we come across a checkpoint, even if we log out and back in, the process will resume from that checkpoint, and skip all tasks before it (except for those within an `initialize` block).
This means, after the first 30 seconds passed, the player will no longer be informed "ayo something wrong" if they were to relog - now they'd be told they're feelin kinda poopy.
A new timer starts, again for 30 seconds, again with a name specified. This time, the antidote would no longer work, since the either block and awaitProcess event only applied to the first half of the curse.

Once the second timer passes, we mark another checkpoint for good measure, and then kill the player.

```kotlin
define.process("curse") {
    inform("ayo something wrong")
    either {
        timed("curseTimer01") {
            duration = 30000
        }
        awaitProcess("curse_lifted") {
            inform("you feel better phew")
            failure()
        }
    }
    checkpoint("curseTimer01Done")
    inform("You feelin kinda poopy uh oh")
    timed("curseTimer02") {
        duration = 30000
    }
    checkpoint("curseTimer02Done")
    inform("oh no you die now")
    die()
}
```
