import { Document, Schema, model, models } from "mongoose";

export interface ICourse extends Document {
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  language: string;
  price: number;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  image: string;
  instructor: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    language: {
      type: String,
      required: true,
      trim: true,
      default: "English",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    students: {
      type: Number,
      default: 0,
      min: 0,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    lessons: {
      type: Number,
      required: true,
      min: 1,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    instructor: {
      type: String,
      required: true,
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

courseSchema.index({
  title: "text",
  shortDescription: "text",
  category: "text",
  instructor: "text",
});

const Course =
  models.Course || model<ICourse>("Course", courseSchema);

export default Course;