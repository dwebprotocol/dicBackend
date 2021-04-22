const raf = require('random-access-file')
const ddatabase = require('ddatabase')
const ddatabaseCrypto = require('@ddatabase/crypto')
const derive = require('dweb-derive-key')
const derivedStorage = require('.')

const masterKey = Buffer.alloc(32)

const storage = name => raf(name, { directory: './tmp' })
const { key, secretKey } = derivedStorage(storage, (name, cb) => {
  console.log('name:', name)
  if (!name) name = ddatabaseCrypto.randomBytes(32)
  const seed = derive('ddatabase', masterKey, name)
  const { publicKey, secretKey } = ddatabaseCrypto.keyPair(seed)
  return cb(null, { name, publicKey, secretKey })
})

const base = ddatabase(p => {
  if (p === 'key') return key
  if (p === 'secret') return secretKey
  return storage(p)
})
base.on('ready', () => console.log('ready'))
base.on('error', (err) => console.log('error', err))
