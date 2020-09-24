export class Post {
  constructor(
    private id: string,
    private photo: string,
    private description: string,
    private createdAt: Date,
    private type: string,
    private userId: string,
  ) {}

  getId() {
    return this.id;
  }
  getPhoto() {
    return this.photo;
  }
  getDescription() {
    return this.description;
  }
  getCreatedAt() {
    return this.createdAt;
  }
  getType() {
    return this.type;
  }
  getUserId() {
    return this.userId;
  }

  setId(id: string) {
    this.id = id;
  }
  setPhoto(photo: string) {
    this.photo = photo;
  }
  setDescription(description: string) {
    this.description = description;
  }
  setCreatedAt(createdAt: Date) {
    this.createdAt = createdAt;
  }
  setType(type: string) {
    this.type = type;
  }
  setUserId(userId: string) {
    this.userId = userId;
  }

  static toPostModel(post: any): Post {
    return new Post(
      post.id,
      post.photo,
      post.description,
      post.type,
      post.createdAt,
      post.user_id,
    );
  }
}
export interface SearchPostDTO {
  orderBy: string;
  orderType: string;
  page: number;
}
