const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'templates.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        // File doesn't exist, create it with empty array
        await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
        console.log('Created templates.json file');
    }
}

// Helper function to read templates
async function readTemplates() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading templates:', error);
        return [];
    }
}

// Helper function to write templates
async function writeTemplates(templates) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(templates, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing templates:', error);
        return false;
    }
}

// Routes

// Get all templates
app.get('/api/templates', async (req, res) => {
    try {
        const templates = await readTemplates();
        res.json({
            success: true,
            data: templates,
            count: templates.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch templates'
        });
    }
});

// Get template by ID
app.get('/api/templates/:id', async (req, res) => {
    try {
        const templates = await readTemplates();
        const template = templates.find(t => t.id === req.params.id);
        
        if (!template) {
            return res.status(404).json({
                success: false,
                error: 'Template not found'
            });
        }
        
        res.json({
            success: true,
            data: template
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch template'
        });
    }
});

// Create new template
app.post('/api/templates', async (req, res) => {
    try {
        const { eventTrigger, questions, triggerEnabled, triggerDays } = req.body;
        
        // Validate required fields
        if (!eventTrigger || !questions || !Array.isArray(questions)) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: eventTrigger, questions'
            });
        }
        
        // Validate questions
        if (questions.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'At least one question is required'
            });
        }
        
        const templates = await readTemplates();
        
        const newTemplate = {
            id: Date.now().toString(),
            eventTrigger,
            questions: questions.map((q, index) => ({
                id: q.id || Date.now() + index,
                text: q.text,
                answerFormat: q.answerFormat || 'multiple-choice'
            })),
            triggerEnabled: triggerEnabled !== undefined ? triggerEnabled : true,
            triggerDays: triggerDays || 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        templates.push(newTemplate);
        
        const success = await writeTemplates(templates);
        
        if (success) {
            res.status(201).json({
                success: true,
                data: newTemplate,
                message: 'Template created successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to save template'
            });
        }
    } catch (error) {
        console.error('Error creating template:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Update template
app.put('/api/templates/:id', async (req, res) => {
    try {
        const templates = await readTemplates();
        const templateIndex = templates.findIndex(t => t.id === req.params.id);
        
        if (templateIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Template not found'
            });
        }
        
        const { eventTrigger, questions, triggerEnabled, triggerDays } = req.body;
        
        // Update template
        templates[templateIndex] = {
            ...templates[templateIndex],
            eventTrigger: eventTrigger || templates[templateIndex].eventTrigger,
            questions: questions || templates[templateIndex].questions,
            triggerEnabled: triggerEnabled !== undefined ? triggerEnabled : templates[templateIndex].triggerEnabled,
            triggerDays: triggerDays || templates[templateIndex].triggerDays,
            updatedAt: new Date().toISOString()
        };
        
        const success = await writeTemplates(templates);
        
        if (success) {
            res.json({
                success: true,
                data: templates[templateIndex],
                message: 'Template updated successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to update template'
            });
        }
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Delete template
app.delete('/api/templates/:id', async (req, res) => {
    try {
        const templates = await readTemplates();
        const templateIndex = templates.findIndex(t => t.id === req.params.id);
        
        if (templateIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Template not found'
            });
        }
        
        const deletedTemplate = templates.splice(templateIndex, 1)[0];
        
        const success = await writeTemplates(templates);
        
        if (success) {
            res.json({
                success: true,
                data: deletedTemplate,
                message: 'Template deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to delete template'
            });
        }
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '7_query_frequency.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Start server
async function startServer() {
    try {
        await initializeDataFile();
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`API endpoints available at http://localhost:${PORT}/api/`);
            console.log('Available endpoints:');
            console.log('  GET    /api/templates       - Get all templates');
            console.log('  GET    /api/templates/:id   - Get template by ID');
            console.log('  POST   /api/templates       - Create new template');
            console.log('  PUT    /api/templates/:id   - Update template');
            console.log('  DELETE /api/templates/:id   - Delete template');
            console.log('  GET    /api/health          - Health check');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();