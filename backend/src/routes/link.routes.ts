import { Router } from 'express';
import { createLink, getLinks, getLinkById, updateLink, deleteLink, updateLinkStatus, bulkUpdateLinks } from '../controllers/link.controller';

const router = Router();

router.route('/')
    .post(createLink)
    .get(getLinks);

router.patch('/:id/status', updateLinkStatus);

router.route('/:id')
    .get(getLinkById)
    .put(updateLink)
    .delete(deleteLink);

router.post('/bulk', bulkUpdateLinks);    

export default router;