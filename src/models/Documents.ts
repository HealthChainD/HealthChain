import mongoose, { Schema, Document } from 'mongoose';

interface IDocument extends Document {
  name: string;  
  cids: string[];
  owner: string; 
  createdAt: Date;
  updatedAt: Date; 
}

const DocumentSchema: Schema = new Schema({
  name: { type: String, required: true },  
  cids: { type: [String], required: true },
  owner: { type: String, required: true },  
}, {
  timestamps: true 
});

export default mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);