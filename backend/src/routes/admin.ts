import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { requireAdmin } from '../middleware/admin';
import User from '../models/User';
import Prank from '../models/Prank';
import { logger } from '../utils/logger';

const router = Router();

// All admin routes require authentication and admin privileges
router.use(authenticate);
router.use(requireAdmin);

// Get admin dashboard stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPranks = await Prank.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    const googleUsers = await User.countDocuments({ googleId: { $exists: true, $ne: null } });

    // Get recent users (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get recent pranks (last 7 days)
    const recentPranks = await Prank.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    return res.status(200).json({
      stats: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          googleAuth: googleUsers,
          recent: recentUsers,
        },
        pranks: {
          total: totalPranks,
          recent: recentPranks,
        },
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Admin stats error:', err);
    return res.status(500).json({
      error: {
        message: 'Failed to fetch admin stats',
      },
    });
  }
});

// Get all users (paginated)
router.get('/users', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments();

    return res.status(200).json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Admin users list error:', err);
    return res.status(500).json({
      error: {
        message: 'Failed to fetch users',
      },
    });
  }
});

// Get all pranks (paginated)
router.get('/pranks', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;

    const pranks = await Prank.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Prank.countDocuments();

    return res.status(200).json({
      pranks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Admin pranks list error:', err);
    return res.status(500).json({
      error: {
        message: 'Failed to fetch pranks',
      },
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    
    // Validate MongoDB ObjectId format
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: {
          message: 'Invalid user ID format',
        },
      });
    }

    const user = await User.findById(userId)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .lean();

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
        },
      });
    }

    // Get user's pranks
    const userPranks = await Prank.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      user,
      pranks: userPranks,
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Admin get user error:', err);
    return res.status(500).json({
      error: {
        message: 'Failed to fetch user',
      },
    });
  }
});

// Delete user (soft delete - mark as inactive if needed)
router.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = req.params.id;

    // Validate MongoDB ObjectId format
    if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: {
          message: 'Invalid user ID format',
        },
      });
    }

    // Prevent admin from deleting themselves
    if (authReq.user?.userId === userId) {
      return res.status(400).json({
        error: {
          message: 'Cannot delete your own account',
        },
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
        },
      });
    }

    // Also delete user's pranks
    await Prank.deleteMany({ userId });

    logger.info(`Admin deleted user: ${user.email} (ID: ${userId})`);

    return res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Admin delete user error:', err);
    return res.status(500).json({
      error: {
        message: 'Failed to delete user',
      },
    });
  }
});

// Get prank by ID (admin can view any prank)
router.get('/pranks/:id', async (req: Request, res: Response) => {
  try {
    const prankId = req.params.id;
    
    // Validate MongoDB ObjectId format
    if (!prankId || !prankId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: {
          message: 'Invalid prank ID format',
        },
      });
    }

    const prank = await Prank.findById(prankId)
      .populate('userId', 'name email')
      .lean();

    if (!prank) {
      return res.status(404).json({
        error: {
          message: 'Prank not found',
        },
      });
    }

    // Format response similar to prankService
    const response = {
      id: prank._id.toString(),
      yourName: prank.yourName,
      yourPhone: prank.yourPhone,
      yourEmail: prank.yourEmail,
      friendName: prank.friendName,
      friendAge: prank.friendAge,
      friendPhone: prank.friendPhone,
      friendEmail: prank.friendEmail,
      relationship: prank.relationship,
      friendGender: prank.friendGender,
      friendLocation: prank.friendLocation,
      personalityTypes: prank.personalityTypes,
      prankType: prank.prankType,
      additionalInfo: prank.additionalInfo,
      status: prank.status,
      createdAt: prank.createdAt,
      updatedAt: prank.updatedAt,
      userId: prank.userId,
    };

    return res.status(200).json({
      prank: response,
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Admin get prank error:', err);
    return res.status(500).json({
      error: {
        message: 'Failed to fetch prank',
      },
    });
  }
});

// Delete prank
router.delete('/pranks/:id', async (req: Request, res: Response) => {
  try {
    const prankId = req.params.id;
    
    // Validate MongoDB ObjectId format
    if (!prankId || !prankId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: {
          message: 'Invalid prank ID format',
        },
      });
    }

    const prank = await Prank.findByIdAndDelete(prankId);

    if (!prank) {
      return res.status(404).json({
        error: {
          message: 'Prank not found',
        },
      });
    }

    logger.info(`Admin deleted prank: ${prankId}`);

    return res.status(200).json({
      message: 'Prank deleted successfully',
    });
  } catch (error: unknown) {
    const err = error as Error;
    logger.error('Admin delete prank error:', err);
    return res.status(500).json({
      error: {
        message: 'Failed to delete prank',
      },
    });
  }
});

export default router;

