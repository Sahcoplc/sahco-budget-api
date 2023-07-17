import express from "express";
import accountRoutes from "./Account.js"
import budgetRoutes from "./Budget.js"
import staticRoutes from "./Static.js"

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).send({
      message: `Welcome to Skyway Aviation Handling Company Budget Management Application API. Check the API specification for further guidiance and next steps.`,
      success: 1,
    });
});

router.use('/account', accountRoutes);
router.use('/budget', budgetRoutes);
router.use('/static-data', staticRoutes)

export default router;