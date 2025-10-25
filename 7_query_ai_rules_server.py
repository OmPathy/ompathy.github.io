const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'rules-data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize data file if it doesn't exist
function initializeDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        const defaultRules = [
            {
                id: 1,
                name: "Salary Inquiry Rule",
                keywords: '"salary"',
                response: '"Salary-related queries should be ..."',
                created: "Feb 15, 2025, 10:00 AM",
                status: true
            },
            {
                id: 2,
                name: "Work Hours Rule",
                keywords: '"overtime, working hours"',
                response: '"Please refer to the overtime policy..."',
                created: "Jan 16, 2025, 09:30 AM",
                status: true
            },
            {
                id: 3,
                name: "Benefits Rule",
                keywords: '"benefits"',
                response: '"For benefits inquiries, please contact..."',
                created: "Dec 21, 2024, 11:15 AM",
                status: true
            },
            {
                id: 4,
                name: "Promotion Inquiry Rule",
                keywords: '"promotion"',
                response: '"Promotion questions should be ..."',
                created: "Aug 10, 2024, 02:45 PM",
                status: true
            },
            {
                id: 5,
                name: "Performance Review Rule",
                keywords: '"performance"',
                response: '"Performance reviews are held ..."',
                created: "Jul 11, 2024, 10:20 AM",
                status: false
            },
            {
                id: 6,
                name: "Leave Policy Rule",
                keywords: '"vacation"',
                response: '"Please refer to the employee ..."',
                created: "Apr 16, 2024, 08:00 AM",
                status: false
            },
            {
                id: 7,
                name: "Expense Reimbursement Rule",
                keywords: '"expense"',
                response: '"Expense claims should be ..."',
                created: "Feb 21, 2024, 01:30 PM",
                status: false
            },
            {
                id: 8,
                name: "Training Session Rule",
                keywords: '"Training, Workshop"',
                response: '"Please sign up for training..."',
                created: "Jan 26, 2024, 01:30 PM",
                status: false
            }
        ];
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultRules, null, 2));
    }
}

// Helper functions
function readRules() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading rules:', error);
        return [];
    }
}

function writeRules(rules) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(rules, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing rules:', error);
        return false;
    }
}

// API Routes

// GET /api/rules - Get all rules
app.get('/api/rules', (req, res) => {
    try {
        const rules = readRules();
        res.json({
            success: true,
            data: rules,
            count: rules.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching rules',
            error: error.message
        });
    }
});

// GET /api/rules/:id - Get a specific rule
app.get('/api/rules/:id', (req, res) => {
    try {
        const rules = readRules();
        const rule = rules.find(r => r.id === parseInt(req.params.id));
        
        if (!rule) {
            return res.status(404).json({
                success: false,
                message: 'Rule not found'
            });
        }
        
        res.json({
            success: true,
            data: rule
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching rule',
            error: error.message
        });
    }
});

// POST /api/rules - Create a new rule
app.post('/api/rules', (req, res) => {
    try {
        const { name, keywords, response } = req.body;
        
        if (!name || !keywords || !response) {
            return res.status(400).json({
                success: false,
                message: 'Name, keywords, and response are required'
            });
        }
        
        const rules = readRules();
        const newRule = {
            id: Math.max(...rules.map(r => r.id), 0) + 1,
            name,
            keywords,
            response,
            created: new Date().toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }),
            status: true
        };
        
        rules.unshift(newRule);
        
        if (writeRules(rules)) {
            res.status(201).json({
                success: true,
                data: newRule,
                message: 'Rule created successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving rule'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating rule',
            error: error.message
        });
    }
});

// PUT /api/rules/:id - Update a rule
app.put('/api/rules/:id', (req, res) => {
    try {
        const rules = readRules();
        const ruleIndex = rules.findIndex(r => r.id === parseInt(req.params.id));
        
        if (ruleIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Rule not found'
            });
        }
        
        const { name, keywords, response, status } = req.body;
        const updatedRule = {
            ...rules[ruleIndex],
            ...(name && { name }),
            ...(keywords && { keywords }),
            ...(response && { response }),
            ...(status !== undefined && { status })
        };
        
        rules[ruleIndex] = updatedRule;
        
        if (writeRules(rules)) {
            res.json({
                success: true,
                data: updatedRule,
                message: 'Rule updated successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving rule'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating rule',
            error: error.message
        });
    }
});

// PATCH /api/rules/:id/toggle - Toggle rule status
app.patch('/api/rules/:id/toggle', (req, res) => {
    try {
        const rules = readRules();
        const ruleIndex = rules.findIndex(r => r.id === parseInt(req.params.id));
        
        if (ruleIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Rule not found'
            });
        }
        
        rules[ruleIndex].status = !rules[ruleIndex].status;
        
        if (writeRules(rules)) {
            res.json({
                success: true,
                data: rules[ruleIndex],
                message: `Rule ${rules[ruleIndex].status ? 'enabled' : 'disabled'} successfully`
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving rule'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error toggling rule',
            error: error.message
        });
    }
});

// DELETE /api/rules/:id - Delete a rule
app.delete('/api/rules/:id', (req, res) => {
    try {
        const rules = readRules();
        const ruleIndex = rules.findIndex(r => r.id === parseInt(req.params.id));
        
        if (ruleIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Rule not found'
            });
        }
        
        const deletedRule = rules.splice(ruleIndex, 1)[0];
        
        if (writeRules(rules)) {
            res.json({
                success: true,
                data: deletedRule,
                message: 'Rule deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Error saving rules'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting rule',
            error: error.message
        });
    }
});

// GET /api/stats - Get statistics
app.get('/api/stats', (req, res) => {
    try {
        const rules = readRules();
        const activeRules = rules.filter(r => r.status);
        const inactiveRules = rules.filter(r => !r.status);
        
        res.json({
            success: true,
            data: {
                total: rules.length,
                active: activeRules.length,
                inactive: inactiveRules.length,
                activeRules: activeRules.map(r => ({ id: r.id, name: r.name })),
                inactiveRules: inactiveRules.map(r => ({ id: r.id, name: r.name }))
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '7_query_ai_rules.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Initialize and start server
initializeDataFile();

app.listen(PORT, () => {
    console.log(`AI Response Rules Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api/rules`);
});

module.exports = app;