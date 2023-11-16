// user.js
class User {
    constructor(username, password, email, phone, admin, registerDate, lastLogin, projects) {
      this.phone = phone;
      this.admin = admin;
      this.registerDate = registerDate;
      this.lastLogin = lastLogin;
      this.username = username;
      this.email = email;
      this.password = password;
      this.projects = projects || [];
    }
  
    getName() {
      return this.name;
    }
  
    getEmail() {
      return this.email;
    }
  
    getPassword() {
      return this.password;
    }
  
    getPhone() {
      return this.phone;
    }

    getAdmin() {
        return this.admin;
    }

    getRegisterDate() {
        return this.registerDate;
    }

    getLastLogin() {
        return this.lastLogin;
    }


    setName(name) {
      this.name = name;
    }

    setEmail(email) {
      this.email = email;
    }

    setPassword(password) {
      this.password = password;
    }

    setPhone(phone) {
      this.phone = phone;
    }

    setAdmin(admin) {
        this.admin = admin;
    }

    setRegisterDate(registerDate) {
        this.registerDate = registerDate;
    }

    setLastLogin(lastLogin) {
        this.lastLogin = lastLogin;
    }


  }
  
  module.exports = User;
  