const pool = require("../database/db.js");

class Member {
  constructor(id, username, password, short_info, pic) {
    this._memberID = id;
    this._username = username;
    this._password = password;
    this._short_info = short_info;
    this._pic = pic;
  };

  get memberID() {
    return this._memberID;
  };

  set memberID(id) {
    this._memberID = id;
  };

  get username() {
    return this._username;
  };

  set username(username) {
    if (!username) throw new Error("Invalid username");

    username = username.trim();
    this._username = username;
  };

  get password() {
    return this._password;
  };

  set password(password) {
    if (!password) throw new Error("Invalid password");

    password = password.trim();
    this._password = password;
  };

  get short_info() {
    return this._short_info;
  };

  set short_info(short_info) {
    if (!short_info) throw new Error("Invalid short info");

    short_info = short_info.trim();
    this._short_info = short_info;
  };

  async save() {
    const sql = `INSERT INTO members(member_ID, username, password, short_info) VALUES("${this.memberID}","${this.username}", "${this.password}", "${this.shortInfo}")`;
    await pool.execute(sql);
  };

  static async find() {
    const sql = "SELECT * FROM members";
    const [rows, field] = await pool.execute(sql);
    return rows;
  };

  static async findById(id) {
    const sql = `SELECT * FROM members WHERE member_ID = "${id}" `;
    const [row, field] = await pool.execute(sql);
    return row[0];
  };

  static async findByUsername(username) {
    const sql = `SELECT * FROM members WHERE username="${username}"`;
    const [row, field] = await pool.execute(sql);
    return row[0];
  }

  static async findByIdAndUpdate(id, newData) {
    let sql = `UPDATE members SET `;
    const updates = [];
    
    // Dynamically build the SQL based on what data is present
    if (newData.username) {
      updates.push(`username="${newData.username}"`);
    }
    if (newData.password) {
      updates.push(`password="${newData.password}"`);
    }
    if (newData.shortInfo) {
      updates.push(`short_info="${newData.shortInfo}"`);
    }

    sql += updates.join(', ');
    sql += ` WHERE Member_ID = "${id}"`;
    
    await pool.execute(sql);
  }


  static async findByIdAndDelete(id) {
    const sql = `DELETE FROM members WHERE member_ID = "${id}"`
    await pool.execute(sql);
  };


}

module.exports = Member;