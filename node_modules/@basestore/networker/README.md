# `@basestore/networker`
[![Build Status](https://travis-ci.com/andrewosh/basestore-networker.svg?branch=master)](https://travis-ci.com/andrewosh/basestore-networker)

A basestore networking module that uses [dswarm](https://github.com/dswarm/network) to discovery peers. This module powers the networking portion of the [DHub](https://github.com/DHub-org/DHub).

Calls to `configure` will not be persisted across restarts, so you'll need to use a separate database that maps discovery keys to network configurations. The DDrive daemon uses [Level](https://github.com/level/level) for this.

Since basestore has an all-to-all replication model (any shared bases between two peers will be automatically replicated), only one connection needs to be maintained per peer. If multiple connections are opened to a single peer as a result of that peer announcing many keys, then these connections will be automatically deduplicated by comparing NOISE keypairs.

### Upgrading from basestore-swarm-networking
This module's going through a major change + a rename as part of our push to develop [DHub](https://github.com/DHub-org/DHub). With these updates, `@basestore/networker` and DHub's `network` APIs are now interchangeable! 

If you've previously been using `basestore-swarm-networking` and you'd like to upgrade, [`UPGRADE.md`](https://github.com/andrewosh/basestore-swarm-networking/blob/master/UPGRADE.md) explains the changes.

### Installation
```
npm i @basestore/networker
```

### Usage
```js
const Networker = require('@basestore/networker')
const Basestore = require('basestorex')
const ram = require('random-access-memory')

const store = new Basestore(ram)
await store.ready()

const networker = new Networker(store)

// Start announcing or lookup up a discovery key on the DHT.
await networker.configure(discoveryKey, { announce: true, lookup: true })

// Stop announcing or looking up a discovery key.
networker.configure(discoveryKey, { announce: false, lookup: false })

// Shut down the swarm (and unnanounce all keys)
await networker.close()
```

### API

#### `const networker = new Networker(basestore, networkingOptions = {})`
Creates a new SwarmNetworker that will open replication streams on the `basestore` instance argument.

`networkOpts` is an options map that can include all [dswarm](https://github.com/dswarm/dswarm) options (which will be passed to the internal swarm instance) as well as:
```js
{
  id: crypto.randomBytes(32), // A randomly-generated peer ID,
  keyPair: DDatabaseProtocol.keyPair(), // A NOISE keypair that's used across all connections.
}
```

#### `networker.peers`
The list of currently-connected peers. Each Peer object has the form:
```
{
  remotePublicKey: 0xabc..., // The remote peer's NOISE key.
  remoteAddress: '10.23.4...:8080', // The remote peer's host/port.
  type: 'tcp' | 'utp', // The connection type
  stream // The connection's DDatabaseProtocol stream
}
```

#### `networker.on('peer-add', peer)`
Emitted when a new connection has been established with `peer`.

#### `networker.on('peer-remove', peer)`
Emitted when `peer`'s connection has been closed.

#### `await networker.configure(discoveryKey, opts = {})`
Join or leave the swarm with the `discoveryKey` argument as the topic.

If this is the first time `configure` has been called, the swarm instance will be created automatically.

Waits for the topic to be fully joined/left before resolving.

`opts` is an options map of network configuration options that can include:
```js
  announce: true, // Announce the discovery key on the swarm
  lookup: true  // Look up the discovery key on the swarm,
  flush: true // Wait for a complete swarm flush before resolving.
```

#### `networker.joined(discoveryKey)`
Returns `true` if that discovery key is being swarmed.

#### `networker.flushed(discoveryKey)`
Returns true if the swarm has discovered and attempted to connect to all peers announcing `discoveryKey`.

#### `networker.listen()`
Starts listening for connections on DSwarm's default port.

This is called automatically before the first call to `configure`.

#### `await networker.close()`
Shut down the swarm networker.

This will close all replication streams and then destroy the swarm instance. It will wait for all topics to be unannounced, so it might take some time.

### Swarm Extensions
`@basestore/networker` introduces stream-level extensions that operate on each connection. They adhere to ddatabase's [extension API](https://github.com/@ddatabase/protocol/ddatabase#ext--feedregisterextensionname-handlers).

#### `const ext = await networker.registerExtension(name, { encoding, onmessage, onerror })`
Registers an extension with name `name`.

The `onmessage` and `onerror` handlers are both optional methods. `onerror` is an errback, and `onmessage` must have the signature:

```js
function onmessage (msg, peer) {
  // `msg` is the (optionally-decoded) message that was received from `peer`.
  // `peer` is a `Peer` object (described above in `networker.peers`)
}
```

#### `ext.send(msg, peer)`
Send `msg` (which will optionally be encoded by the extension's encoding opt) to `peer`. `peer` must be a Peer object taken from `networker.peers` or emitted by the networker's `peer-add` event.

#### `ext.broadcast(msg)`
Broadcast `msg` to all currently-connected peers.

#### `ext.destroy()`
Destroy the extension and unregister it from all connections.

### License
MIT
