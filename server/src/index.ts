import { app } from "./app";

const PORT = process.env.PORT || process.argv[2] || 3000;

app.listen(PORT, () => console.log(`express is running on port ${PORT}`));
