'use strict'

const Schema = use('Schema')

class CreateCoinsListTableSchema extends Schema {
  up () {
    
    this.create('coins_list', (table) => {
      table.string('id', 100).primary()
      table.string('name', 100)
      table.string('symbol', 255) // Set the length to 255 characters
      table.json('platforms') // Add the platforms column as a JSON object

    })
  }

  down () {
    this.drop('coins_list')
  }
}

module.exports = CreateCoinsListTableSchema
