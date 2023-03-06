import mongoose from "mongoose";
import { TokenTypes } from "../../../utils/constants";
import { toJSON } from "../../plugins";

interface TokenDocument extends mongoose.Document {
  token: string;
  user: string;
  expires: Date;
  type: string;
  blacklisted: boolean;
}

const TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: [TokenTypes.REFRESH, TokenTypes.RESET_PASSWORD, TokenTypes.VERIFY_EMAIL],
    required: true,
  },
  blacklisted: {
    type: Boolean,
    required: true,
    default: false,
  },
}, {
  timestamps: true
});

TokenSchema.plugin(toJSON);

const Token = mongoose.model<TokenDocument>("Token", TokenSchema);

export default Token;
