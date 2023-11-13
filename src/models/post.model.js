const pool = require("../database/db.js");

class Post {
  constructor(postID, postTitle, memberID, content) {
    this._postID = postID;
    this._postTitle = postTitle;
    this._memberID = memberID;
    this._content = content;
  }

  get postID() {
    return this._postID;
  }

  set postID(id) {
    this._postID = id;
  }

  get postTitle() {
    return this._postTitle;
  }

  set postTitle(title) {
    this._postTitle = title;
  }
  get memberID() {
    return this._memberID;
  }

  set memberID(id) {
    this._memberID = id;
  }

  get content() {
    return this._content;
  }

  set content(content) {
    this._content = content;
  }


  async save() {
    const sql = `INSERT INTO posts(post_ID, post_title, member_ID, content) VALUES("${this.postID}", "${this.postTitle}", "${this.memberID}", "${this.content}")`;
    console.log(sql);
    await pool.execute(sql);
  }

  static async find() {
    const sql = `SELECT posts.post_ID, posts.post_title, posts.member_ID, posts.content,  DATE_FORMAT(posts.dop, '%m/%d/%Y %H:%i') as dop,GROUP_CONCAT(tags.tag_ID ORDER BY tags.tag_ID) as tag_IDs,GROUP_CONCAT(tags.tag_name ORDER BY tags.tag_ID) as tag_names, members.username FROM posts LEFT JOIN post_tag ON posts.post_ID = post_tag.post_ID LEFT JOIN tags ON post_tag.tag_ID = tags.tag_ID INNER JOIN members ON members.member_ID=posts.member_ID GROUP BY posts.post_ID, posts.post_title, posts.member_ID, posts.content, posts.dop ORDER BY posts.dop DESC;`;
    const [rows, field] = await pool.execute(sql);
    return rows;
  }

  static async findByID(id) {
    const sql = `SELECT posts.post_ID,posts.post_title,posts.member_ID,posts.content,DATE_FORMAT(posts.dop, '%m/%d/%Y %H:%i') as dop, members.username FROM posts INNER JOIN members ON members.member_ID=posts.member_ID WHERE post_ID="${id}" ORDER BY posts.dop DESC`;
    const [row, field] = await pool.execute(sql);
    return row[0];
  }

  static async findByMemberID(id) {
    const sql = `SELECT posts.post_ID, posts.post_title, posts.member_ID, posts.content,  DATE_FORMAT(posts.dop, '%m/%d/%Y %H:%i') as dop,GROUP_CONCAT(tags.tag_ID) as tag_IDs,GROUP_CONCAT(tags.tag_name) as tag_names, members.username FROM posts LEFT JOIN post_tag ON posts.post_ID = post_tag.post_ID LEFT JOIN tags ON post_tag.tag_ID = tags.tag_ID INNER JOIN members ON members.member_ID=posts.member_ID WHERE members.member_ID="${id}" GROUP BY posts.post_ID, posts.post_title, posts.member_ID, posts.content, posts.dop ORDER BY posts.dop DESC;`
    const [rows, field] = await pool.execute(sql);
    return rows;
  }

  static async findByIdandDelete(id) {
    const sql = `DELETE FROM posts WHERE post_ID="${id}"`
    await pool.execute(sql);
  }

}

module.exports = Post