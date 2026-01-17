import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import {
  acceptFriendRequest,
  listFriendRequests,
  listFriends,
  rejectFriendRequest,
  searchUsers,
  sendFriendRequest,
} from "../controllers/friend.controller.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.get("/search", searchUsers);
router.get("/list", listFriends);
router.get("/requests", listFriendRequests);
router.post("/request/:id", sendFriendRequest);
router.post("/accept/:id", acceptFriendRequest);
router.post("/reject/:id", rejectFriendRequest);

export default router;
