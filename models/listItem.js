const mongoose = require("mongoose")

const ListItemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true}
})

//export job model
const ListItemModel = mongoose.model("ListItem", ListItemSchema)
module.exports = ListItemModel