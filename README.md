## Setup

```js

github clone link : git clone https://github.com/kolimayur303/coingeckoCommand.git

manually clone the repo and then run `npm install`.

Run the following command to run startup migrations.

adonis migration:run

Run the following command to store data in database.

adonis fetch:coins-list

Run the following command to run server.
node server.js

run the following url in postman 
GET : http://127.0.0.1:3333/users

```
"# coingeckoCommand" 


adonis make:migration create_coins_table
adonis migration:run
adonis fetch:coins-list
