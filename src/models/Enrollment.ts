import {
  HydratedDocument,
  Model,
  Schema,
  Types,
  model,
  models,
} from "mongoose";

export interface IEnrollment {
  user: Types.ObjectId;
  course: Types.ObjectId;
  enrolledAt: Date;
  progress: number;
  status: "active" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export type EnrollmentDocument =
  HydratedDocument<IEnrollment>;

const enrollmentSchema = new Schema<IEnrollment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

enrollmentSchema.index(
  {
    user: 1,
    course: 1,
  },
  {
    unique: true,
  },
);

const Enrollment: Model<IEnrollment> =
  models.Enrollment ||
  model<IEnrollment>("Enrollment", enrollmentSchema);

export default Enrollment;