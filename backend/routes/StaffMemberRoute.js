import express from 'express';
import {
    getStaffMembers,
    getStaffMembersById,
    createStaffMember,
    createStaffMemberMany,
    updateStaffMember,
    deleteStaffMember
} from "../controllers/StaffMemberController.js";

const router = express.Router();

router.get('/staffMembers', getStaffMembers);
router.get('/staffMembers/:id', getStaffMembersById);
router.post('/staffMembers', createStaffMember);
router.post('/staffMembersMany', createStaffMemberMany);
router.patch('/staffMembers/:id', updateStaffMember);
router.delete('/staffMembers/:id', deleteStaffMember);

export default router;