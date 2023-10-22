import express from 'express';
import {
    getStaffMembers,
    getStaffMembersById,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember
} from "../controllers/StaffMemberController.js";

const router = express.Router();

router.get('/staffMembers', getStaffMembers);
router.get('/staffMembers/:id', getStaffMembersById);
router.post('/staffMembers', createStaffMember);
router.patch('/staffMembers/:id', updateStaffMember);
router.delete('/staffMembers/:id', deleteStaffMember);

export default router;