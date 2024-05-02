const {Schema, model} = require('mongoose');

const DashboardRouteSchema = new Schema({
    route: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: [String],
        enum: ['USER', 'ADMIN'],
        required: true,
        default: "ADMIN"
    },
    subRoutes: [
        {
            subRoute: {
                type: String,
                required: true
            },
            path: {
                type: String,
                required: true
            },
            position: {
                type: Number,
                required: true,
                validate: {
                    validator: function (value) {
                        const count = this.parent().subRoutes.filter(subRoute => subRoute.position === value).length;
                        if (count !== 1)
                            throw new Error(`Duplicate value ${value} for field subRoutes.position in ${this.parent().route}!`);

                        return true;
                    },
                }
            },
            role: {
                type: [String],
                enum: ['USER', 'ADMIN'],
                required: true,
                default: "ADMIN"
            }
        }
    ],
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now(),
        immutable: true
    }
});

DashboardRouteSchema.statics.findAllByAuthUser = async function (userRole) {
    return await this.aggregate([
        {
            $match: {
                role: userRole
            }
        },
        {
            $unwind: '$subRoutes'
        },
        {
            $match: {
                'subRoutes.role': userRole
            }
        },
        {
            $group: {
                _id: '$_id',
                route: {$first: '$route'},
                path: {$first: '$path'},
                icon: {$first: '$icon'},
                position: {$first: '$position'},
                role: {$first: userRole},
                subRoutes: {
                    $push: {
                        _id: '$subRoutes._id',
                        subRoute: '$subRoutes.subRoute',
                        path: '$subRoutes.path',
                        position: '$subRoutes.position',
                        role: userRole
                    }
                }
            }
        }
    ]).sort({
        position: 'asc',
        'subRoutes.position': 'asc'
    });
};

module.exports = model('DashboardRoute', DashboardRouteSchema);