
let metrics = {
    aegis_threat_total: 0,
    aegis_request_401: 0,
    aegis_request_403: 0,
    aegis_request_500: 0,
};

export const incrementMetric = (key: keyof typeof metrics) => {
    metrics[key]++;
};

export const getMetrics = () => {
    return metrics;
};
