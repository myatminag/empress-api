import { application, Router } from 'express';

import { stripePayment } from '../controllers/stripe.js';

const router = Router();

router.post('/create-checkout-session/:id', stripePayment);

export default router;