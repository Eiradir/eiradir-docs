# Adding a HUD

HUDs are any UI overlay or window that is displayed on the client and has a server-side counterpart providing data.

The chat, stat bars, minimap, equipment and even the cursor is all known as a HUD to the server.
We treat even seemingly client-side components (such as the minimap) as a HUD under the same system, as that will make it a lot easier for us to support more advanced use cases in the future.
If we ever need any part of a HUD component react to an influence or data from the server, we'll have the infrastructure already in place and do not need to start implementing special cases in the client.

## 1. Register the HUD in a [server plugin](server-plugins.md) initializer

In most cases, this can be done in our existing content plugin, unless you want to specifically separate a HUD out into a separate content module.

```kotlin
class HudTypes(define: RegistryBuilders) : Initializer {
    val veryCoolHud = registries.hudTypes.register(HudType("very_cool_hud"))
}
```

### Assign an id to the HUD

When sent over the network, we use a numneric id to represent the HUD. This id must be statically defined in the `id_mappings.ini` file of **both client and server**.

```ini
[hud_types]
# ...
8 = "very_cool_hud"
```

## 3. Create a server-side representation of the HUD

On the server, a HUD is a simple class extending the `Hud` abstract class. When extending it, we provide two generic type parameters: an enum that holds the properties for this HUD, and an enum that holds the messages this HUD supports.

The simplest HUD that does not depend on any server-side data and does not support any form of client-server interaction would look like this:

```kotlin
class VeryCoolHud : Hud<NoHudProperties, NoHudMessages>() {
    override val propertyKeys = NoHudProperties.values()
    override val messageKeys = NoHudMessages.values()
    override val typeName: String get() = "very_cool_hud"
}
```

### HUD Properties

If a HUD does have properties, create an enum class to hold the property names and define the properties within the class as such:

```kotlin
enum class VeryCoolHudProperties {
    CoolnessFactor
}

class VeryCoolHud(val coolness: Int) : Hud<VeryCoolHudProperties, NoHudMessages>() {
    override val propertyKeys = VeryCoolHudProperties.values()
    override val messageKeys = NoHudMessages.values()
    override val typeName: String get() = "very_cool_hud"

    private val coolnessFactor = createIntProperty(VeryCoolHudProperties.CoolnessFactor).from { coolness }
}
```

In this case, we just pass the property value in the constructor, but it could also be a dynamic value based on e.g. a character's stats. Properties update and sync to the client automatically.

We can also create properties based on inventories; see this example from the EquipmentHud:

```kotlin
private val inventory = createInventoryProperty(EquipmentHudProperties.Inventory).from { inventoryMapper[target]?.defaultInventory }
```

Again, the inventory will automatically sync and any inventory interactions (such as interacting with an item, or moving items around) are automatically supported by the system.

### HUD Messages

Unlike properties, messages don't hold a value, and will only be sent to the client or server when specifically triggered.
An example for messages is the ChatHud, which has a message both for submitting a message (from client to server), as well as a message for receiving a message (from server to client).

Messages can be sent using the `sendMessage` function, which allows for custom data to be encoded alongside the message.

```kotlin
sendMessage(ChatHudMessages.ChatMessage) {
    it.writeString(message)
}
```

Incoming messages are handled in the `messageReceived` function of the HUD, providing both the message key, as well as a buffer to decode custom message data from.

## 4. Create a client-side representation of the HUD

In the `data/huds` folder of the client, create a new resource of type `HudDefinition`.

A HudDefinition contains only one property, which is the scene to instantiate when the HUD should be displayed.

Reference existing HUDs (`data/isos`) and HUD scenes (`interface`) to find your way around, and read on to learn how to connect messages and properties on the client.

### HUD Properties

To support HUD messages, within your HUD scene, create an empty `Node` called `Properties` and assign the `hud_properties` script to it.
In this node you can now create child nodes, assigning an appropriate `hud_property_*` script to each and setting the `Key` property to the matching ordinal within the server-side enum.
Whenever the property value changes on the server, the client will now fire the `property_changed` signal on its respective property node, allowing you to react to the change in your HUD script.

Currently, properties are read-only on the client, so there is no way to send a value back to the server (although there may be in the future).

### HUD Messages

To support HUD messages, within your HUD scene, create an empty `Node` called `Messages` and assign the `hud_messages` script to it.
In this node you can now create child nodes, assigning an appropriate `hud_message_*` script to each and setting the `Key` property to the matching ordinal within the server-side enum.
This node will then expose a `send` function (details may vary based on message type) and a signal for when the message is received.

For example, if you created a `SubmitChatMessage` message with script `hud_message_string`, you would then be able to call `$Messages/SubmitChatMessage.send("Hello World")` from within your HUD script to send the message to the server.
Likewise, the signal will be fired whenever the client receives this message from the server.

## 5. Test that everything worked

Currently you would need to use the HudService to show the HUD e.g. on login (see `hudService.show`). 
