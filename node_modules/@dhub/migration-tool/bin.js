#!/usr/bin/env node
const { migrate } = require('.')

;(async () => {
  console.log('Migrating from the dDrive daemon to dHub...')
  try {
    await migrate()
    console.log('Migration succeeded!')
  } catch (err) {
    console.error('Migration failed:', err)
  }
})()

