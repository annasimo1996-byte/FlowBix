/**
 * Dati di combinedData per data (giorno o mese) per il grafico temporale.
 * @param {Array} combinedData - Array unificato delle transazioni
 * @param {string} filterMode - 'monthly', 'range', 'custom'
 * @returns {Array} Array di oggetti formattati per Recharts: [{ label, income, expense, net }]
 */
export const getTrendChartData = (combinedData, filterMode) => {
    if (!combinedData || combinedData.length === 0) return [];

    const aggregated = {};

    combinedData.forEach((item) => {
        const d = item.date instanceof Date ? item.date : new Date(item.date);
        if (isNaN(d.getTime())) return;

        // Se il filtro è a range esteso raggruppa per Mese/Anno 
        // Altrimenti raggruppa per Giorno/Mese 
        let key;
        if (filterMode === 'range') {
            key = d.toLocaleDateString('it-IT', { month: 'short', year: '2-digit' });
        } else {
            key = d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
        }

        if (!aggregated[key]) {
            aggregated[key] = {
                label: key,
                income: 0,
                expense: 0,
                rawDate: d.getTime(), //ordine cronologico
            };
        }

        if (item.type === 'income') {
            aggregated[key].income += Number(item.amount) || 0;
        } else if (item.type === 'expense') {
            aggregated[key].expense += Number(item.amount) || 0;
        }
    });

    // Converte l'oggetto in un array e ordina in senso decrescente
    return Object.values(aggregated)
        .sort((a, b) => a.rawDate - b.rawDate)
        .map(({ rawDate, ...rest }) => ({
            ...rest,
            net: rest.income - rest.expense,
        }));
};

/**
 * Raggruppa le transazioni per Categoria per il grafico a torta.
 * @param {Array} combinedData - Array unificato delle transazioni
 * @param {string} targetType - 'expense' (default) oppure 'income'
 * @returns {Array} Array di oggetti formattati per Recharts: [{ name, value }]
 */
export const getCategoryChartData = (combinedData, targetType = 'expense') => {
    if (!combinedData || combinedData.length === 0) return [];

    const categories = {};

    combinedData
        .filter((item) => item.type === targetType)
        .forEach((item) => {
            const catName = item.category || 'Altro';
            const amount = Number(item.amount) || 0;

            if (!categories[catName]) {
                categories[catName] = 0;
            }
            categories[catName] += amount;
        });

    return Object.keys(categories).map((catName) => ({
        name: catName,
        value: Number(categories[catName].toFixed(2)),
    }));
};