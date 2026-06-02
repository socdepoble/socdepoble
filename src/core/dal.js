export class DAL {
  static init(dbInstance) {
    this.db = dbInstance;
    // Congelar la instància per evitar mutacions en runtime
    Object.freeze(this);
  }

  static async getPost(id) {
    if (!this.db) throw new Error("DB not initialized");
    return this.db.get("SELECT * FROM posts WHERE id = ?", [id]);
  }
}
