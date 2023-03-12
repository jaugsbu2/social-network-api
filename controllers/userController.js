const {User, Thought} = require("../models");

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts")
      .populate("friends")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => 
      !user
      ? res
          .status(404)
          .json({ message: "No user with this id to make a friend!" })
      : Thought.deleteMany(
          {username: user.username },
        ))
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "User deleted but no thoughts deleted for this user!" })
          : res.json({ message: "User and Thoughts successfully deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },

  // Add a thought reaction
  addFriend(req, res) {
    User.findOne({ _id: req.params.friendId })
      .then((friend) =>
        !friend
          ? res
              .status(404)
              .json({ message: "No user with this id to make a friend!" })
          : User.findOneAndUpdate(
              { _id: req.params.userId },
              { $addToSet: { friends: req.params.friendId } },
              { runValidators: true, new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  removeFriend(req, res) {
    User.findOne({ _id: req.params.friendId })
      .then((friend) =>
        !friend
          ? res
              .status(404)
              .json({ message: "No user with this id to make a friend!" })
          : User.findOneAndUpdate(
              { _id: req.params.userId },
              { $pull: { friends: req.params.friendId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
