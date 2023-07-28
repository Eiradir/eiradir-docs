# Adding a Tile and Transitions

A tile is any flat ground, floor or roof surface that can be placed in the world map, and optionally transition smoothly into one another.

## 1. Register the tile in a [server plugin](server-plugins.md) initializer

In most cases, this can be done in our existing content plugin, unless you want to specifically separate a tile out into a separate content module.

```kotlin
class Tiles(define: RegistryBuilders) : Initializer {
    init {
        // ...
        define.tile("cool_floor") {
            // optionally can define properties such as the movement speed on the tile
        }
    }
}
```

### Assign an id to the tile

When stored in the map or sent over the network, we use a numneric id to represent the tile. This id must be statically defined in the `id_mappings.ini` file of **both client and server**. Unlike most other ids, tile ids must fit into a byte.

```ini
[items]
# ...
71 = "cool_floor"
```

## 3. Create the client-side representation of the tile

In the `data/tiles` folder of the client, create a new resource of type `TileDefinition`.

Here, you will likely not find what you expected - unfortunately, there is no field to just put a tile texture and be done with it.

Instead, you must specify a `Source ID` and `Variants`, which is an array of 2D vectors. This makes up a reference to the tileset, which is located in `data/tiles.tres`. 

Unless your tile is animated, its source id should always be `0`. That means you must add the tile to the tile atlas under `assets/tiles/atlas/tiles.png`.
However, this atlas is generated based on the textures located in `assets/tiles/textures`, using [gdx-texturepacker](https://github.com/crashinvaders/gdx-texture-packer-gui) and settings loaded from `assets/tiles/atlas/tiles.tpproj`.
Making manual changes to the atlas would mean they get reverted the next time it is regenerated. As you can already tell, this is not the most streamlined process currently :)

Once your tile has been added to the atlas texture, you can add it to the tileset by just clicking it (which will make it show up brighter and with an outline, like the others).
Next, hover over the tile in the tileset to find out its Atlas Coordinates. These coordinates are what you put into the TileDefinition.

## 4. Setup transitions for the tile

This step is even worse than the previous one. If you check the `data/transitions` folder, you will see that it's also just a bunch of TileDefinitions, albeit with much weirder and larger ids.
Instead of defining ids manually, transition ids are a composite of their corresponding tile and the directions that they extend towards.

```gd
# Directions are packed bits in order SE = 128, S, SW, E, W, NE, N, NW = 1
packed_directions = 128 | 64 | 32 | 16 | 8 | 4 | 2 | 1
transition_id = (tile_id << 8) | packed_directions
```

Right now, there is no template or tool that can generate the transition textures you will need. You would have to manually mask them based on the existing transitions.
You will also have to then regenerate the transitions atlas, and manually calculate the appropriate transition ids and create all the TileDefinitions for your transitions.

Let's just not touch tiles for the time being.

## 5. Test that everything worked

After restarting the server and client, run `/tile set cool_floor 0 0 0` and you should find your newly created tile placed at coordinate `0, 0, 0`.
