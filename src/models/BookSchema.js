const {Schema, model} = require('mongoose');

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    edition: {
        type: String
    },
    cover: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    noOfCopies: {
        type: Number,
        required: true
    },
    availableCount: {
        type: Number,
        required: true,
        validate: {
            validator: function (value) {
                return value >= 0 && value <= this.noOfCopies;
            }
        }
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    }
});

bookSchema.index({title: "text", edition: "text", description: "text"});

module.exports = model('Book', bookSchema);