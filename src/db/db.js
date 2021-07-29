const mongoose = require("mongoose");
const port = 27017;

mongoose.connect(process.env.SECRET_MONGODB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log(`mongoose port is ${port}!`))
    .catch((error) => console.log(error));