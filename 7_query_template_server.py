// Simple Node.js Backend Server for Template Library
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

class TemplateServer {
    constructor(port = 3000) {
        this.port = port;
        this.templates = this.loadTemplateData();
        this.server = null;
    }

    loadTemplateData() {
        return [
            {
                id: 1,
                name: 'Emotion Selection Templates',
                category: 'emotion',
                popularity: 95,
                dateCreated: '2024-01-15T00:00:00Z',
                description: 'Interactive emoji-based emotion selection templates',
                tags: ['emoji', 'emotion', 'interactive', 'selection'],
                author: 'Template Team',
                usageCount: 1250,
                rating: 4.8
            },
            {
                id: 2,
                name: 'Simple Response Templates',
                category: 'response',
                popularity: 88,
                dateCreated: '2024-01-10T00:00:00Z',
                description: 'Yes/No and simple binary response templates',
                tags: ['binary', 'simple', 'yes-no', 'quick'],
                author: 'Template Team',
                usageCount: 980,
                rating: 4.6
            },
            {
                id: 3,
                name: 'Scale-Based Response Templates',
                category: 'scale',
                popularity: 92,
                dateCreated: '2024-01-20T00:00:00Z',
                description: 'Rating scales and gradient response templates',
                tags: ['scale', 'rating', 'gradient', 'measurement'],
                author: 'Template Team',
                usageCount: 1150,
                rating: 4.7
            },
            {
                id: 4,
                name: 'Descriptive Response Templates',
                category: 'descriptive',
                popularity: 78,
                dateCreated: '2024-01-05T00:00:00Z',
                description: 'Word cloud and text-based response templates',
                tags: ['text', 'descriptive', 'wordcloud', 'detailed'],
                author: 'Template Team',
                usageCount: 750,
                rating: 4.4
            },
            {
                id: 5,
                name: 'Follow-Up Templates',
                category: 'followup',
                popularity: 85,
                dateCreated: '2024-01-12T00:00:00Z',
                description: 'Follow-up and reminder templates',
                tags: ['followup', 'reminder', 'tracking', 'workflow'],
                author: 'Template Team',
                usageCount: 890,
                rating: 4.5
            },
            {
                id: 6,
                name: 'Contextual Response Templates',
                category: 'contextual',
                popularity: 90,
                dateCreated: '2024-01-18T00:00:00Z',
                description: 'Context-aware and dynamic response templates',
                tags: ['contextual', 'dynamic', 'adaptive', 'smart'],
                author: 'Template Team',
                usageCount: 1050,
                rating: 4.6
            }
        ];
    }

    start() {
        this.server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        this.server.listen(this.port, () => {
            console.log(`Template Library Server running at http://localhost:${this.port}`);
            console.log('Available endpoints:');
            console.log('  GET /api/templates - Get all templates');
            console.log('  GET /api/templates?category=<category> - Filter by category');
            console.log('  GET /api/templates?search=<term> - Search templates');
            console.log('  GET /api/templates?sort=<field> - Sort templates');
            console.log('  GET /api/categories - Get available categories');
            console.log('  GET / - Serve the main application');
        });

        return this.server;
    }

    stop() {
        if (this.server) {
            this.server.close();
        }
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;
        const query = parsedUrl.query;

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        // API Routes
        if (pathname.startsWith('/api/')) {
            this.handleApiRequest(pathname, query, req, res);
            return;
        }

        // Serve static files
        this.serveStaticFile(pathname, res);
    }

    handleApiRequest(pathname, query, req, res) {
        res.setHeader('Content-Type', 'application/json');

        try {
            switch (pathname) {
                case '/api/templates':
                    this.handleTemplatesRequest(query, res);
                    break;
                
                case '/api/categories':
                    this.handleCategoriesRequest(res);
                    break;
                
                case '/api/template':
                    if (query.id) {
                        this.handleSingleTemplateRequest(query.id, res);
                    } else {
                        this.sendError(res, 400, 'Template ID is required');
                    }
                    break;
                
                default:
                    this.sendError(res, 404, 'API endpoint not found');
            }
        } catch (error) {
            console.error('API Error:', error);
            this.sendError(res, 500, 'Internal server error');
        }
    }

    handleTemplatesRequest(query, res) {
        let filteredTemplates = [...this.templates];

        // Filter by category
        if (query.category && query.category !== 'all') {
            filteredTemplates = filteredTemplates.filter(
                template => template.category === query.category
            );
        }

        // Search functionality
        if (query.search) {
            const searchTerm = query.search.toLowerCase();
            filteredTemplates = filteredTemplates.filter(template =>
                template.name.toLowerCase().includes(searchTerm) ||
                template.description.toLowerCase().includes(searchTerm) ||
                template.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Sort functionality
        if (query.sort) {
            switch (query.sort) {
                case 'popular':
                    filteredTemplates.sort((a, b) => b.popularity - a.popularity);
                    break;
                case 'newest':
                    filteredTemplates.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
                    break;
                case 'oldest':
                    filteredTemplates.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
                    break;
                case 'name':
                    filteredTemplates.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'rating':
                    filteredTemplates.sort((a, b) => b.rating - a.rating);
                    break;
                case 'usage':
                    filteredTemplates.sort((a, b) => b.usageCount - a.usageCount);
                    break;
                default:
                    // Default to popularity
                    filteredTemplates.sort((a, b) => b.popularity - a.popularity);
            }
        }

        // Pagination
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

        const response = {
            success: true,
            data: paginatedTemplates,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredTemplates.length / limit),
                totalItems: filteredTemplates.length,
                itemsPerPage: limit,
                hasNextPage: endIndex < filteredTemplates.length,
                hasPrevPage: page > 1
            },
            filters: {
                category: query.category || 'all',
                search: query.search || '',
                sort: query.sort || 'popular'
            }
        };

        res.writeHead(200);
        res.end(JSON.stringify(response, null, 2));
    }

    handleCategoriesRequest(res) {
        const categories = [
            { value: 'all', label: 'All', count: this.templates.length },
            { value: 'emotion', label: 'Emotion Selection', count: this.templates.filter(t => t.category === 'emotion').length },
            { value: 'response', label: 'Simple Response', count: this.templates.filter(t => t.category === 'response').length },
            { value: 'scale', label: 'Scale-Based Response', count: this.templates.filter(t => t.category === 'scale').length },
            { value: 'descriptive', label: 'Descriptive Response', count: this.templates.filter(t => t.category === 'descriptive').length },
            { value: 'followup', label: 'Follow-Up', count: this.templates.filter(t => t.category === 'followup').length },
            { value: 'contextual', label: 'Contextual Response', count: this.templates.filter(t => t.category === 'contextual').length }
        ];

        const response = {
            success: true,
            data: categories
        };

        res.writeHead(200);
        res.end(JSON.stringify(response, null, 2));
    }

    handleSingleTemplateRequest(templateId, res) {
        const template = this.templates.find(t => t.id === parseInt(templateId));
        
        if (!template) {
            this.sendError(res, 404, 'Template not found');
            return;
        }

        const response = {
            success: true,
            data: template
        };

        res.writeHead(200);
        res.end(JSON.stringify(response, null, 2));
    }

    serveStaticFile(pathname, res) {
        // Default to index.html for root path
        if (pathname === '/') {
            pathname = '/7_query_template.html';
        }

        const filePath = path.join(__dirname, pathname);
        const extname = path.extname(filePath).toLowerCase();

        // MIME types
        const mimeTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };

        const contentType = mimeTypes[extname] || 'application/octet-stream';

        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    // File not found
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(`
                        <html>
                            <head><title>404 Not Found</title></head>
                            <body>
                                <h1>404 - File Not Found</h1>
                                <p>The requested file <code>${pathname}</code> was not found.</p>
                                <a href="/">Go back to Template Library</a>
                            </body>
                        </html>
                    `);
                } else {
                    // Server error
                    res.writeHead(500);
                    res.end(`Server Error: ${error.code}`);
                }
            } else {
                // Success
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }

    sendError(res, statusCode, message) {
        const response = {
            success: false,
            error: {
                code: statusCode,
                message: message
            }
        };

        res.writeHead(statusCode);
        res.end(JSON.stringify(response, null, 2));
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const server = new TemplateServer(3000);
    server.start();

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\nShutting down server...');
        server.stop();
        process.exit(0);
    });
}

module.exports = TemplateServer;