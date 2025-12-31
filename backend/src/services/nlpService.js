const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts text from uploaded file buffer (PDF or DOCX)
 * @param {Object} file - Multer file object
 * @returns {Promise<string>} Extracted text
 */
exports.extractText = async (file) => {
    if (!file) {
        throw new Error('No file provided');
    }

    try {
        // Check file mime type
        if (file.mimetype === 'application/pdf') {
            const data = await pdfParse(file.buffer);
            return data.text;
        } else if (
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.mimetype === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ buffer: file.buffer });
            return result.value;
        } else {
            // Text file or other
            return file.buffer.toString('utf8');
        }
    } catch (error) {
        console.error('Error extracting text:', error);
        throw new Error('Failed to parse resume file. Please ensure it is a valid PDF or DOCX.');
    }
};

/**
 * Simple keyword extraction (placeholder for more complex NLP if needed)
 * @param {string} text 
 * @returns {Array<string>} List of keywords
 */
exports.extractKeywords = (text) => {
    // Basic implementation - in a real app, use a library like natural or compromise
    const words = text.toLowerCase().match(/\b\w+\b/g);
    // Filter common stopwords, dedup, etc.
    return [...new Set(words)];
};
