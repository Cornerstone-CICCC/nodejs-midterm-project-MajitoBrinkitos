// src/models/artwork.model.ts
import { Schema, Document, model, Types} from 'mongoose';

export interface IArtwork extends Document {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    imageUrl: string;
    //additional fields go here
}

const ArtworkSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    //additional fields go here
});

export default model<IArtwork>('Artwork', ArtworkSchema);