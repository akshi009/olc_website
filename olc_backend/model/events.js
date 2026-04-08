import mongoose from "mongoose";

const Eventschema = mongoose.Schema({
    eventname: {
        type: String,
        required: true
    },

    image: {
        type: String,
        required: true
    }

})

export default mongoose.model("Event", Eventschema);