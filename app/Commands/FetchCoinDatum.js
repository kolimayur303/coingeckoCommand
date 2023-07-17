'use strict'

const { Command } = require('@adonisjs/ace')
const axios = require('axios')

class FetchCoinsList extends Command {
  static get signature () {
    return 'fetch:coins-list'
  }

  static get description () {
    return 'Fetches the list of coins from the Coingecko API and stores it in the database'
  }

  async handle (args, options) {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true')

      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response data format.')
      }

      for (const coin of response.data) {

        const platformsData = {
          ethereum: coin.platforms?.ethereum || null,
          fantom: coin.platforms?.fantom || null,
          xdai: coin.platforms?.xdai || null,
          aurora: coin.platforms?.aurora || null,
          binanceSmartChain: coin.platforms?.binance_smart_chain || null,
          polygonPos:coin.platforms?.polygon_pos || null

          // Add other platforms as needed or handle differently based on the actual data structure
        }

        // Check if the record exists in the database

        const Database = use('Database')
        
        const existingRecord = await Database.table('coins_list').where('id', coin.id).first()

        if (existingRecord) {
          // Update the existing record with new data
          await Database.table('coins_list').where('id', coin.id).update({
            name: coin.name,
            symbol: coin.symbol,
            platforms: JSON.stringify(platformsData),
          })
        } else {
          // Insert a new record
          await Database.table('coins_list').insert({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            platforms: JSON.stringify(platformsData),
          })
        }
      }

      this.success('Coin list data fetched and stored successfully.')
    } catch (error) {
      this.error('An error occurred while fetching and storing coin list data:', error.message)
    }
  }
}

module.exports = FetchCoinsList
