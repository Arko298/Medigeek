import { Router } from "express"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notification.controller.ts"
import { authenticateToken } from "../middlewares/auth.middlewares.ts"

const router: Router = Router()

// All routes require authentication
router.get("/", authenticateToken, getNotifications)
router.put("/:notificationId/read", authenticateToken, markAsRead)
router.put("/mark-all-read", authenticateToken, markAllAsRead)
router.delete("/:notificationId", authenticateToken, deleteNotification)

export default router
