const PuffNHuff = artifacts.require('PuffNHuff')
const web3 = require('web3')

let accounts
let user1
let user2
let user3

contract('PuffNHuff', accs => {
  accounts = accs
  user1 = accounts[0]
  user2 = accounts[1]
  user3 = accounts[2]
  const password = web3.utils.fromAscii('Banana split')
  
  it('Create user', async () => {
    let instance = await PuffNHuff.deployed()
    await instance.createUser(password, 1, {from: user1})

    const login = await instance.login(password)
    assert.equal(login.words[0], 1);
  })

  // Login
  it('Login user', async () => {
    let instance = await PuffNHuff.deployed()
    await instance.createUser(password, 1, {from: user2})
    await instance.createUser(password, 2, {from: user3})
    const login1 = await instance.login(password, {from: user2})
    const login2 = await instance.login(password, {from: user3})
    assert.equal(login1, 1);
    assert.equal(login2, 2);
  })

  // createProduct and get Product
  it('Create product', async () => {

    let instance = await PuffNHuff.deployed()
    const product = {
      name: 'Spiderman',
      strainType: 'Hybrid',
      amount: 1,
      price: 55
    }
    const product2 = {
      name2: 'Hockey Man',
      strainType2: 'Sativa',
      amount2: 2,
      price2: 13
    }
    const productsInit = [product, product2]
    const {name, strainType, amount, price} = product
    const {name2, strainType2, amount2, price2} = product2
    await instance.createProduct(name, strainType, amount, price)
    await instance.createProduct(name, strainType, amount, price, {from: user2})
    await instance.createProduct(name2, strainType2, amount2, price2, {from: user2})
    const products1 = await instance.getProducts(user1)
    const products2 = await instance.getProducts(user2)
    assert.equal(products1.length, 1)
    assert.equal(products2.length, 2)
  })

  // get all products
  it('Get all products', async () => {
    let instance = await PuffNHuff.deployed()
    const product = {
      name: 'Spiderman',
      strainType: 'Hybrid',
      amount: 1,
      price: 55
    }
    const product2 = {
      name2: 'Hockey Man',
      strainType2: 'Sativa',
      amount2: 2,
      price2: 13
    }
    const producers = await instance.getProducers()
    const filteredProducers = producers.filter((p, i , arr) => arr.indexOf(p) == i)
    const products = await Promise.all(filteredProducers.map( (p) => {
      return instance.getProducts(p)
    }))
    products.forEach((p, i) => {
      if (i == 0) {
      const {name, strainType, amount, price} = p[0]
        assert.include({name, strainType, amount: +amount, price: +price}, product, 'Success')
      }
      if (i == 1) {
      const {name, strainType, amount, price} = p[0]
      const {name: name2, strainType: strainType2, amount: amount2, price: price2} = p[1]
        assert.include({name, strainType, amount: +amount, price: +price}, product, 'Success')
        assert.include({name2, strainType2, amount2: +amount2, price2: +price2}, product2, 'Success')
      }
    })
  })

  // change state
  it('Change product state', async () => {

    let instance = await PuffNHuff.deployed()
    const product = {
      name: 'Spiderman',
      strainType: 'Hybrid',
      amount: 1,
      price: 55
    }
    await instance.changeState(0, 'Available')
    const products = await instance.getProducts(user1)
    assert.equal(products[0].state, 'Available')
  })

  // buy
  it('Buy product', async () => {
    let instance = await PuffNHuff.deployed()
    const products = await instance.getProducts(user1)
    assert.equal(products[0].consumer, '0x0000000000000000000000000000000000000000')
    await instance.buy(user1, 0, {from: user2})
    const productsNew = await instance.getProducts(user1)
    assert.equal(productsNew[0].consumer, user2)
  })

  it('Receive product', async () => {
    let instance = await PuffNHuff.deployed()
    const products = await instance.getProducts(user1)
    await instance.changeState(0, 'Sent')
    await instance.receive(user1, 0, {from: user2})
    const productsNew = await instance.getProducts(user1)
    assert.equal(productsNew[0].state, 'Received')
  })
})

