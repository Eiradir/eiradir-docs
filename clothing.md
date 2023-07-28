# Adding Clothing

The only way that clothing is different from a regular item is that it has an equipment slot defined, and contains a paperdoll reference on the client.

## 1. Set an equipment slot on the server

```kotlin
define.item("full_leather_armor") {
    equipmentSlot = EquipmentSlot.Torso
}
```

## 2. Setup a paperdoll

In the `data/paperdolls` folder of the client, create a new resource of type `PaperdollDefinition`.

A paperdoll holds mappings of an iso to a scene. The iso that you create a mapping for here is not the iso this paperdoll represents (so in this example, not the "full_leather_armor" item iso), but the iso that "wears" this paperdoll.

So for example, if the leather armor can be worn by male dwarves, you would add a mapping for the dwarf_male iso to a Godot scene that holds the sprite to apply on male dwarves.

If the leather armor also has sprites for other races, you would simply add additional mappings to the paperdoll and map their respective scenes.

Once the paperdoll is created, find the item iso for the full leather armor and assign the paperdoll property.

## 3. Test that everything works

Restart the client and server and equip your item. Make sure you're the correct race as well. The clothing should now show up on your character.
