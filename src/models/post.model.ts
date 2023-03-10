import mongoose from 'mongoose';

export interface PostDoc extends mongoose.Document { 
  title: string,
  content: string,
  comments?: Array<any>
};

export interface CreatePostDto { 
  title: string,
  content: string,
};

export interface PostModel extends mongoose.Model<PostDoc> {
  build(dto: CreatePostDto): PostDoc
};

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

postSchema.statics.biuld = (createPostDto: CreatePostDto) => {
  return new Post(createPostDto)
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export default Post;