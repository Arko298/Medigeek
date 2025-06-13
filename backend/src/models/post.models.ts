import mongoose, { Schema, Document } from "mongoose";

export interface IComment {
  user: mongoose.Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IPost extends Document {
  title: string;
  description: string;
  content: string;
  image: string;
  imageKey?: string;
  author: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ""
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imageKey: {
    type: String,
    required: false,
    default: null
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  comments: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Add text index for search functionality
postSchema.index({ title: 'text', description: 'text', content: 'text' });

const Post = mongoose.model<IPost>("Post", postSchema);
export default Post;