## `@basestore/networker` v1.0.0

If you're migrating from `basestore-swarm-networking` v5 to `@basestore/networker` v1, there have been a few breaking changes to be aware of:

#### `join`/`leave` -> `configure`
`join` and `leave` have been replaced by a single method, `configure`, which takes the options `announce`, `lookup`, and `flushed`. 

Using `configure`, a `join` is `configure(discoveryKey, { announce: true, lookup: true }` and a `leave` is `configure(discoveryKey, { announce: false, lookup: false })`

#### The `status` method
The `status` method previously just fowarded DSwarm's `status`. It now returns the current network configuration for a given discovery key. To get the DSwarm status directly, you can do `networker.swarm.status`.

#### Other Assorted Changes
* The public `streams` and `peers` properties are now `Set`s instead of Arrays.
