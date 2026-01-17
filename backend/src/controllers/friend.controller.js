import User from "../models/User.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const searchUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const q = (req.query.q || "").toString().trim();

    if (!q) return res.status(200).json([]);

    const safe = escapeRegex(q);
    const regex = new RegExp(safe, "i");

    const me = await User.findById(loggedInUserId).select(
      "friends friendRequestsSent friendRequestsReceived"
    );

    const users = await User.find({
      _id: { $ne: loggedInUserId },
      $or: [{ fullName: regex }, { email: regex }],
    }).select("-password");

    const friendsSet = new Set((me.friends || []).map((id) => id.toString()));
    const sentSet = new Set((me.friendRequestsSent || []).map((id) => id.toString()));
    const receivedSet = new Set((me.friendRequestsReceived || []).map((id) => id.toString()));

    const result = users.map((u) => {
      const id = u._id.toString();
      let relationship = "none";
      if (friendsSet.has(id)) relationship = "friends";
      else if (sentSet.has(id)) relationship = "request_sent";
      else if (receivedSet.has(id)) relationship = "request_received";

      return { ...u.toObject(), relationship };
    });

    res.status(200).json(result);
  } catch (error) {
    console.log("Error in searchUsers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const listFriends = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).select("friends");
    const friends = await User.find({ _id: { $in: me.friends || [] } }).select("-password");
    res.status(200).json(friends);
  } catch (error) {
    console.log("Error in listFriends:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const listFriendRequests = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).select("friendRequestsReceived");
    const requests = await User.find({ _id: { $in: me.friendRequestsReceived || [] } }).select(
      "-password"
    );
    res.status(200).json(requests);
  } catch (error) {
    console.log("Error in listFriendRequests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { id: receiverId } = req.params;

    if (!receiverId) return res.status(400).json({ message: "Receiver id is required" });
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const [sender, receiver] = await Promise.all([
      User.findById(senderId).select("friends friendRequestsSent"),
      User.findById(receiverId).select("friends friendRequestsReceived"),
    ]);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    const alreadyFriends = (sender.friends || []).some((id) => id.equals(receiver._id));
    if (alreadyFriends) return res.status(400).json({ message: "Already friends" });

    const alreadySent = (sender.friendRequestsSent || []).some((id) => id.equals(receiver._id));
    if (alreadySent) return res.status(400).json({ message: "Request already sent" });

    const alreadyReceived = (receiver.friendRequestsReceived || []).some((id) => id.equals(sender._id));
    if (alreadyReceived) return res.status(400).json({ message: "Request already pending" });

    sender.friendRequestsSent = [...(sender.friendRequestsSent || []), receiver._id];
    receiver.friendRequestsReceived = [...(receiver.friendRequestsReceived || []), sender._id];

    await Promise.all([sender.save(), receiver.save()]);

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.log("Error in sendFriendRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const meId = req.user._id;
    const { id: requesterId } = req.params;

    const [me, requester] = await Promise.all([
      User.findById(meId).select("friends friendRequestsReceived"),
      User.findById(requesterId).select("friends friendRequestsSent"),
    ]);

    if (!requester) return res.status(404).json({ message: "User not found" });

    const hasRequest = (me.friendRequestsReceived || []).some((id) => id.equals(requester._id));
    if (!hasRequest) return res.status(400).json({ message: "No pending request" });

    me.friendRequestsReceived = (me.friendRequestsReceived || []).filter((id) => !id.equals(requester._id));
    requester.friendRequestsSent = (requester.friendRequestsSent || []).filter((id) => !id.equals(me._id));

    if (!(me.friends || []).some((id) => id.equals(requester._id))) {
      me.friends = [...(me.friends || []), requester._id];
    }
    if (!(requester.friends || []).some((id) => id.equals(me._id))) {
      requester.friends = [...(requester.friends || []), me._id];
    }

    await Promise.all([me.save(), requester.save()]);

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.log("Error in acceptFriendRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const meId = req.user._id;
    const { id: requesterId } = req.params;

    const [me, requester] = await Promise.all([
      User.findById(meId).select("friendRequestsReceived"),
      User.findById(requesterId).select("friendRequestsSent"),
    ]);

    if (!requester) return res.status(404).json({ message: "User not found" });

    me.friendRequestsReceived = (me.friendRequestsReceived || []).filter((id) => !id.equals(requester._id));
    requester.friendRequestsSent = (requester.friendRequestsSent || []).filter((id) => !id.equals(me._id));

    await Promise.all([me.save(), requester.save()]);

    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.log("Error in rejectFriendRequest:", error);
    res.status(500).json({ message: "Server error" });
  }
};
