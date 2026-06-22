const mongoose = require("mongoose");

const startDb = async (port, server) => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECT);
        console.log("Database MongoDB connesso con successo!");

        server.listen(port, () => {
            console.log(`Server di FlowBix in esecuzione sulla porta ${port}`);
        });

    } catch (err) {
        console.error("Errore di connessione al Database:", err);
        process.exit(1); 
    }
};

module.exports = startDb;