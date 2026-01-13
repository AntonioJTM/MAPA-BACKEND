const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const dbMiddleware = require('./middlewares/dbMiddleware');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const socketHandler = require('./middlewares/sockets');

const app = express();
const server = http.createServer(app);

app.set('trust proxy', '192.168.100.100');

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000,
        skipMiddlewares: true
    },
});

socketHandler(io);

app.use((req, res, next) => {
    req.io = io;
    next();
});

const PORT = process.env.PORT;

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        status: 429,
        message: 'Demasiadas solicitudes, por favor intente más tarde'
    }
});

const cspDirectives = {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    "frame-ancestors": ["'self'", ...allowedOrigins]
};

app.use(helmet({
    contentSecurityPolicy: { directives: cspDirectives },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginResourcePolicy: false,
    permissionsPolicy: {
        features: {
            fullscreen: ["'self'", ...allowedOrigins]
        }
    }
}));

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
    maxAge: 600
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(apiLimiter);

const folderPath = path.join(__dirname, '../../../../var/www/html');
app.use('/FILES/static', express.static(folderPath));

const login = require('./routes/routes-login');
app.use('/login/', dbMiddleware, login());

const users = require('./routes/routes-users');
app.use('/users/', dbMiddleware, users());

const admin = require('./routes/routes-admin');
app.use('/NEMIWEB/', dbMiddleware, admin());


app.use((err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = process.env.NODE_ENV === 'development'
        ? 'Error interno del servidor'
        : err.message;

    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);

    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
        ...(process.env.NODE_ENV !== 'development' && { stack: err.stack })
    });
});

server.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});