import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: String,
    userEmail: String,
    serviceId: String,
    serviceName: String,
    serviceSlug: String,
    durationValue: Number,
    durationUnit: { type: String, enum: ['hours', 'days'] },
    division: String,
    district: String,
    city: String,
    area: String,
    addressLine: String,
    totalCost: Number,
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
