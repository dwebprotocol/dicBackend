const { Client } = require('dhub')
const DTree = require('dwebtree')
const { kvPairs : dictionaryPairs } = require('websters-english-dictionary')

start()

async function start() {
  const { basestore, replicate } = new Client()
  const store = basestore()

  // create storage for the dTree we're going to use to store the dictionary
  const base = store.get({ name: 'dictionary' })

  // create dTree
  const db = new DTree(base, { keyEncoding: 'utf-8', valueEncoding: 'utf-8' })

  // store each definition in the dictionary as key/value pairs using dTree's batch method
  const batch = db.batch()
  for (const { key, value } of dictionaryPairs()) {
    await batch.put(key, value)
  }

  await batch.flush()
  
  // Print dTree key
  console.log('The dTree key is:', db.discoveryKey)

  // Now announce on dWeb
  await replicate(base)
}