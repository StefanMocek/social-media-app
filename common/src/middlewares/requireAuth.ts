import { NextFunction, Request, Response, Router } from 'express';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    return next(new Error('not authorized'))
  };

  next();
};
