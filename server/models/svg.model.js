import mongoose from "mongoose";

const svgSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    svgCode: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Public", "Private"],
        default: "Public"
    },
    theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light"
    }
}, { timestamps: true });

svgSchema.index({ title: "text", svgCode: "text" });

const SvgModel = mongoose.model('Svg', svgSchema);
export default SvgModel;
