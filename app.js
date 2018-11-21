var mysql = require('mysql')
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: 'rootroot',
    database: 'bamazon_db'
})

connection.connect(function (err) {
    if (err) throw err
    console.log('connected as id ' + connection.threadId + '\n')
    readProduct()
  })

function readProduct () {
    console.log('Here are all the products available for sale...\n')
    connection.query('SELECT * FROM products', function (err, res) {
      if (err) throw err
      console.log(res)
      buyProduct()
    })
  }

function buyProduct() {
  inquirer
  .prompt([
      {
        type: 'input',
        name: 'product',
        message: "Which product would you like to buy?"
      },
      {
        type: 'input',
        name: 'units',
        message: "How many units would you like to buy?"
      },
  ])
  .then(answers => {

    let unitRequest = answers.units
    let product = answers.product

    connection.query(`SELECT stock_quantity FROM products WHERE product_name = "${product}"`, function (err, res) {
      let currentStock = res[0].stock_quantity
      if (err) {throw err}

      else if (unitRequest <= currentStock){
        console.log(`Previous stock: ${currentStock}`)
        currentStock = currentStock - unitRequest

        connection.query(`UPDATE products SET stock_quantity = ${currentStock} WHERE product_name = "${product}" `, function (err){
          if (err) throw err
          else { 
            console.log(`New Stock: ${currentStock}`)
          }
        })

        connection.query(`SELECT price FROM products WHERE product_name = "${product}"`, function (err, res) {
          if (err) {throw err}
          let totalPrice = res[0].price * unitRequest
          console.log (`total price: $${totalPrice}`)
          connection.end()
        })
      }

      else{
        console.log('insufficient stock! Try again')
        connection.end()
      }
    })

  })
}





