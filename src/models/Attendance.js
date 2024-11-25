import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  attendances: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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
            // Si checkOut existe, debe ser después de checkIn
            return !this.checkIn || value >= this.checkIn;
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

export default mongoose.model("Attendance", AttendanceSchema);
