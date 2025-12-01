import { Router, Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createPrank, getUserPranks, getPrankById } from '../services/prankService';
import { validatePrankSubmission } from '../validators/prankValidator';
import { prankSubmissionLimiter } from '../middleware/rateLimiter';
import { sanitizeBody } from '../middleware/sanitize';

const router = Router();

// All prank routes require authentication
router.use(authenticate);

// Sanitize input for all prank routes
router.use(sanitizeBody);

// Create a new prank submission
router.post('/', prankSubmissionLimiter, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user?.userId) {
      return res.status(401).json({
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const validation = validatePrankSubmission(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: {
          message: 'Validation failed',
          errors: validation.errors,
        },
      });
    }

    const prank = await createPrank(authReq.user.userId, req.body);
    
    return res.status(201).json({
      message: 'Prank plan created successfully',
      prank,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      error: {
        message: err.message || 'Failed to create prank plan',
      },
    });
  }
});

// Get all pranks for the authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user?.userId) {
      return res.status(401).json({
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const pranks = await getUserPranks(authReq.user.userId);
    
    return res.status(200).json({
      pranks,
      count: pranks.length,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      error: {
        message: err.message || 'Failed to fetch pranks',
      },
    });
  }
});

// Get a specific prank by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user?.userId) {
      return res.status(401).json({
        error: {
          message: 'User not authenticated',
        },
      });
    }

    const prankId = req.params.id;
    if (!prankId) {
      return res.status(400).json({
        error: {
          message: 'Prank ID is required',
        },
      });
    }
    const prank = await getPrankById(authReq.user.userId, prankId);
    
    if (!prank) {
      return res.status(404).json({
        error: {
          message: 'Prank not found',
        },
      });
    }

    return res.status(200).json({
      prank,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return res.status(500).json({
      error: {
        message: err.message || 'Failed to fetch prank',
      },
    });
  }
});

export default router;

