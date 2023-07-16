'use strict'

const { Command } = require('@adonisjs/ace')
const axios = require('axios')


class FetchCoinsList extends Command {
  static get signature () {
    return 'fetch:coins-list'
  }

  static get description () {
    return 'Fetches data from Coingecko API /coins/list endpoint and stores it in the database'
  }

  async handle (args, options) {
    try {

      // Make the API request to Coingecko to fetch the list of coins
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/list?include_platform=true')
  
      if (!Array.isArray(response.data)) {
        throw new Error('Invalid response data format.')
      }
  
      const coinsList = response.data.map((coin, index) => {
    
      const sanitizedSymbol = this.sanitizeSymbol(coin.symbol, 100)
  
        if (coin.symbol !== sanitizedSymbol) {
          console.log(`Symbol truncated: "${coin.symbol}" -> "${sanitizedSymbol}" at row ${index + 1}`)
        }
  
        if (sanitizedSymbol.length > 255) {
          console.log(`Symbol too long: "${sanitizedSymbol}" at row ${index + 1}`)
        }

        const platformsData = {
          ethereum: coin.platforms?.ethereum || null,
          fantom: coin.platforms?.fantom || null,
          xdai: coin.platforms?.xdai || null,
          aurora: coin.platforms?.aurora || null,
          binanceSmartChain: coin.platforms?.binance_smart_chain || null,
          polygonPos:coin.platforms?.polygon_pos || null
      
        };

        return {
          id: coin.id,
          name: coin.name,
          symbol: sanitizedSymbol,
          platforms: JSON.stringify(platformsData)
        }
      })

      const Database = use('Database')
      
      await Database.table('coins_list').insert(coinsList)
  
      console.log('Coin list data fetched and stored successfully.')
    } catch (error) {
      console.error('An error occurred while fetching and storing coin list data:', error)
      console.error('Response data:', error.response && error.response.data)
    }
  
    process.exit(0)
  }
  
  // Function to sanitize and truncate long symbols
  sanitizeSymbol (symbol, maxLength) {
    // Remove any special characters and keep only alphanumeric characters
    const sanitizedSymbol = symbol.replace(/[^a-zA-Z0-9]/g, '')

    // Truncate the symbol if it exceeds maxLength
    return sanitizedSymbol.substring(0, maxLength)
  }
}

module.exports = FetchCoinsList
