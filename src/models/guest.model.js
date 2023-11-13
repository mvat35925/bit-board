const pool = require("../database/db.js");

class Guest {
  constructor(id) {
    this._guestID = id
  };

  get guestID() {
    return this._guestID;
  }

  set guestID(id) {
    this._guestID = id
  }

  async save() {
    const sql = `INSERT INTO guests(guest_ID) VALUES ("${this.guestID}")`;
    await pool.execute(sql);
  }

  static async find() {
    const sql = "SELECT * FROM guests";
    const [rows, field] = await pool.execute(sql);
    return rows;
  }

  static async findById(id) {
    const sql = `SELECT * FROM guests WHERE guest_ID = ${id}`;
    await pool.execute(sql);
  }

}

module.exports = Guest;
