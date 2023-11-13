const pool = require("../database/db.js");

class Tag {
  constructor(id, name, desc) {
    this._tagID = id;
    this._name = name;
    this._tagDesc = desc;
  };

  get tagID() {
    return this._tagID;
  };

  set tagID(id) {
    return this._tag;
  };

  get name() {
    return this._name;
  };

  set name(name) {
    this._name = name;
  };

  get tagDesc() {
    return this._tagDesc;
  };

  set tagDesc(desc) {
    this._tagDesc;
  };

  async save() {
    const sql = `INSERT INTO tags(tag_ID, name, tag_desc) VALUES ("${this.tagID}", "${this.name}", "${this.tagDesc}")`;
    await pool.execute(sql);
  };

  static async find() {
    const sql = "SELECT * FROM tags";
    const [rows, field] = await pool.execute(sql);
    return rows;
  };

  static async findById(id) {
    const sql = `SELECT * FROM tags WHERE tag_ID="${id}"`;
    const [row, field] = await pool.execute(sql);
    return row;
  };

  static async findByIdAndUpdate(id, newData) {
    const sql = `UPDATE tag SET name="${newData.name}", desc="${newData.tagDesc}" WHERE tagID="${id}"`;
    await pool.execute(sql);
  };

  static async findByIdAndDelete(id) {
    const sql = `DELETE FROM contents WHERE contentID="${id}"`;
    await pool.execute(sql);
  };

  static async getPostByTagID(id) {
    const sql = `SELECT p.post_ID, p.post_title, p.member_ID, p.content, DATE_FORMAT(p.dop, '%m/%d/%Y %H:%i') as dop, GROUP_CONCAT(t.tag_ID ORDER BY t.tag_ID) as tag_IDs, GROUP_CONCAT(t.tag_name ORDER BY t.tag_ID ) as tag_names, m.username FROM posts p JOIN post_tag pt ON p.post_ID = pt.post_ID JOIN tags t ON pt.tag_ID = t.tag_ID JOIN members m ON p.member_ID = m.member_ID WHERE p.post_ID IN ( SELECT post_ID FROM post_tag WHERE tag_ID = "${id}" ) GROUP BY p.post_ID, p.post_title, p.member_ID, p.content, p.dop, m.username ORDER BY p.dop;`;
    console.log(sql);
    const [rows, field] = await pool.execute(sql);
    return rows;
  }
  static async addTagToPost(postID, tagID) {
    const sql = `INSERT INTO post_tag(post_ID, tag_ID) VALUES ("${postID}", "${tagID}")`;
    console.log(sql);
    await pool.execute(sql);
  }
};



module.exports = Tag;