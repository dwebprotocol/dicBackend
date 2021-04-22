const { Client } = require('dhub')
const DTree = require('dwebtree')
const { kvPairs: dictionaryPairs } = require('websters-english-dictionary')

start()

async function start () {
  const { basestore, replicate } = new Client()
  const store = basestore()

  // create storage for the dTree we're going to use to store the dictionary
  const base = store.get({ name: 'dictionary' })

  // create the dTree
  const db = new DTree(base, { keyEncoding: 'utf-8', valueEncoding: 'utf-8' })

  // store each definition in the dictionary, as key/value pairs using dTree's batch method
  const batch = db.batch()
  for (const { key,value } of dictionaryPairs()) {
    await batch.put(key, value)
  }

  // By flushing here, we insert all the key/values from the for-loop above into the dTree
  await batch.flush()

  // Print out the dTree's key to the console
  console.log('The dTree key is:', base.key.toString('hex'))

  // Now we announce the dTree on the dWeb and it can be queried from anywhere
  while (true) {
    await replicate(base)
  }
}