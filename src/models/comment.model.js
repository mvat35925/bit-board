const pool = require("../database/db");

class Comment {
  constructor(id, memberID, postID, content) {
    this._commentID = id;
    this._memberID = memberID;
    this._postID = postID;
    this._content = content;
  };

  get commentID() {
    return this._commentID;
  }

  set commentID(id) {
    this._commentID = id;
  }

  get postID() {
    return this._postID;
  };

  set postID(id) {
    this._postID = id;
  };

  get memberID() {
    return this._memberID;
  };

  set memberID(id) {
    this._memberID = id;
  }

  get postID() {
    return this._postID;
  }

  set postID(id) {
    this._postID = id;
  }

  get content() {
    return this._content;
  }

  set content(t) {
    this.content = t;
  }

  async save() {
    const sql = `INSERT INTO comments (comment_ID, member_ID, post_ID, content) VALUES ("${this.commentID}", "${this.memberID}", "${this.postID}", "${this.content}")`;
    await pool.execute(sql);
  }

  static async findById(id) {
    const sql = `SELECT * FROM comments WHERE comment_ID="${id}"`
    const [row, field] = await pool.execute(sql);
    return row;
  }

  static async findByPostId(id) {
    const sql = `SELECT DATE_FORMAT(comments.doc, '%m/%d/%Y %H:%i') as doc , comments.content, members.username, members.member_ID FROM comments INNER JOIN members ON members.member_ID = comments.member_ID WHERE post_ID="${id}" ORDER BY comments.doc;`
    const [rows, field] = await pool.execute(sql);
    return rows;
  }
}

module.exports = Comment;