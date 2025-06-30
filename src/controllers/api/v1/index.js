import { Router } from "express";
import { planVoyage } from "./planVoyageController.js";
import { getPlanHistory } from "./planHistoryController.js";
import { submitFeedback } from "./feedbackController.js";
import { getMaintenanceAlerts } from "./maintenanceController.js";

const v1 = Router();

v1.get("/", (req, res) => {
    res.send("Hello World - Planning Brain API v1");
});

v1.post("/plan-voyage", planVoyage);
v1.get("/plan-history", getPlanHistory);

v1.post("/feedback", submitFeedback);

v1.get("/maintenance-alerts", getMaintenanceAlerts);

export default v1;