// user.js
class User {
    constructor(name, email, password) {
      this.name = name;
      this.email = email;
      this.password = password;
    }
  
    // Métodos de la clase User
    getName() {
      return this.name;
    }
  
    getEmail() {
      return this.email;
    }
  
    getPassword() {
      return this.password;
    }
  
    // Otros métodos y lógica de la clase User
  }
  
  module.exports = User;
  