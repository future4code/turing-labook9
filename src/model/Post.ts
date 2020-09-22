export class Post {
  constructor(
    private id: string,
    private title: string,
    private description: string,
    private userId: string,
    private createdAt: Date,
  ) {}

  getId() {
    return this.id;
  }
  getTitle() {
    return this.title;
  }
  getDescription() {
    return this.description;
  }
  getUserId() {
    return this.userId;
  }
  getCreatedAt() {
    return this.createdAt;
  }

  setId(id: string) {
    this.id = id;
  }
  setTitle(title: string) {
    this.title = title;
  }
  setDescription(description: string) {
    this.description = description;
  }
  setUserId(userId: string) {
    this.userId = userId;
  }
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }
}
