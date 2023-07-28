# Customizing Menus

The act of opening a menu is essentially the same as any other interaction. The client sends a `request_menu` interaction, which by default is handled by populating a menu with all available interactions for this time.

Normally, this default should suffice. Simply define appropriate [interactions](interactions.md) and there should be no need to deviate from this default behaviour.

If you really need an entirely custom menu, you can override the `request_menu` handler in your interactable.

```kotlin
define.interactable(items.weirdItem, "request_menu") {
    handle {
        val nonce = (it.params as NonceParams).nonce
        val menu = MenuBuilder.build {
            action(interactions.weirdCustomInteraction, "Why would you do this?")
        }
        it.networkContext?.send(MenuPacket(nonce, menu))
    }
}
```

Honestly, I can't think of a use case where you would actually want or need to do this.
