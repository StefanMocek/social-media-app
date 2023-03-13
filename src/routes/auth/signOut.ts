import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

router.post('/signout', async(req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  res.json({});
});

export { router as signOutRouter }