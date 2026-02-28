import { Router } from 'express';
import multer from 'multer';
const pdfParse = require('pdf-parse');
import { matchResumeToAlumni } from '../services/aiMatcher';
import { ALUMNI_DATA } from '../data/alumni';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No resume file uploaded' });
        }

        if (req.file.mimetype !== 'application/pdf') {
            return res.status(400).json({ error: 'Only PDF files are supported' });
        }

        // Parse the PDF
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ error: 'Could not extract text from the PDF' });
        }

        // Call Gemini AI matcher
        const matches = await matchResumeToAlumni(resumeText);

        // Hydrate the matches with full alumni data
        const hydratedMatches = matches.map((match: any) => {
            const alumnus = ALUMNI_DATA.find((a) => a.id === match.alumnusId);
            return {
                ...match,
                alumnus
            };
        }).filter((m: any) => m.alumnus); // Filter out any invalid IDs

        res.json({ matches: hydratedMatches });
    } catch (error: any) {
        console.error('Match error:', error);
        res.status(500).json({ error: error.message || 'An error occurred during matching' });
    }
});

export default router;
