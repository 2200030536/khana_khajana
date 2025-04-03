import mongoose from 'mongoose';

const positiveNumberValidator = {
  validator: function(value) {
    return value >= 0;
  },
  message: props => `${props.value} is not a valid price. Price must be positive.`
};

const priceSchema = new mongoose.Schema({
  // Basic meal prices (per meal)
  breakfast: {
    type: Number,
    required: true,
    validate: positiveNumberValidator
  },
  lunch: {
    vegetarian: {
      type: Number,
      required: true,
      validate: positiveNumberValidator
    },
    nonVegetarian: {
      type: Number,
      required: true,
      validate: positiveNumberValidator
    }
  },
  snacks: {
    type: Number,
    required: true,
    validate: positiveNumberValidator
  },
  dinner: {
    vegetarian: {
      type: Number,
      required: true,
      validate: positiveNumberValidator
    },
    nonVegetarian: {
      type: Number,
      required: true,
      validate: positiveNumberValidator
    }
  },
  
  // Plan prices (with discounts applied)
  plans: {
    daily: {
      vegetarian: {
        type: Number,
        required: true,
        validate: positiveNumberValidator
      },
      nonVegetarian: {
        type: Number,
        required: true,
        validate: positiveNumberValidator
      }
    },
    weekly: {
      vegetarian: {
        type: Number,
        required: true,
        validate: positiveNumberValidator
      },
      nonVegetarian: {
        type: Number,
        required: true,
        validate: positiveNumberValidator
      }
    },
    monthly: {
      vegetarian: {
        type: Number,
        required: true,
        validate: positiveNumberValidator
      },
      nonVegetarian: {
        type: Number,
        required: true,
        validate: positiveNumberValidator
      }
    },
    semester: {
      vegetarian: {
        type: Number,
        required: true,
        validate: positiveNumberValidator
      },
      nonVegetarian: {
        type: Number,
        required: true,
        validate: positiveNumberValidator
      }
    }
  },
  
  // Metadata
  effectiveFrom: {
    type: Date,
    default: Date.now,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastModifiedBy: {
    type: Number,
    ref: 'MessUser',
    required: true
  },
  notes: {
    type: String
  }
}, { 
  timestamps: true 
});

// Only one price configuration can be active at a time
priceSchema.index({ isActive: 1 }, { 
  unique: true, 
  partialFilterExpression: { isActive: true } 
});

// Efficient lookup by effective date
priceSchema.index({ effectiveFrom: -1 });

// Pre-save middleware to ensure only one active configuration
priceSchema.pre('save', async function(next) {
  // If this document is being set to active
  if (this.isActive) {
    try {
      await this.constructor.updateMany(
        { _id: { $ne: this._id }, isActive: true },
        { $set: { isActive: false } }
      );
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Price = mongoose.model('Price', priceSchema);

export default Price;