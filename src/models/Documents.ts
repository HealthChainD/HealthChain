import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  _id: string;
  name: string;  
  cids: string[];
  owner: string; 
  createdAt: string;  
}

const DocumentSchema: Schema = new Schema({
  name: { type: String, required: true },  
  cids: { type: [String], required: true },
  owner: { type: String, required: true },  
}, {
  timestamps: true 
});

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);