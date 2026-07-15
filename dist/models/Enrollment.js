"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const enrollmentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
enrollmentSchema.index({
    user: 1,
    course: 1,
}, {
    unique: true,
});
const Enrollment = mongoose_1.models.Enrollment ||
    (0, mongoose_1.model)("Enrollment", enrollmentSchema);
exports.default = Enrollment;
