---
title: Tooltips
---

# Customizing Tooltips

The act of viewing a tooltip is essentially the same as any other interaction. The client sends a `request_tooltip` interaction, which has some simple default implementations for the different kinds of items and entities.

Currently, the only way to override this default is by overriding the interaction handler. This is not ideal since it reaches pretty far into implementation details.

```kotlin
define.interactable(items.apple, "request_tooltip") {
    handle {
        val nonce = (it.params as NonceParams).nonce
        val tooltip = TooltipBuilder.build { title("Custom Tooltip") }
        it.networkContext?.send(TooltipPacket(nonce, tooltip))
    }
}
```

In the future, there will likely be an easier way to define custom tooltips especially in regards to items.
