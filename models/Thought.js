const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction')

// Schema to create Post model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      minLength: 1,
      maxLength: 280,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [Reaction],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('getReactions')
  // Getter
  .get(function () {
    return this.reactions.length;
  });
  thoughtSchema
  .virtual('formattedDate')
  .get(function () {
    var date = this.createdAt
    return date.toString()
  });


const Thought = model('thought', thoughtSchema);

module.exports = Thought;
