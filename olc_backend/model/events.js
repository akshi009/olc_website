import mongoose from "mongoose";

const Eventschema = mongoose.Schema({
    eventname: {
        type: String,
        required
    },

    image: {
        type: String,
        required
    }

})

export default mongoose.model("Event", Eventschema);