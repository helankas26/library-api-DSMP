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
                if (this.isNew) {
                    return value >= 0 && value <= this.noOfCopies;
                }
                return value >= 0;
            }
        }
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

bookSchema.index({title: "text", edition: "text", description: "text"});

bookSchema.virtual('authors', {
    ref: 'Author',
    localField: '_id',
    foreignField: 'books'
});

bookSchema.virtual('category', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'books',
    justOne: true
});

module.exports = model('Book', bookSchema);