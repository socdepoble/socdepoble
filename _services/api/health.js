export default function handler(request, response) {
    const systemVersion = 'v1.5.3-resilience';

    response.status(200).json({
        status: 'ok',
        version: systemVersion,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        message: 'Sóc de Poble Core is nominal.'
    });
}
