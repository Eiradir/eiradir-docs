---
title: Visual Traits
---

# Visual Traits - Hair and Beard Styles

We've combined hair and beard styles under a common concept of "visual traits". Compared to normal clothing which is tied to a specific item, visual traits (or "vists" in short) can exist on a character regardless of equipment worn.

In the future, visual traits could also be used for things such as dirt or blood splatter on characters, scars, disfigurements etc. - the concept is in place and is really only held back by the client's rendering capabilities.

## 1. Assign an id for the visual trait

Add an entry for your hair or beard style in the id_mappings of **both client and server**.

```ini
[vists]
# ...
6 = "cool_hair"
```

Right now the convention is that beard styles start at 100 while the first 100 are reserved for hairs. That will probably change in the future, since we have no reason to keep ids at such a low range.

## 2. Make the visual trait a selectable option in character creation

In the `PlayableRaces` class of our content module, you will find the data that is supplied to the character creation screen. Add your new style to the race in question.

```kotlin
visualTrait(VIST_HAIR, "cool_hair")
```

## 3. Create the client-side representation

In the `data/vists` folder of the client, create a new resource of type `VistDefinition`.

A vist only holds one property - the paperdoll to apply.

Paperdolls are a client-side only concept, and they make up the bridge between a worn item of clothing or a visual trait, and the actual visual representation on the character on a race-by-race basis.

Fun fact: Since both vists and isos defer to the same paperdolling concept, it is perfectly possible to have wearable wig items or fake beards without needing any special scripting to support those.

### Define the paperdoll

In the `data/paperdolls` folder of the client, create a new resource of type `PaperdollDefinition`.

A paperdoll holds mappings of an iso to a scene. The iso that you create a mapping for here is not the iso this paperdoll represents (so for example, not a "wig" item iso), but the iso that "wears" this paperdoll.

So for example, if your hair style can be worn by male dwarves, you would add a mapping for the dwarf_male iso to a Godot scene that holds the sprite to apply on male dwarves.

If the same hair style can also be worn by other races, you would simply add additional mappings to the paperdoll and map their respective scenes.

Another fun fact: Since these mappings are based on an iso, the engine in theory supports items such as armor stands that could "wear" the items they hold.
