function add(a) {
  return function (b) {
    return a + b
  }
}

module.exports = {
  add: add,
}
