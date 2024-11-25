import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "department",
    required: true,
  },
  attendances: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      checkIn: {
        type: Date,
        required: true,
      },
      checkOut: {
        type: Date,
        required: false,
        validate: {
          validator: function (value) {
            return !value || value >= this.checkIn;
          },
          message: "checkOut must be after checkIn",
        },
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.model("attendance", AttendanceSchema);
