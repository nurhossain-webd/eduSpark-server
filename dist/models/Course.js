"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    studentName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 60,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 500,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    _id: true,
});
const courseSchema = new mongoose_1.Schema({
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
    totalReviews: {
        type: Number,
        default: 0,
        min: 0,
    },
    reviews: {
        type: [reviewSchema],
        default: [],
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
}, {
    timestamps: true,
});
courseSchema.index({
    title: "text",
    shortDescription: "text",
    category: "text",
    instructor: "text",
});
const Course = mongoose_1.models.Course ||
    (0, mongoose_1.model)("Course", courseSchema);
exports.default = Course;
